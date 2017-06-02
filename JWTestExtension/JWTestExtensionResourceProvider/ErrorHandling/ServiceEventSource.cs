//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using Microsoft.Diagnostics.Tracing;

    [EventSource(Name = "JWTestExtensionResourceProvider", LocalizationResources = "JWTestExtensionResourceProvider.ErrorHandling.TraceMessages")]
    public sealed class ServiceEventSource : EventSource
    {
        [Event(1, Channel = EventChannel.Operational, Level = EventLevel.Informational, Version = 1)]
        public void ApplicationStarting(string applicationTypeName, string applicationVersion)
        {
            this.WriteEvent(1, applicationTypeName, applicationVersion);
        }

        [Event(2, Channel = EventChannel.Operational, Level = EventLevel.Informational, Version = 1)]
        public void ApplicationStarted(string applicationTypeName, string applicationVersion)
        {
            this.WriteEvent(2, applicationTypeName, applicationVersion);
        }

        [Event(3, Channel = EventChannel.Operational, Level = EventLevel.Informational, Version = 1)]
        public void ApplicationEnding(string appplicationTypeName, string applicationVersion)
        {
            this.WriteEvent(3, appplicationTypeName, applicationVersion);
        }

        [Event(4, Channel = EventChannel.Operational, Level = EventLevel.Informational, Version = 1)]
        public void ApplicationEnded(string applicationTypeName, string applicationVersion)
        {
            this.WriteEvent(4, applicationTypeName, applicationVersion);
        }

        [Event(5, Channel = EventChannel.Operational, Level = EventLevel.Error, Version = 1)]
        public void ConfigurationReadFailed(string exceptionMessage)
        {
            this.WriteEvent(5, exceptionMessage);
        }
    }
}
