var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./_generated/ExtensionDefinition", "./_generated/ViewModelFactories"], function (require, exports, ExtensionDefinition, ViewModelFactories) {
    "use strict";
    "use strict";
    /**
     * This class provides the entry point for your extension.
     */
    var EntryPoint = (function (_super) {
        __extends(EntryPoint, _super);
        function EntryPoint() {
            _super.apply(this, arguments);
        }
        /**
         * This method is called as your extension is loaded by the shell.
         */
        EntryPoint.prototype.initialize = function () {
            MsPortalFx.Base.Diagnostics.Telemetry.initialize(ExtensionDefinition.definitionName, false /* traceBrowserInformation already captured by shell */);
            this.viewModelFactories = new ViewModelFactories.ViewModelFactoriesBase();
            this.viewModelFactories.Resource().setDataContextFactory("./Resource/ResourceArea", function (contextModule) { return new contextModule.DataContext(); });
        };
        EntryPoint.prototype.getDefinition = function () {
            return ExtensionDefinition.getDefinition();
        };
        return EntryPoint;
    }(MsPortalFx.Extension.EntryPointBase));
    exports.EntryPoint = EntryPoint;
    function create() {
        return new EntryPoint();
    }
    exports.create = create;
});
