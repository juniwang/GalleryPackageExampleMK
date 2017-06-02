//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using Microsoft.Azure.ResourceProvider;
    using Microsoft.Azure.ResourceProvider.Contracts;
    using Microsoft.Azure.ResourceProvider.ExceptionHandling;

    /// <summary>
    /// Create an instance of the resource provider manifest.
    /// </summary>
    public static class ManifestFactory
    {
        public static readonly string Namespace = "Contoso.JWTestExtensionResourceProvider";

        /// <summary>
        /// The root resource type name.
        /// </summary>
        public static readonly string RootResourceTypeName = "rootResources";

        /// <summary>
        /// The nested resource type name.
        /// </summary>
        public static readonly string NestedResourceTypeName = "nestedResources";

        /// <summary>
        /// Populate the resource provider manifest for the resource provider.
        /// </summary>
        /// <param name="serviceConfiguration">The service configuration object containing resource provider settings.</param>
        /// <returns>The resource provider manifest used to specify service configuration.</returns>
        public static ResourceProviderManifest CreateResourceProviderManifest(
            ResourceProviderServiceConfiguration serviceConfiguration)
        {
            ArgumentValidator.ValidateNotNull("serviceConfiguration", serviceConfiguration);

            // TODO: In order to report Usage data correctly, populate the metered resource Ids with
            // unique identifiers for each meter which will be reported by Usage.
            string[] meteredResourceIds = null;

            var manifest = new ResourceProviderManifest
            {
                ProviderVersion = serviceConfiguration.ApiVersion,
                Namespace = ManifestFactory.Namespace,
                BaseAdminApiEndpoint = new ResourceProviderEndpoint
                {
                    ApiVersion = serviceConfiguration.ApiVersion,
                    EndpointUri = serviceConfiguration.BaseEndpoint.AbsoluteUri,
                    Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout,
                    AuthenticationUsername = serviceConfiguration.Manifest.AdminEndpointUserName,
                    AuthenticationPassword = serviceConfiguration.Manifest.AdminEndpointPassword,
                    Enabled = true
                },
                AdminResourceTypes = new ResourceType[]
                {
                    new ResourceType
                    {
                        Name = "AdminResource"
                    }
                },
                BaseTenantApiEndpoint = new ResourceProviderEndpoint
                {
                    ApiVersion = serviceConfiguration.ApiVersion,
                    EndpointUri = serviceConfiguration.BaseEndpoint.AbsoluteUri,
                    Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout,
                    AuthenticationUsername = serviceConfiguration.Manifest.TenantEndpointUserName,
                    AuthenticationPassword = serviceConfiguration.Manifest.TenantEndpointPassword,
                    Enabled = true
                },
                TenantResourceTypes = new ResourceType[]
                {
                    new ResourceType
                    {
                        Name = "rootResources",
                        MeteredResourceIds = meteredResourceIds
                    },
                    new ResourceType
                    {
                        Name = "rootResources/nestedResources",
                        MeteredResourceIds = meteredResourceIds
                    }
                },
                QuotaApiEndpoint = new ResourceProviderEndpoint
                {
                    ApiVersion = serviceConfiguration.ApiVersion,
                    EndpointUri = serviceConfiguration.BaseEndpoint.AbsoluteUri,
                    Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout,
                    AuthenticationUsername = serviceConfiguration.Manifest.QuotaEndpointUserName,
                    AuthenticationPassword = serviceConfiguration.Manifest.QuotaEndpointPassword,
                    Enabled = true
                },
                EventApiEndpoint = new ResourceProviderEndpoint
                {
                    ApiVersion = serviceConfiguration.ApiVersion,
                    EndpointUri = serviceConfiguration.BaseEndpoint.AbsoluteUri,
                    Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout,
                    AuthenticationUsername = serviceConfiguration.Manifest.EventEndpointUserName,
                    AuthenticationPassword = serviceConfiguration.Manifest.EventEndpointPassword,
                    Enabled = true
                },
                GalleryApiEndpoint = new ResourceProviderEndpoint
                {
                    ApiVersion = serviceConfiguration.ApiVersion,
                    EndpointUri = serviceConfiguration.BaseEndpoint.AbsoluteUri,
                    Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout,
                    AuthenticationUsername = serviceConfiguration.Manifest.GalleryEndpointUserName,
                    AuthenticationPassword = serviceConfiguration.Manifest.GalleryEndpointPassword,
                    Enabled = true
                },
                UsageApiEndpoint = new ResourceProviderEndpoint
                {
                    ApiVersion = serviceConfiguration.ApiVersion,
                    EndpointUri = serviceConfiguration.BaseEndpoint.AbsoluteUri,
                    Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout,
                    AuthenticationUsername = serviceConfiguration.Manifest.UsageEndpointUserName,
                    AuthenticationPassword = serviceConfiguration.Manifest.UsageEndpointPassword,
                    Enabled = true
                },
                AdminExtensionName = "JWTestExtensionResourceProviderAdminExtension",
                AdminExtensionEndpoint = new ResourceProviderEndpoint
                {
                    ApiVersion = serviceConfiguration.ApiVersion,
                    EndpointUri = serviceConfiguration.BaseEndpointAdminExtension.AbsoluteUri,
                    Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout,
                    Enabled = true
                },
                TenantExtensionName = "JWTestExtensionResourceProviderExtension",
                TenantExtensionEndpoint = new ResourceProviderEndpoint
                {
                    ApiVersion = serviceConfiguration.ApiVersion,
                    EndpointUri = serviceConfiguration.BaseEndpointTenantExtension.AbsoluteUri,
                    Timeout = serviceConfiguration.Manifest.DefaultEndpointTimeout,
                    Enabled = true
                }

            };

            return manifest;
        }
    }
}
