//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.Net;
    using Microsoft.Azure.ResourceProvider;
    using Microsoft.Azure.ResourceProvider.Contracts;
    using Microsoft.Azure.ResourceProvider.ExceptionHandling;
    using Newtonsoft.Json.Linq;
    using JWTestExtensionResourceProvider.ErrorHandling;

    /// <summary>
    /// Specifies the quota parameters that are specific to the Azure Resource Provider.
    /// In this instance the subscription quota specifies how many root resources (specified by RootResourceCount),
    /// and how many nested resources (specified by NestedResourceCount) a user can create.
    /// </summary>
    public class ServiceQuota
    {
        /// <summary>
        /// Number of root resources a user can create.
        /// </summary>
        public int RootResourceCountLimit { get; set; }

        /// <summary>
        /// Number of nested resources a user can create.
        /// </summary>
        public int NestedResourceCountLimit { get; set; }

        /// <summary>
        /// Retrieve the resource provider specific subscription quota collection.
        /// </summary>
        /// <param name="subscriptionId">The subscription Id.</param>
        /// <param name="subscription">The subscription notification request content.</param>
        /// <returns>The resource provider specific quota collection.</returns>
        public static ServiceQuota[] CreateSubscriptionQuotaFromSubscriptionNotification(
            string subscriptionId,
            SubscriptionNotificationDefinition subscription)
        {
            ArgumentValidator.ValidateNotNull("subscriptionId", subscriptionId);
            ArgumentValidator.ValidateNotNull("subscription", subscription);

            if (subscription.Properties == null)
            {
                var errorMessage = string.Format(CultureInfo.CurrentCulture, ResponseErrorMessages.MissingSubscriptionQuota, subscriptionId);
                throw new ResourceProviderException(errorMessage, ResponseErrorCode.InvalidQuota.ToString(), HttpStatusCode.NotFound);
            }

            var azureStackNotificationProperties = subscription.Properties.ToObject<AzureStackSubscriptionNotificationPropertiesDefinition>();

            if (!azureStackNotificationProperties.Namespace.Equals(ManifestFactory.Namespace))
            {
                var errorMessage = string.Format(CultureInfo.CurrentCulture, ResponseErrorMessages.MissingSubscriptionQuota, subscriptionId);
                throw new ResourceProviderException(errorMessage, ResponseErrorCode.InvalidQuota.ToString(), HttpStatusCode.NotFound);
            }

            var result = new List<ServiceQuota>();
            foreach (var quotaGroup in azureStackNotificationProperties.ServiceQuotaGroups)
            {
                if (quotaGroup.InstanceCount < 1)
                {
                    var errorMessage = string.Format(CultureInfo.CurrentCulture, ResponseErrorMessages.MissingSubscriptionQuota, subscriptionId);
                    throw new ResourceProviderException(errorMessage, ResponseErrorCode.InvalidQuota.ToString(), HttpStatusCode.NotFound);
                }

                result.Add(JToken.FromObject(quotaGroup.QuotaSettings).ToObject<ServiceQuota>());
            }

            return result.ToArray();
        }
    }
}
