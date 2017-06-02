//-------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-------------------------------------------------------

namespace JWTestExtensionResourceProvider.Tests
{
    using System;
    using Microsoft.Azure.ResourceProvider;
    using Microsoft.Azure.ResourceProvider.ExceptionHandling;
    using Microsoft.WindowsAzure.ResourceStack.Common.Instrumentation;

    /// <summary>
    /// Extension class providing Uri extension method helpers.
    /// </summary>
    public static class UriExtensions
    {
        /// <summary>
        /// Appends the API version to the query string of the Uri.
        /// </summary>
        /// <param name="baseUri">The base URI.</param>
        /// <param name="apiVersion">The API version.</param>
        /// <returns>Returns a new Uri with the specified API version in the query string.</returns>
        public static Uri AppendApiVersion(this Uri baseUri, string apiVersion)
        {
            ArgumentValidator.ValidateNotEmpty("apiVersion", apiVersion);

            UriBuilder builder = new UriBuilder(baseUri);
            builder.SetQueryStringParam(RequestCorrelationContext.ParameterApiVersion, apiVersion);

            return builder.Uri;
        }
    }
}
