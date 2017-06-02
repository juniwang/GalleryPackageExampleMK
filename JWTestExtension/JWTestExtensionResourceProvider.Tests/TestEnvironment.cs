//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider.Tests
{
    using System;
    using System.Globalization;
    using System.IO;
    using System.Reflection;
    using Microsoft.Azure.ResourceProvider.Setup.Database;
    using Microsoft.Azure.ResourceProvider.TestUtilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// The test environment.
    /// </summary>
    [TestClass]
    public static class TestEnvironment
    {
        /// <summary>
        /// The server.
        /// </summary>
        public const string Server = @".";

        /// <summary>
        /// The default endpoint username.
        /// </summary>
        public const string DefaultEndpointUsername = "sampleUser";

        /// <summary>
        /// The default endpoint password.
        /// </summary>
        public const string DefaultEndpointPassword = "sampleP4ssw0rd";

        /// <summary>
        /// The default event schema name.
        /// </summary>
        public const string DefaultEventSchemaName = "events";

        /// <summary>
        /// The default config schema name.
        /// </summary>
        public const string DefaultConfigSchemaName = "config";

        /// <summary>
        /// The default usage schema name.
        /// </summary>
        public const string DefaultUsageSchemaName = "usage";

        /// <summary>
        /// The event database.
        /// </summary>
        public const string EventsDatabase = "Tests.JWTestExtensionResourceProviderSample.Events";

        /// <summary>
        /// The config database.
        /// </summary>
        public const string ConfigDatabase = "Tests.JWTestExtensionResourceProviderSample.Config";

        /// <summary>
        /// The usage database.
        /// </summary>
        public const string UsageDatabase = "Tests.JWTestExtensionResourceProviderSample.Usage";

        /// <summary>
        /// The event database connection string.
        /// </summary>
        public const string EventConnectionString = @"Data Source=" + Server + ";Initial Catalog=" + EventsDatabase + ";Integrated Security=SSPI;";

        /// <summary>
        /// The config database connection string.
        /// </summary>
        public const string ConfigConnectionString = @"Data Source=" + Server + ";Initial Catalog=" + ConfigDatabase + ";Integrated Security=SSPI;";

        /// <summary>
        /// The usage connection string.
        /// </summary>
        public const string UsageConnectionString = @"Data Source=" + Server + ";Initial Catalog=" + UsageDatabase + ";Integrated Security=SSPI;";

        /// <summary>
        /// The development storage connection string.
        /// </summary>
        public const string DevStorageConnectionString = "UseDevelopmentStorage=true";

        /// <summary>
        /// The resource provider URI. This is used in resource controller tests.
        /// </summary>
        public static readonly Uri ResourcesTestsUri = new UriBuilder(Uri.UriSchemeHttp, Environment.MachineName, 104).Uri;

        /// <summary>
        /// The referrer URI.
        /// </summary>
        public static readonly Uri ReferrerUri = new UriBuilder(Uri.UriSchemeHttp, Environment.MachineName, 105).Uri;

        /// <summary>
        /// Gets the assembly directory.
        /// </summary>
        public static string ConfigurationDirectory
        {
            get
            {
                var location = Assembly.GetExecutingAssembly().Location;
                return Path.GetDirectoryName(location);
            }
        }

        /// <summary>
        /// Initializes the test environment for the unit/integration tests.
        /// Deploys Databases, unless DISABLE_DB_DEPLOYMENT environment variable is set.
        /// There is no specific format of the value and any non-empty string will disable the deployment procedure.
        /// Usage:
        /// Open View -> Other Windows -> Package Manager Console
        /// To skip DB deployment type: [Environment]::SetEnvironmentVariable("DISABLE_DB_DEPLOYMENT", "PS1")
        /// To enable back DB deployment type: [Environment]::SetEnvironmentVariable("DISABLE_DB_DEPLOYMENT", "")
        /// </summary>
        /// <param name="context">The testing context</param>
        [AssemblyInitialize]
        public static void Initialize(TestContext context)
        {
            StorageUtilities.DeployDatabase(new ResourceProviderEventsDatabaseSchema(DefaultEventSchemaName), EventConnectionString);
            StorageUtilities.DeployDatabase(new ResourceProviderUsageDatabaseSchema(DefaultUsageSchemaName), UsageConnectionString);
            StorageUtilities.DeployDatabase(new ResourceProviderConfigDatabaseSchema(DefaultConfigSchemaName), ConfigConnectionString);
        }

        /// <summary>
        /// Uninitializes the test environment for the unit/integration tests.
        /// </summary>
        [AssemblyCleanup]
        public static void Uninitialize()
        {
        }

        /// <summary>
        /// Clean usage database.
        /// </summary>
        public static void CleanUsageDatabase()
        {
            StorageUtilities.DeleteAllRows(
                server: Server,
                database: UsageDatabase,
                tableNames: string.Format(CultureInfo.InvariantCulture, "[{0}].[UsageRecords]", DefaultUsageSchemaName));
        }

        /// <summary>
        /// Clean events database.
        /// </summary>
        public static void CleanEventsDatabase()
        {
            StorageUtilities.DeleteAllRows(
                server: Server,
                database: EventsDatabase,
                tableNames: string.Format(CultureInfo.InvariantCulture, "[{0}].[Events]", DefaultEventSchemaName));
        }
    }
}
