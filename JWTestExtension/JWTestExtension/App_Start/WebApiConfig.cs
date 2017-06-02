using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Routing;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;

namespace Microsoft.Portal.Extensions.JWTestExtension
{
    /// <summary>
    /// Web API configuration and services
    /// </summary>
    public static class WebApiConfig
    {
        /// <summary>
        ///  Web API configuration and services
        /// </summary>
        /// <param name="config">Http configuration</param>
        public static void Register(HttpConfiguration config)
        {
            config.AddODataQueryFilter();

            config.Routes.MapHttpRoute("API Default", "api/{controller}/{id}",
            new { id = RouteParameter.Optional },
            new { httpMethod = new HttpMethodConstraint(HttpMethod.Get, HttpMethod.Put, HttpMethod.Delete) });

            config.Routes.MapHttpRoute("API RPC Style", "api/{controller}/{action}",
            new { httpMethod = new HttpMethodConstraint(HttpMethod.Post) });

            config.Routes.MapHttpRoute("API default REST style post", "api/{controller}/{action}",
                new { action = "Post" },
                new { httpMethod = new HttpMethodConstraint(HttpMethod.Post) });
        }
    }
}