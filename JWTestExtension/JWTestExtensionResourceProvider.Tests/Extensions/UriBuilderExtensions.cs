//-------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-------------------------------------------------------

namespace JWTestExtensionResourceProvider.Tests
{
    using System;
    using System.Web;

    /// <summary>
    /// Extensions class for UriBuilder extensions.
    /// </summary>
    internal static class UriBuilderExtensions
    {
        /// <summary>
        /// Sets the query string parameter.
        /// </summary>
        /// <param name="uriBuilder">The URI.</param>
        /// <param name="key">The key.</param>
        /// <param name="value">The value.</param>
        public static void SetQueryStringParam(this UriBuilder uriBuilder, string key, string value)
        {
            var collection = HttpUtility.ParseQueryString(uriBuilder.Query);

            // Add/overwrite querystring parameter.
            collection[key] = value;

            uriBuilder.Query = collection.ToString();
        }
    }
}
