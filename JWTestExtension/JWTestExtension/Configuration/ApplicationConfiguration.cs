using System.ComponentModel.Composition;
using Microsoft.Portal.Framework;
using System;

namespace Microsoft.Portal.Extensions.JWTestExtension
{
    /// <summary>
    /// Represents application configuration settings.
    /// </summary>
    [Export(typeof(ApplicationConfiguration))]
    public class ApplicationConfiguration : ConfigurationSettings
    {
        /// <summary>
        /// Gets a value indicating whether development mode is enabled. Development mode turns minification off.
        /// </summary>
        /// <remarks>Development mode turns minification off. It also disables any caching that be happening.</remarks>
        [ConfigurationSetting]
        public bool IsDevelopmentMode
        {
            get;
            private set;
        }

        /// <summary>
        /// Gets a value indicating a custom location where the browser should find cache-able content (rather than from the application itself).
        /// </summary>
        [ConfigurationSetting]
        public string CdnPrefix
        {
            get;
            private set;
        }

        /// <summary>
        /// Gets the ARM endpoint
        /// </summary>
        [ConfigurationSetting]
        public Uri ArmEndpoint
        {
            get;
            private set;
        }

        /// <summary>
        /// Gets the ARM Api Version for Shim RPs
        /// </summary>
        [ConfigurationSetting]
        public string ArmApiVersion { get; private set; }

        /// <summary>
        /// Gets the test in prod host environment to side load the extension in
        /// </summary>
        [ConfigurationSetting]
        public string TestInProdEnvironment { get; private set; }
    }
}