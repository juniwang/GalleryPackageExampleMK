using Microsoft.Portal.TypeMetadata;
using System;
using System.Collections.Generic;

namespace Microsoft.Portal.Extensions.JWTestExtension.DataModels
{
    [TypeMetadataModel(typeof(ResourceBase), "JWTestExtension.DataModels", true)]
    public abstract class ResourceBase
    {
        /// <summary>
        /// Gets or sets the unique identifier of the resource .
        /// </summary>
        [Id]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the resource name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Type of resource provider
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets location
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// Etag
        /// </summary>
        public string Etag { get; set; }

        /// <summary>
        /// Gets or sets classicStorage account tags (key-value pairs)
        /// </summary>
        [Ignore]
        public IDictionary<string, string> Tags { get; set; }
    }
}
