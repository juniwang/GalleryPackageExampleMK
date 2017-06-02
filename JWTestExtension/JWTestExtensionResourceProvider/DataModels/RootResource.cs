//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider
{
    /// <summary>
    /// Root resource type.
    /// These resources define a top level resource managed by the Resource Provider.
    /// </summary>
    public class RootResource
    {
        // TODO: Add your resource properties here, in the case the resource only defines a user-friendly
        // display name, which may be different from the resource name specified in the ResourceDefinition.
        // The DisplayName property is not required, it is meant for demonstration purposes only.

        /// <summary>
        /// The user-friendly resource name.
        /// </summary>
        public string DisplayName { get; set; }
    }
}
