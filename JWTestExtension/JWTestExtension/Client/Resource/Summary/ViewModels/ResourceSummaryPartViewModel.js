/// <reference path="../../../TypeReferences.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../../_generated/ExtensionDefinition", "ClientResources"], function (require, exports, ExtensionDefinition, ClientResources) {
    "use strict";
    var BladeNames = ExtensionDefinition.BladeNames;
    var ViewModels = MsPortalFx.ViewModels;
    var Parts = ViewModels.Parts;
    var ResourceSummary = Parts.ResourceSummary;
    var Properties = Parts.Properties;
    /**
     * The ResourceSummray provides quick access to key properties that the consumers of the extension may want to use and also quick links
     * to common blades keys, quickstart, users, tags, settings
     */
    var ResourceSummaryPartViewModel = (function (_super) {
        __extends(ResourceSummaryPartViewModel, _super);
        function ResourceSummaryPartViewModel(container, initialState, dataContext) {
            function getOptions() {
                var getQuickStartSelection = function (inputs) {
                    return {
                        detailBlade: BladeNames.quickStartBlade,
                        detailBladeInputs: {
                            id: inputs.resourceId
                        }
                    };
                };
                return {
                    getQuickStartSelection: getQuickStartSelection,
                    getSettingsSelection: null,
                    collapsed: false,
                };
            }
            _super.call(this, initialState, getOptions(), container);
            this._resourceId = ko.observable();
            this._bladeSelection = ko.observable({
                detailBlade: BladeNames.resourceBlade,
                detailBladeInputs: {}
            });
            var properties = [
                // Text property
                new Properties.TextProperty(ClientResources.textPropertyLabel, this._resourceId),
                // Link property
                new Properties.LinkProperty(ClientResources.linkPropertyLabel, ClientResources.microsoftUri, ClientResources.linkPropertyLabel),
                // Open blade property
                new Properties.OpenBladeProperty(BladeNames.resourceBlade, ko.observable(BladeNames.resourceBlade), this._bladeSelection),
            ];
            this.setProperties(properties);
        }
        // if subclass needs to run some additional logic in onInputsSet,
        // it should chain the promise returned by the base class.
        ResourceSummaryPartViewModel.prototype.onInputsSet = function (inputs, settings) {
            var _this = this;
            return _super.prototype.onInputsSet.call(this, inputs, settings).then(function () {
                _this._resourceId(inputs.resourceId);
                _this._bladeSelection({
                    detailBlade: BladeNames.resourceBlade,
                    detailBladeInputs: {
                        id: inputs.resourceId
                    }
                });
            });
        };
        return ResourceSummaryPartViewModel;
    }(ResourceSummary.ViewModel));
    exports.ResourceSummaryPartViewModel = ResourceSummaryPartViewModel;
});
