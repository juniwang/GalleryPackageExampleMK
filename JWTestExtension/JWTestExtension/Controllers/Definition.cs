using Microsoft.Portal.Framework;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;

namespace Microsoft.Portal.Extensions.JWTestExtension.Controllers
{
    [Export(typeof(ExtensionDefinition))]
    internal class Definition : ExtensionDefinition
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Definition"/> class.
        /// </summary>
        /// <param name="applicationConfiguration">The application configuration.</param>
        [ImportingConstructor]
        public Definition(ApplicationConfiguration applicationConfiguration)
        {
            this.ExtensionConfiguration = new Dictionary<string, object>()
            {
                { "armEndpoint", applicationConfiguration.ArmEndpoint }
            };
        }

        public override string GetTitle(PortalRequestContext context)
        {
            return Client.ClientResources.ExtensionName;
        }

        public override bool TraceAjaxErrors
        {
            get
            {
                return true;
            }
        }
    }
}