/// <reference path="../../TypeReferences.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../_generated/ExtensionDefinition"], function (require, exports, ExtensionDefinition) {
    "use strict";
    /**
     * This sample uses the base class implementation. You can also implement the
     * interface MsPortalFx.ViewModels.ButtonPartContract.
     */
    var ResourcePartViewModel = (function (_super) {
        __extends(ResourcePartViewModel, _super);
        /**
         * View model constructor.
         *
         * @param container Object representing the part in the shell.
         * @param initialState Bag of properties saved to user settings via viewState.
         * @param dataContext Long lived data access object passed into all view models in the current area.
         */
        function ResourcePartViewModel(container, initialState, dataContext) {
            _super.call(this);
            this.assetType(ExtensionDefinition.AssetTypes.MyResource.name);
            this.icon(MsPortalFx.Base.Images.Polychromatic.PowerUp());
            // load assetId from a persisted journey
            // this is not required but does reduce flashing when loading a journey
            if (initialState.content && initialState.content.assetId) {
                this.assetId(initialState.content.assetId);
            }
            this.icon(MsPortalFx.Base.Images.Logos.MicrosoftSquares());
        }
        /**
         * This method is invoked when all inputs are available.
         *
         * @param inputs Collection of inputs passed from the shell.
         * @returns A promise that that needs to be resolved when data loading is complete.
         */
        ResourcePartViewModel.prototype.onInputsSet = function (inputs) {
            this.assetId(inputs.id);
            var descriptor = MsPortalFx.ViewModels.Services.ResourceTypes.parseResourceDescriptor(inputs.id);
            this.assetName(descriptor.resource);
            return null;
        };
        return ResourcePartViewModel;
    }(MsPortalFx.ViewModels.AssetPart));
    exports.ResourcePartViewModel = ResourcePartViewModel;
});
