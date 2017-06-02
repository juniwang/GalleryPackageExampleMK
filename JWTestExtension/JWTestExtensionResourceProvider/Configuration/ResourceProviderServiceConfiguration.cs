//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider
{
    using System;
    using Microsoft.Azure.ResourceProvider.Configuration;
    using Microsoft.Azure.ResourceProvider.Encryption;
    using Microsoft.Azure.ResourceProvider.Sql;

    /// <summary>
    /// Resource provider configuration settings.
    /// </summary>
    /// <remarks>
    /// Provides configuration options for the resource provider.
    /// The settings can be read from the configuration database or the Web.Config configuration file.
    /// </remarks>
    [ConfigurationClass("ProviderConfiguration")]
    public class ResourceProviderServiceConfiguration : ServiceConfiguration
    {
        /// <summary>
        /// Resource provider configuration constructor.
        /// Initializes default values for the commonly used settings.
        /// </summary>
        public ResourceProviderServiceConfiguration()
            : base()
        {
            // Provider default configuration values
            this.ApiVersion = "2015-05-01-preview";

            this.Manifest = new ManifestConfiguration
            {
                DefaultCommandTimeout = TimeSpan.FromSeconds(30),
                DefaultEndpointTimeout = TimeSpan.FromSeconds(30),
            };

            this.EventsSchemaName = "events";
            this.UsageSchemaName = "usage";
        }

        [ConfigurationSetting]
        public string ApiVersion { get; set; }

        [ConfigurationSetting]
        public EncryptionConfig Encryption { get; set; }

        [ConfigurationSetting]
        public ManifestConfiguration Manifest { get; set; }

        [ConfigurationSetting]
        public Uri BaseEndpoint { get; set; }

        [ConfigurationSetting]
        public Uri BaseEndpointAdminExtension { get; set; }

        [ConfigurationSetting]
        public Uri BaseEndpointTenantExtension { get; set; }

        [ConfigurationSetting]
        public string StorageConnectionString { get; set; }

        [ConfigurationSetting]
        public SecureSqlConnectionString EventsConnectionString { get; set; }

        [ConfigurationSetting]
        public string EventsSchemaName { get; set; }

        [ConfigurationSetting]
        public SecureSqlConnectionString UsageConnectionString { get; set; }

        [ConfigurationSetting]
        public string UsageSchemaName { get; set; }
    }
}