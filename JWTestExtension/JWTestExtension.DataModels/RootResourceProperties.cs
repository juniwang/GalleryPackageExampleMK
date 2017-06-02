using Microsoft.Portal.TypeMetadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Microsoft.Portal.Extensions.JWTestExtension.DataModels
{
    [TypeMetadataModel(typeof(RootResourceProperties), "JWTestExtension.DataModels")]
    public class RootResourceProperties
    {
        public string CustomProperty { get; set; }
        public string ProvisioningState { get; set; }
    }
}
