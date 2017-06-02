//-------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-------------------------------------------------------

namespace JWTestExtensionResourceProvider.Tests
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using Microsoft.Azure.ResourceProvider;
    using Microsoft.Azure.ResourceProvider.Configuration;
    using Microsoft.Azure.ResourceProvider.Contracts;
    using Microsoft.Azure.ResourceProvider.Contracts.ResourceManagement;
    using Microsoft.Azure.ResourceProvider.Extensions;
    using Microsoft.Azure.ResourceProvider.ResourceManagement;
    using Microsoft.Azure.ResourceProvider.TestUtilities;
    using Microsoft.Azure.ResourceProvider.TestUtilities.Extensions;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Microsoft.WindowsAzure.ResourceStack.Common.Json;
    using Newtonsoft.Json.Linq;
    using JWTestExtensionResourceProvider;

    /// <summary>
    /// Resource Handler tests.
    /// </summary>
    [TestClass]
    public class ResourceHandlerUnitTests
    {
        /// <summary>
        /// The Api version.
        /// </summary>
        private const string ApiVersion = "2015-05-01-preview";

        /// <summary>
        /// The test resource group.
        /// </summary>
        private const string TestResourceGroup = "DefaultTestResourceGroup";

        /// <summary>
        /// The Resource Provider EventSource.
        /// </summary>
        private static ResourceProviderEventSource eventSource;

        /// <summary>
        /// The Resource Provider test host.
        /// </summary>
        private static ResourceProviderTestHost testHost;

        /// <summary>
        /// Default test credentials.
        /// </summary>
        private static string basicAuthHeaderValue;

        /// <summary>
        /// The Azure service configuration object.
        /// </summary>
        private static ResourceProviderServiceConfiguration serviceConfiguration;

        #region Test Host Initialiation

        /// <summary>
        /// Initializes the tests.
        /// </summary>
        /// <param name="context">The test context.</param>
        [ClassInitialize]
        public static void ClassInitialize(TestContext context)
        {
            eventSource = new ResourceProviderEventSource();

            var unencodedBasicAuthHeader = string.Format(
                CultureInfo.InvariantCulture,
                "{0}:{1}",
                TestEnvironment.DefaultEndpointUsername,
                TestEnvironment.DefaultEndpointPassword);
            basicAuthHeaderValue = Convert.ToBase64String(Encoding.UTF8.GetBytes(unencodedBasicAuthHeader));

            var defaultTestCredential = new NetworkCredential(
                TestEnvironment.DefaultEndpointUsername,
                TestEnvironment.DefaultEndpointPassword);

            serviceConfiguration = new ResourceProviderServiceConfiguration()
            {
                EventsConnectionString = TestEnvironment.EventConnectionString,
                EventsSchemaName = TestEnvironment.DefaultEventSchemaName,
                UsageConnectionString = TestEnvironment.UsageConnectionString,
                UsageSchemaName = TestEnvironment.DefaultUsageSchemaName,
                StorageConnectionString = TestEnvironment.DevStorageConnectionString,
                BaseEndpoint = TestEnvironment.ResourcesTestsUri,
                BaseEndpointAdminExtension = TestEnvironment.ResourcesTestsUri,
                BaseEndpointTenantExtension = TestEnvironment.ResourcesTestsUri,
            };

            serviceConfiguration.Manifest = new ManifestConfiguration
            {
                DefaultCommandTimeout = TimeSpan.FromSeconds(30),
                DefaultEndpointTimeout = TimeSpan.FromSeconds(30),
                AdminEndpointCredential = defaultTestCredential,
                EventEndpointCredential = defaultTestCredential,
                GalleryEndpointCredential = defaultTestCredential,
                ManifestEndpointCredential = defaultTestCredential,
                QuotaEndpointCredential = defaultTestCredential,
                TenantEndpointCredential = defaultTestCredential,
                UsageEndpointCredential = defaultTestCredential,
            };

            SubscriptionContext.DefaultQuotaEndpointUri = TestEnvironment.ResourcesTestsUri;
            SubscriptionContext.DefaultServiceQuotaGroups = InitializeDefaultServiceQuotaGroups();

            testHost = new ResourceProviderTestHost(
                TestEnvironment.ResourcesTestsUri,
                configuration =>
                {
                    JWTestExtensionResourceProviderApplication.Initialize(
                        httpConfiguration: configuration,
                        serviceConfiguration: serviceConfiguration,
                        eventSource: eventSource);
                });
        }

        /// <summary>
        /// Test cleanup.
        /// </summary>
        [ClassCleanup]
        public static void ClassCleanup()
        {
            if (eventSource != null)
            {
                eventSource.Dispose();
                eventSource = null;
            }

            if (testHost != null)
            {
                testHost.Dispose();
                testHost = null;
            }
        }

        #endregion

        #region Resource management tests.

        /// <summary>
        /// Attempt to create a resource without a valid subscription.
        /// The operation is expected to fail.
        /// </summary>
        [TestMethod]
        public void ResourceNoSubscriptionTest()
        {
            var missingSubscriptionId = Guid.NewGuid().ToString();

            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuthHeaderValue);

                // Create the resource
                var firstRootResource = CreateRootResourceDefinition(
                    subscriptionId: missingSubscriptionId,
                    resourceGroup: TestResourceGroup,
                    resourceName: "firstResource");
                var response = httpClient.PutSync(GetResourceUri(firstRootResource), firstRootResource.ToJson());
                Assert.IsFalse(response.IsSuccessStatusCode);

                var responseMessage = response.Content.ReadAsStringAsync().Result.FromJson<ErrorResponseMessage>();
                Assert.AreEqual(responseMessage.Error.Code.ToString(), "SubscriptionNotFound");
            }
        }

        /// <summary>
        /// Create a top level resource.
        /// </summary>
        [TestMethod]
        public void ResourceCreateRootResourceTest()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuthHeaderValue);

                // Create a subscription context. All resources must be created in the context of a subscription.
                using (var subscriptionContext = new SubscriptionContext(httpClient, providerNamespace: ManifestFactory.Namespace))
                {
                    // Create the resource
                    var firstRootResource = CreateRootResourceDefinition(
                        subscriptionId: subscriptionContext.SubscriptionId,
                        resourceGroup: TestResourceGroup,
                        resourceName: "firstResource");
                    ResourceDefinition resourceResponse = PutResource(
                        httpClient: httpClient,
                        resourceDefinition: firstRootResource,
                        isCreateRequest: true);
                    Assert.AreEqual(firstRootResource.Id, resourceResponse.Id);
                }
            }
        }

        /// <summary>
        /// Create a nested resource.
        /// </summary>
        [TestMethod]
        public void ResourceCreateNestedResourceTest()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuthHeaderValue);

                // Create a subscription context. All resources must be created in the context of a subscription.
                using (var subscriptionContext = new SubscriptionContext(httpClient, providerNamespace: ManifestFactory.Namespace))
                {
                    // Create the resource
                    var firstRootResource = CreateRootResourceDefinition(
                        subscriptionId: subscriptionContext.SubscriptionId,
                        resourceGroup: TestResourceGroup,
                        resourceName: "firstResource");
                    ResourceDefinition resourceResponse = PutResource(
                        httpClient: httpClient,
                        resourceDefinition: firstRootResource,
                        isCreateRequest: true);
                    Assert.AreEqual(firstRootResource.Id, resourceResponse.Id);

                    // Create the first nested resource
                    var nestedResource1 = CreateNestedResourceDefinition(
                        subscriptionId: subscriptionContext.SubscriptionId,
                        resourceGroup: TestResourceGroup,
                        resourceName: "nestedResource1",
                        parentResource: firstRootResource);
                    resourceResponse = PutResource(
                        httpClient: httpClient,
                        resourceDefinition: nestedResource1,
                        isCreateRequest: true);
                    Assert.AreEqual(nestedResource1.Id, resourceResponse.Id);

                    // Create the second nested resource
                    var nestedResource2 = CreateNestedResourceDefinition(
                        subscriptionId: subscriptionContext.SubscriptionId,
                        resourceGroup: TestResourceGroup,
                        resourceName: "nestedResource2",
                        parentResource: firstRootResource);
                    resourceResponse = PutResource(
                        httpClient: httpClient,
                        resourceDefinition: nestedResource2,
                        isCreateRequest: true);
                    Assert.AreEqual(nestedResource2.Id, resourceResponse.Id);
                }
            }
        }

        /// <summary>
        /// Delete a top level resource.
        /// </summary>
        [TestMethod]
        public void ResourceDeleteRootResourceTest()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuthHeaderValue);

                // Create a subscription context. All resources must be created in the context of a subscription.
                using (var subscriptionContext = new SubscriptionContext(httpClient, providerNamespace: ManifestFactory.Namespace))
                {
                    // Create the resource
                    var firstRootResource = CreateRootResourceDefinition(
                        subscriptionId: subscriptionContext.SubscriptionId,
                        resourceGroup: TestResourceGroup,
                        resourceName: "firstResource");
                    ResourceDefinition resourceResponse = PutResource(
                        httpClient: httpClient,
                        resourceDefinition: firstRootResource,
                        isCreateRequest: true);
                    Assert.AreEqual(firstRootResource.Id, resourceResponse.Id);

                    // Delete the root resource
                    var response = httpClient.DeleteSync(GetResourceUri(firstRootResource));
                    Assert.IsTrue(response.IsSuccessStatusCode);
                }
            }
        }

        /// <summary>
        /// Delete a top level resource along with its children.
        /// </summary>
        [TestMethod]
        public void ResourceDeleteNestedResourceTest()
        {
            using (var httpClient = new HttpClient())
            {
                httpClient.Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicAuthHeaderValue);

                // Create a subscription context. All resources must be created in the context of a subscription.
                using (var subscriptionContext = new SubscriptionContext(httpClient, providerNamespace: ManifestFactory.Namespace))
                {
                    // Create the resource
                    var firstRootResource = CreateRootResourceDefinition(
                        subscriptionId: subscriptionContext.SubscriptionId,
                        resourceGroup: TestResourceGroup,
                        resourceName: "firstResource");
                    ResourceDefinition resourceResponse = PutResource(
                        httpClient: httpClient,
                        resourceDefinition: firstRootResource,
                        isCreateRequest: true);
                    Assert.AreEqual(firstRootResource.Id, resourceResponse.Id);

                    // Create the first nested resource
                    var nestedResource1 = CreateNestedResourceDefinition(
                        subscriptionId: subscriptionContext.SubscriptionId,
                        resourceGroup: TestResourceGroup,
                        resourceName: "nestedResource1",
                        parentResource: firstRootResource);
                    resourceResponse = PutResource(
                        httpClient: httpClient,
                        resourceDefinition: nestedResource1,
                        isCreateRequest: true);
                    Assert.AreEqual(nestedResource1.Id, resourceResponse.Id);

                    // Create the second nested resource
                    var nestedResource2 = CreateNestedResourceDefinition(
                        subscriptionId: subscriptionContext.SubscriptionId,
                        resourceGroup: TestResourceGroup,
                        resourceName: "nestedResource2",
                        parentResource: firstRootResource);
                    resourceResponse = PutResource(
                        httpClient: httpClient,
                        resourceDefinition: nestedResource2,
                        isCreateRequest: true);
                    Assert.AreEqual(nestedResource2.Id, resourceResponse.Id);

                    // Delete the first nested resource
                    var response = httpClient.DeleteSync(GetResourceUri(nestedResource1));
                    Assert.IsTrue(response.IsSuccessStatusCode);

                    // Delete the second nested resource
                    response = httpClient.DeleteSync(GetResourceUri(nestedResource2));
                    Assert.IsTrue(response.IsSuccessStatusCode);

                    // Delete the root resource
                    response = httpClient.DeleteSync(GetResourceUri(firstRootResource));
                    Assert.IsTrue(response.IsSuccessStatusCode);
                }
            }
        }

        #endregion

        #region Subscription Creation helpers

        /// <summary>
        /// Initialize the service quota groups for
        /// </summary>
        /// <param name="rootResourceCount">Optional. Default = 10. The maximum allowed root resource count for the subscription.</param>
        /// <param name="nestedResourceCount">Optional. Default = 10. The maximum allowed nested resource count for the subscription.</param>
        private static ServiceQuotaGroup[] InitializeDefaultServiceQuotaGroups(
            int rootResourceCount = 10,
            int nestedResourceCount = 10)
        {
            var quota = new ServiceQuota
            {
                RootResourceCountLimit = rootResourceCount,
                NestedResourceCountLimit = nestedResourceCount,
            };

            return new[]
            {
                new ServiceQuotaGroup
                {
                    InstanceCount = 1,
                    QuotaSettings = new Dictionary<string, JToken>()
                    {
                        {
                            "JWTestExtensionResourceProviderQuota",
                            JToken.FromObject(quota)
                        }
                    }
                }
            };
        }

        #endregion

        #region Resource Creation helpers

        /// <summary>
        /// Helper method to create a Resource Provider Resource.
        /// </summary>
        /// <param name="subscriptionId">The Subscription Id.</param>
        /// <param name="resourceGroup">The resource group name.</param>
        /// <param name="resourceName">The name of the resource.</param>
        private static ResourceDefinition CreateRootResourceDefinition(
            string subscriptionId,
            string resourceGroup,
            string resourceName)
        {
            string displayName = string.Format(CultureInfo.InvariantCulture, "The {0} root resource.", resourceName);
            var rootResourceEntity = new RootResource() { DisplayName = displayName };
            return new ResourceDefinition(
                resourceIdentifier: ResourceGroupWideResourceIdentifier.CreateValidatedResourceGroupWideResourceIdentifier(
                    subscriptionId: subscriptionId,
                    resourceGroupName: resourceGroup,
                    resourceTypeName: new ResourceTypeName(ManifestFactory.Namespace, ManifestFactory.RootResourceTypeName),
                    resourceName: new ResourceName(resourceName)),
                properties: rootResourceEntity.ToJToken(),
                location: "DefaultLocation");
        }

        /// <summary>
        /// Helper method to create a Resource Provider nested resource.
        /// </summary>
        /// <param name="subscriptionId">The Subscription Id.</param>
        /// <param name="resourceGroup">The resource group name.</param>
        /// <param name="resourceName">The name of the nested resource.</param>
        /// <param name="parentResource">The parent resource of the nested resource.</param>
        private static ResourceDefinition CreateNestedResourceDefinition(
            string subscriptionId,
            string resourceGroup,
            string resourceName,
            ResourceDefinition parentResource)
        {
            string displayName = string.Format(CultureInfo.InvariantCulture, "The {0} nested resource.", resourceName);
            var nestedResourceEntity = new NestedResource() { DisplayName = displayName };
            return new ResourceDefinition(
                resourceIdentifier: ResourceGroupWideResourceIdentifier.CreateValidatedResourceGroupWideResourceIdentifier(
                    subscriptionId: subscriptionId,
                    resourceGroupName: resourceGroup,
                    resourceTypeName: new ResourceTypeName(ManifestFactory.Namespace, ManifestFactory.RootResourceTypeName, ManifestFactory.NestedResourceTypeName),
                    resourceName: new ResourceName(parentResource.Name, resourceName)),
                properties: nestedResourceEntity.ToJToken(),
                location: "DefaultLocation");
        }

        /// <summary>
        /// Put a resource.
        /// </summary>
        /// <param name="httpClient">The client.</param>
        /// <param name="resourceDefinition">The resource definition.</param>
        /// <param name="isCreateRequest">True - If this is a create request.</param>
        /// <param name="expectedStatusCode">The expected HTTP status.</param>
        /// <param name="expectedErrorCode">The expected error code.</param>
        private static ResourceDefinition PutResource(
           HttpClient httpClient,
           ResourceDefinition resourceDefinition,
           bool isCreateRequest,
           HttpStatusCode? expectedStatusCode = null,
           string expectedErrorCode = null)
        {
            expectedStatusCode = expectedStatusCode ?? (isCreateRequest ? HttpStatusCode.Created : HttpStatusCode.OK);

            // Perform the put request (leveraging verification callbacks above)
            var uri = GetResourceUri(resourceDefinition);
            var referrerUri = GetResourceUri(resourceDefinition, TestEnvironment.ReferrerUri);
            httpClient.DefaultRequestHeaders.Referrer = referrerUri;

            HttpResponseMessage response = httpClient.PutSync(uri, resourceDefinition.ToJson());
            Assert.AreEqual(expectedStatusCode, response.StatusCode);

            var responseJson = response.Content.ReadAsStringAsync().Result;
            if (response.IsSuccessStatusCode)
            {
                ResourceDefinitionValidator.ValidateResponseIsEquivalentToResource(resourceDefinition, response);
                return responseJson.FromJson<ResourceDefinition>();
            }

            var errorResponse = responseJson.FromJson<ErrorResponseMessage>();
            if (!string.IsNullOrEmpty(expectedErrorCode))
            {
                Assert.AreEqual(expectedErrorCode, errorResponse.Error.Code);
            }

            return null;
        }

        #endregion

        #region Resource URI helpers

        /// <summary>
        /// Helper method to create a resource request URI.
        /// </summary>
        /// <param name="resourceDefinition">The <see cref="ResourceDefinition"/> of the resource to retrieve.</param>
        private static Uri GetResourceUri(ResourceDefinition resourceDefinition)
        {
            return (new Uri(TestEnvironment.ResourcesTestsUri, resourceDefinition.Id))
                .AppendApiVersion(ApiVersion);
        }

        /// <summary>
        /// Helper method to create a resource request URI.
        /// </summary>
        /// <param name="resourceDefinition">The <see cref="ResourceDefinition"/> of the resource to retrieve.</param>
        /// <param name="baseEndpointUri">The base endpoint URI.</param>
        private static Uri GetResourceUri(ResourceDefinition resourceDefinition, Uri baseEndpointUri)
        {
            return new Uri(baseEndpointUri, resourceDefinition.Id);
        }

        #endregion
    }
}
