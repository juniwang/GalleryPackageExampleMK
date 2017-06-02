//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider
{
    using System;
    using System.Globalization;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using JWTestExtensionResourceProvider.ErrorHandling;
    using Microsoft.Azure.ResourceProvider.Configuration;
    using Microsoft.Azure.ResourceProvider.Contracts;
    using Microsoft.Azure.ResourceProvider.Contracts.ResourceManagement;
    using Microsoft.Azure.ResourceProvider.DataProviders;
    using Microsoft.Azure.ResourceProvider.Entities;
    using Microsoft.Azure.ResourceProvider.ExceptionHandling;
    using Microsoft.Azure.ResourceProvider.Extensions;
    using Microsoft.Azure.ResourceProvider.ResourceManagement;
    using Microsoft.WindowsAzure.ResourceStack.Common.Storage;
    using JWTestExtensionResourceProvider.RequestHandlers;

    /// <summary>
    /// The resource provider resource request handler.
    /// </summary>
    /// <remarks>
    /// Manages requests for all resources managed by the resource provider,
    /// by implementing the IResourceRequestHandler interface.
    /// </remarks>
    public sealed class NestedResourceTypeRequestHandler : IManagedResourceGroupWideResourceTypeRequestHandler
    {
        /// <summary>
        /// Instance of Resource Provider storage implementation
        /// <remarks>
        /// Resource Provider SDK provides DefaultResourceProviderStorage implementation for use with Azure table storage.
        /// </remarks>
        /// </summary>
        private readonly IResourceProviderStorage resourceProviderStorage;

        /// <summary>
        /// Initializes a new instance of the <see cref="NestedResourceTypeRequestHandler"/> class.
        /// </summary>
        /// <param name="resourceProviderStorage">The Resource Provider storage implementation.</param>
        public NestedResourceTypeRequestHandler(IResourceProviderStorage resourceProviderStorage)
        {
            ArgumentValidator.ValidateNotNull("resourceProviderStorage", resourceProviderStorage);
            this.resourceProviderStorage = resourceProviderStorage;
        }

        #region IResourceTypeRequestHandler implementation

        /// <summary>
        /// Enumerates the localized operations for the specified culture.
        /// </summary>
        /// <param name="cultureInfo">The culture information.</param>
        /// <returns>
        /// An array of <see cref="OperationDefinition" /> for all the operations supported by this resource type.
        /// </returns>
        OperationDefinition[] IManagedResourceGroupWideResourceTypeRequestHandler.OnEnumerateOperations(CultureInfo cultureInfo)
        {
            // Lock access to OperationResources from other threads
            lock (OperationResourcesLock.Instance)
            {
                OperationResources.Culture = cultureInfo;

                var qualifiedResourceTypeName = ManifestFactory.Namespace + "/" + ManifestFactory.RootResourceTypeName;

                // Create standard operation descriptors that will be shared across resource types.
                var operationDefinitions = new[]
                {
                    new OperationDefinition
                    {
                        Name = qualifiedResourceTypeName + "/" + ResourceOperationName.Read,
                        Origin = ResourceOperationOrigins.UserAndSystem.ToString(),
                        Display = new OperationDisplayDefinition()
                        {
                            Provider = OperationResources.ResourceProviderDisplayName,
                            Resource = OperationResources.NestedResourceTypeDisplayName,
                            Operation = OperationResources.NestedResourceTypeReadOperationDisplayName,
                            Description = OperationResources.NestedResourceTypeReadOperationDescription,
                        },
                    },

                    new OperationDefinition
                    {
                        Name = qualifiedResourceTypeName + "/" + ResourceOperationName.Write,
                        Origin = ResourceOperationOrigins.UserAndSystem.ToString(),
                        Display = new OperationDisplayDefinition()
                        {
                            Provider = OperationResources.ResourceProviderDisplayName,
                            Resource = OperationResources.NestedResourceTypeDisplayName,
                            Operation = OperationResources.NestedResourceTypeWriteOperationDisplayName,
                            Description = OperationResources.NestedResourceTypeWriteOperationDescription,
                        },
                    },

                    new OperationDefinition
                    {
                        Name = qualifiedResourceTypeName + "/" + ResourceOperationName.Delete,
                        Origin = ResourceOperationOrigins.UserAndSystem.ToString(),
                        Display = new OperationDisplayDefinition()
                        {
                            Provider = OperationResources.ResourceProviderDisplayName,
                            Resource = OperationResources.NestedResourceTypeDisplayName,
                            Operation = OperationResources.NestedResourceTypeDeleteOperationDisplayName,
                            Description = OperationResources.NestedResourceTypeDeleteOperationDescription,
                        },
                    },
                };

                OperationResources.Culture = null;
                return operationDefinitions;
            }
        }

        /// <summary>
        /// Called for each resource that is returned to the client.
        /// </summary>
        /// <param name="requestContext">The request context.</param>
        /// <param name="resource">The resource to project.</param>
        /// <remarks>
        /// Use requestContext.ApiVersion to get the API version of the request.
        /// Return the unmodified input resource parameter if no projection is necessary.
        /// </remarks>
        Task IManagedResourceGroupWideResourceTypeRequestHandler.OnProjectResource(RequestContext requestContext, IResourceEntity resource)
        {
            // TODO: Customize resource.Properties or resource.InternalState  before returning the resource to the caller.

            return Task.FromResult(false);
        }

        /// <summary>
        /// Called before the resource is inserted in the storage layer.
        /// </summary>
        /// <param name="requestContext">The request context.</param>
        /// <param name="subscription">The subscription.</param>
        /// <param name="requestResourceEntity">The request resource entity.</param>
        /// <returns>
        /// A <see cref="ResourceDefinition" /> that has been validated and projected to the desired
        /// state so that it may be safely inserted in the storage layer.
        /// </returns>
        /// <remarks>
        /// Use requestContext.ApiVersion to get the API version of the request.
        /// If the requestResourceEntity is invalid, throw a <see cref="ResourceProviderException" /> to fail the request.
        /// </remarks>
        public Task OnBeforeInsertResource(RequestContext requestContext, SubscriptionNotificationDefinition subscription, IResourceEntity requestResourceEntity)
        {
            // TODO: (florbe) Validate the resource definition.
            // TODO: (florbe) Project the resource definition Properties section to the desired internal format.

            return Task.FromResult(false);
        }

        /// <summary>
        /// Called after a resource is created in the storage layer.
        /// </summary>
        /// <remarks>
        /// Use requestContext.ApiVersion to get the API version of the request.
        /// </remarks>
        /// <param name="requestContext">The request context.</param>
        /// <param name="subscription">The subscription.</param>
        /// <param name="createdResource">The created resource.</param>
        async Task<ResourceOperationStatus> IManagedResourceGroupWideResourceTypeRequestHandler.OnAfterInsertResource(
            RequestContext requestContext,
            SubscriptionNotificationDefinition subscription,
            IResourceEntity createdResource)
        {
            ArgumentValidator.ValidateNotNull("requestContext", requestContext);
            ArgumentValidator.ValidateNotNull("subscription", subscription);
            ArgumentValidator.ValidateNotNull("createdResource", createdResource);

            // Enforce quotas for nested resources.
            ServiceQuota[] quotas = ServiceQuota.CreateSubscriptionQuotaFromSubscriptionNotification(
                createdResource.SubscriptionId,
                subscription);

            // Count aggregated quota for nested resources for the entire subscription.
            int nestedResourceCountLimit = 0;
            quotas.ToList().ForEach(quota => nestedResourceCountLimit += quota.NestedResourceCountLimit);

            int resourceCount = 0;
            DataContinuationToken continuationToken = null;

            do
            {
                var result = await this.resourceProviderStorage
                    .ResourceDataProvider
                    .FindResources(
                        createdResource.SubscriptionId,
                        createdResource.QualifiedTypeName,
                        continuationToken: continuationToken);

                resourceCount += result.Entities.Length;
                continuationToken = result.ContinuationToken;

            } while (continuationToken != null);

            // TODO: Apply custom quota enforcement logic here.

            // Check that there is sufficient quota to create additional resources (enforce the resource count)
            if (nestedResourceCountLimit < resourceCount)
            {
                string errorMessage = string.Format(CultureInfo.CurrentCulture, ResponseErrorMessages.InsufficientResourceQuota, createdResource.Name);
                throw new ResourceProviderException(errorMessage, ResponseErrorCode.InsufficientQuota.ToString(), HttpStatusCode.BadRequest);
            }

            // TODO: Add custom nested resource creation logic here.

            return ResourceOperationStatus.CompleteSynchronously(createdResource);
        }

        /// <summary>
        /// Called when a proxy request is made on a managed resource.
        /// </summary>
        /// <param name="requestContext">The request context.</param>
        /// <param name="subscription">The subscription notification.</param>
        /// <param name="resourceEntity">The resource entity.</param>
        /// <param name="proxySuffix">The proxy suffix containing the request URI segments that up to the last segment of the resource identifier.</param>
        /// <returns>
        /// An <see cref="OperationStatus" /> indicating the status of the operation and the update
        /// state of the <see cref="IResourceEntity" /> instance.
        /// </returns>
        /// <remarks>
        /// Use requestContext.ApiVersion to get the API version of the request.
        /// </remarks>
        public Task<ProxyOperationStatus> OnProxyRequest(RequestContext requestContext, SubscriptionNotificationDefinition subscription, IResourceEntity resourceEntity, string proxySuffix)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Called when resource is deleted.
        /// </summary>
        /// <remarks>
        /// A request context is not necessary to delete a resource.
        /// </remarks>
        /// <param name="deletedResource">The deleted resource.</param>
        Task<ResourceOperationStatus> IManagedResourceGroupWideResourceTypeRequestHandler.OnDeleteResource(IResourceEntity deletedResource)
        {
            ArgumentValidator.ValidateNotNull("deletedResource", deletedResource);

            // TODO: Add custom nested resource deletion logic here.

            return Task.FromResult(ResourceOperationStatus.CompleteSynchronously(deletedResource));
        }

        /// <summary>
        /// Called when an existing resource is updated.
        /// </summary>
        /// <param name="requestContext">The request context.</param>
        /// <param name="subscription">The subscription.</param>
        /// <param name="existingResourceEntity">The existing resource, to be updated.</param>
        /// <param name="updatedResourceDefinition">The updated <see cref="ResourceDefinition"/>.</param>
        Task<ResourceOperationStatus> IManagedResourceGroupWideResourceTypeRequestHandler.OnPatchResource(
            RequestContext requestContext,
            SubscriptionNotificationDefinition subscription,
            IResourceEntity existingResourceEntity,
            ResourceDefinition updatedResourceDefinition)
        {
            ArgumentValidator.ValidateNotNull("requestContext", requestContext);
            ArgumentValidator.ValidateNotNull("subscription", subscription);
            ArgumentValidator.ValidateNotNull("existingResourceEntity", existingResourceEntity);
            ArgumentValidator.ValidateNotNull("updatedResourceDefinition", updatedResourceDefinition);

            // TODO: Implement custom logic for updating a resource.

            return Task.FromResult(ResourceOperationStatus.CompleteSynchronously(existingResourceEntity));
        }

        /////// <summary>
        /////// Called when there is a request for proxy resources or custom actions.
        /////// </summary>
        /////// <param name="requestContext">The request context.</param>
        /////// <param name="subscription">The subscription.</param>
        /////// <param name="resource">The resource.</param>
        /////// <param name="proxySuffix">The proxy suffix.</param>
        /////// <remarks>
        /////// Use requestContext.ApiVersion to get the API version of the request.
        /////// </remarks>
        ////Task<ProxyOperationStatus> IManagedResourceTypeRequestHandler.OnProxyRequest(
        ////    RequestContext requestContext,
        ////    SubscriptionNotification subscription,
        ////    IResourceEntity resource,
        ////    string proxySuffix)
        ////{
        ////    ArgumentValidator.ValidateNotNull("requestContext", requestContext);
        ////    ArgumentValidator.ValidateNotNull("subscription", subscription);
        ////    ArgumentValidator.ValidateNotNull("resource", resource);
        ////    ArgumentValidator.ValidateNotEmpty("proxySuffix", proxySuffix);

        ////    // TODO: Optional - Implement logic for proxy resources or custom actions supported by the resource provider.

        ////    throw new NotImplementedException();
        ////}

        /// <summary>
        /// Called when resource is resumed.
        /// </summary>
        /// <remarks>
        /// A request context is not necessary to resume a resource.
        /// </remarks>
        /// <param name="resumedResource">The resumed resource.</param>
        Task<IResourceEntity> IManagedResourceGroupWideResourceTypeRequestHandler.OnResumeResource(IResourceEntity resumedResource)
        {
            ArgumentValidator.ValidateNotNull("resumedResource", resumedResource);

            // TODO: Implement custom logic to resume resource operation.

            return Task.FromResult(resumedResource);
        }

        /// <summary>
        /// Called when resource is suspended.
        /// </summary>
        /// <remarks>
        /// A request context is not necessary to suspend a resource.
        /// </remarks>
        /// <param name="suspendedResource">The suspended resource.</param>
        Task<IResourceEntity> IManagedResourceGroupWideResourceTypeRequestHandler.OnSuspendResource(IResourceEntity suspendedResource)
        {
            ArgumentValidator.ValidateNotNull("suspendedResource", suspendedResource);

            // TODO: Implement custom logic to suspend resource operation.

            return Task.FromResult(suspendedResource);
        }

        /// <summary>
        /// Called before a resource is updated in the storage layer.
        /// </summary>
        /// <remarks>
        /// Use requestContext.ApiVersion to get the API version of the request.
        /// </remarks>
        /// <param name="requestContext">The request context.</param>
        /// <param name="subscription">The subscription.</param>
        /// <param name="existingResource">The existing resource.</param>
        /// <param name="updatedResourceDefinition">The updated resource definition.</param>
        Task<ResourceOperationStatus> IManagedResourceGroupWideResourceTypeRequestHandler.OnUpdateResource(
            RequestContext requestContext,
            SubscriptionNotificationDefinition subscription,
            IResourceEntity existingResource,
            ResourceDefinition updatedResourceDefinition)
        {
            ArgumentValidator.ValidateNotNull("requestContext", requestContext);
            ArgumentValidator.ValidateNotNull("subscription", subscription);
            ArgumentValidator.ValidateNotNull("existingResource", existingResource);
            ArgumentValidator.ValidateNotNull("updatedResourceDefinition", updatedResourceDefinition);

            // TODO: Implement custom logic to update the resource.

            return Task.FromResult(ResourceOperationStatus.CompleteSynchronously(existingResource));
        }

        #endregion
    }
}
