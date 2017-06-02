//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider
{
    using System;
    using System.Configuration;
    using System.Diagnostics;
    using System.Globalization;
    using System.Net;
    using System.Reflection;
    using System.Web;
    using System.Web.Http;
    using Microsoft.Azure.ResourceProvider;
    using Microsoft.Azure.ResourceProvider.Configuration;
    using Microsoft.Azure.ResourceProvider.Contracts;
    using Microsoft.Azure.ResourceProvider.Contracts.ResourceManagement;
    using Microsoft.Azure.ResourceProvider.Controllers;
    using Microsoft.Azure.ResourceProvider.DataProviders;
    using Microsoft.Azure.ResourceProvider.ExceptionHandling;
    using Microsoft.Azure.ResourceProvider.Filters;
    using Microsoft.Azure.ResourceProvider.ResourceManagement;
    using Microsoft.Azure.ResourceProvider.Utilities;
    using Microsoft.WindowsAzure.ResourceStack.Common.EventSources;
    using Microsoft.WindowsAzure.ResourceStack.Common.Extensions;
    using Microsoft.WindowsAzure.ResourceStack.Common.Json;
    using JWTestExtensionResourceProvider.ErrorHandling;

    /// <summary>
    /// The ResourceProviderApplication implementation
    /// </summary>
    public class JWTestExtensionResourceProviderApplication : HttpApplication
    {
        /// <summary>
        /// Implementation of ICommonEventSource, required by the Resource Provider SDK to trace its operations.
        /// </summary>
        private ResourceProviderEventSource eventSource;

        /// <summary>
        /// Custom EventSource implementation used to trace operations of this Resource Provider.
        /// </summary>
        private ServiceEventSource serviceEventSource;

        /// <summary>
        /// Gets the current version of this Resource Provider application.
        /// </summary>
        internal static string CurrentVersion
        {
            get { return FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).FileVersion.ToString(); }
        }

        /// <summary>
        /// Application_Start method
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1822:MarkMembersAsStatic", Justification = "Application_Start handler cannot be made Static")]
        protected void Application_Start()
        {
            this.eventSource = new ResourceProviderEventSource();
            this.serviceEventSource = new ServiceEventSource();

            serviceEventSource.ApplicationStarting(this.GetType().Name, JWTestExtensionResourceProviderApplication.CurrentVersion);

            ResourceProviderServiceConfiguration serviceConfiguration;
            ConfigurationErrorsException exception;

            if (new ConfigurationReader()
                .Initialize(this.eventSource)
                .TryGetConfiguration<ResourceProviderServiceConfiguration>(out serviceConfiguration, out exception))
            {
                // Initialize application if service configuration initialized successfully.
                JWTestExtensionResourceProviderApplication.Initialize(
                    httpConfiguration: GlobalConfiguration.Configuration,
                    serviceConfiguration: serviceConfiguration,
                    eventSource: eventSource);

                serviceEventSource.ApplicationStarted(this.GetType().Name, JWTestExtensionResourceProviderApplication.CurrentVersion);
            }
            else
            {
                // Log error and don't initialize the service.
                serviceEventSource.ConfigurationReadFailed(exception.Message);
            }
        }

        /// <summary>
        /// Application_End method
        /// </summary>
        protected void Application_End()
        {
            serviceEventSource.ApplicationEnding(this.GetType().Name, JWTestExtensionResourceProviderApplication.CurrentVersion);

            ConfigurationWatcher.Stop();

            if (eventSource != null)
            {
                eventSource.Dispose();
                eventSource = null;
            }

            serviceEventSource.ApplicationEnded(this.GetType().Name, JWTestExtensionResourceProviderApplication.CurrentVersion);
        }

        /// <summary>
        /// Initializes the resource provider application.
        /// </summary>
        /// <param name="httpConfiguration">The default HttpConfiguration object for this application.</param>
        /// <param name="serviceConfiguration">The service configuration object containing resource provider settings.</param>
        /// <param name="eventSource">The event source used for logging resource provider operations.</param>
        public static void Initialize(
            HttpConfiguration httpConfiguration,
            ResourceProviderServiceConfiguration serviceConfiguration,
            ICommonEventSource eventSource)
        {
            ArgumentValidator.ValidateNotNull("httpConfiguration", httpConfiguration);
            ArgumentValidator.ValidateNotNull("serviceConfiguration", serviceConfiguration);
            ArgumentValidator.ValidateNotNull("eventSource", eventSource);

            httpConfiguration.Filters.Add(new ResourceProviderExceptionFilterAttribute(eventSource));

            // Ensure use of the JsonMediaTypeFormatter provided by the RP SDK, which guarantees the correct
            // JSON serialization settings for ARM interoperability.
            httpConfiguration.Formatters.Clear();
            httpConfiguration.Formatters.Add(JsonExtensions.JsonMediaTypeFormatter);

            var manifest = ManifestFactory.CreateResourceProviderManifest(serviceConfiguration);

            ResourceProviderManager.RegisterCredentialAuthorization(
                httpConfiguration: httpConfiguration,
                eventSource: eventSource,
                manifestEndpointCredential: serviceConfiguration.Manifest.ManifestEndpointCredential,
                providerManifests: new ResourceProviderManifest[] { manifest });

            ResourceProviderManager.RegisterEventsController(
                httpConfiguration: httpConfiguration,
                providerManifest: manifest,
                eventSource: eventSource,
                eventsConnectionString: serviceConfiguration.EventsConnectionString.ConnectionString,
                eventSchemaName: serviceConfiguration.EventsSchemaName);

            // TODO: Enable Azure Gallery item controller, when publishing a gallery item.
            //ResourceProviderManager.RegisterGalleryController(
            //    httpConfiguration: httpConfiguration,
            //    providerManifest: manifest,
            //    galleryItemsResources: null);

            ResourceProviderManager.RegisterProviderManifestController(
                httpConfiguration: httpConfiguration,
                manifestEndpointUri: serviceConfiguration.BaseEndpoint.AbsoluteUri,
                eventSource: eventSource,
                providerManifest: manifest);

            // Create the resource provider storage.
            var resourceProviderStorage = new DefaultResourceProviderStorage(
                connectionStrings: new string[] { serviceConfiguration.StorageConnectionString },
                eventSource: eventSource);

            // Create and initialize the handler configurations for each registered resource type.
            var resourceHandlers = new ResourceTypeHandlerConfiguration[] {
                ResourceTypeHandlerConfiguration.CreateResourceGroupWideResourceTypeHandlerConfiguration(
                    resourceTypeName: new ResourceTypeName(ManifestFactory.Namespace, ManifestFactory.RootResourceTypeName),
                    apiVersions: new string[] { serviceConfiguration.ApiVersion },
                    resourceProviderStorage: resourceProviderStorage,
                    eventSource: eventSource,
                    managedResourceTypeRequestHandler: new RootResourceTypeRequestHandler(resourceProviderStorage)),
                ResourceTypeHandlerConfiguration.CreateResourceGroupWideResourceTypeHandlerConfiguration(
                    resourceTypeName: new ResourceTypeName(ManifestFactory.Namespace, ManifestFactory.RootResourceTypeName, ManifestFactory.NestedResourceTypeName),
                    apiVersions: new string[] { serviceConfiguration.ApiVersion },
                    resourceProviderStorage: resourceProviderStorage,
                    eventSource: eventSource,
                    managedResourceTypeRequestHandler: new NestedResourceTypeRequestHandler(resourceProviderStorage))
            };

            ResourceProviderManager.RegisterResourceProvider(
                httpConfiguration: httpConfiguration,
                eventSource: eventSource,
                providerStorage: resourceProviderStorage,
                providerNamespace: manifest.Namespace,
                resourceTypeHandlerConfigurationCollection: resourceHandlers);

            ResourceProviderManager.RegisterUsageController(
                httpConfiguration: httpConfiguration,
                providerManifest: manifest,
                handler: null,
                eventSource: eventSource,
                usageConnectionString: serviceConfiguration.UsageConnectionString.ConnectionString,
                usageSchemaName: serviceConfiguration.UsageSchemaName);
        }
    }
}
