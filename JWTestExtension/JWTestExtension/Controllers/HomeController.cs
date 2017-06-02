using System.ComponentModel.Composition;
using System.Web;
using System.Web.Mvc;
using Microsoft.Portal.Framework;

namespace Microsoft.Portal.Extensions.JWTestExtension.Controllers
{
    /// <summary>
    /// Home controller
    /// </summary>
    [Export]
    [PartCreationPolicy(CreationPolicy.NonShared)]
    public class HomeController : ExtensionControllerBase
    {
        private ApplicationConfiguration settings;

        /// <summary>
        /// Initializes a new instance of the HomeController class.
        /// </summary>
        [ImportingConstructor]
        public HomeController(ExtensionDefinition definition, ApplicationConfiguration settings)
            : base(definition)
        {
            this.settings = settings;
        }

#if DEBUG
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (settings.IsDevelopmentMode && Request.QueryString.Count == 0 && filterContext.ActionDescriptor.ActionName == "Index")
            {             
                // IIS Express and the VS debug are shutdown when using a redirect to side load the extension using Test in Prod (TiP) functionality.
                // Instead of using a redirect keep the original window open on localhost:<port> and open a new one for TiP
                var keepDebuggerAttached = string.Format(
                    "<script>window.open('{0}/?feature.customportal=false&feature.canmodifyextensions=true#?testExtensions={{\"JWTestExtension\":\"{1}\"}}');</script>",
                    this.settings.TestInProdEnvironment,
                    HttpUtility.HtmlEncode(Request.Url.ToString()));
                filterContext.HttpContext.Response.Write(keepDebuggerAttached);
                base.OnActionExecuted(filterContext);
            }
        }
#endif
    }
}