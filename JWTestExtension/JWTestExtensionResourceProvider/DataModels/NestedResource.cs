//-----------------------------------------------------------
// Copyright (c) JWTestExtensionResourceProvider.  All rights reserved.
//-----------------------------------------------------------

namespace JWTestExtensionResourceProvider
{
    /// <summary>
    /// Nested resource type.
    /// These resources only exist in the context of the Root resources.
    /// </summary>
    public class NestedResource
    {
        // TODO: Add your resource properties here, in this case the only the nested resource defines a user-friendly
        // display name, which may be different from the resource name specified in the ResourceDefinition.
        // The DisplayName property is not required, it is meant for demonstration purposes only.

        /// <summary>
        /// The user-friendly resource name.
        /// </summary>
        public string DisplayName { get; set; }
    }
}
