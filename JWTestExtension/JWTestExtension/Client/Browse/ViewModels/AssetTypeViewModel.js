/// <reference path="../../TypeReferences.d.ts" />
define(["require", "exports", "../../_generated/BladeReferences", "ClientResources", "../../Shared/Icons"], function (require, exports, BladeRefs, ClientResources, ClientIcons) {
    "use strict";
    /**
     * Represents the asset type information for the Resource asset type.
     */
    var AssetTypeViewModel = (function () {
        /**
         * Initializes a new instance of the AssetTypeViewModel view model class.
         *
         * @param container Object representing the container in the shell.
         * @param initialState Bag of properties saved to user settings via viewState.
         * @param dataContext Long lived data access object passed into all view models in the current area.
         */
        function AssetTypeViewModel(container, initialState, dataContext) {
        }
        /**
         * Gets the browse config.
         *
         * @return A promise which will be resolved with the browse config.
         */
        AssetTypeViewModel.prototype.getBrowseConfig = function () {
            return Q.resolve({
                columns: [
                    // Column for the model using a custom column.
                    {
                        id: "status",
                        name: ko.observable(ClientResources.status),
                        itemKey: "status"
                    },
                ],
                // This following are the default columns.
                defaultColumns: [
                    "status",
                    "location"
                ]
            });
        };
        /**
         * Gets the supplemental data for the array of resource IDs.
         *
         * @param resourceIds The array of resource IDs for the supplemental data.
         * @param properties The array of supplemental properties that are required.
         * @return A promise which will be resolved when data is ready to be streamed.
         */
        AssetTypeViewModel.prototype.getSupplementalData = function (resourceIds, properties) {
            return null;
        };
        AssetTypeViewModel.prototype.getMenuConfig = function (resourceInfo) {
            var overviewItem = {
                id: "overview",
                displayText: "Overview",
                icon: ClientIcons.Icons.cloudService,
                supplyBladeReference: function () {
                    return new BladeRefs.ResourceBladeReference({ id: resourceInfo.resourceId });
                }
            };
            var propertiesItem = {
                id: "properties",
                displayText: "Properties",
                keywords: ["subscription", "resource group", "location"],
                icon: MsPortalFx.Base.Images.Polychromatic.Controls(),
                supplyBladeReference: function () {
                    return new BladeRefs.PropertiesBladeReference({ id: resourceInfo.resourceId });
                }
            };
            var menuConfig = {
                overview: overviewItem,
                groups: [
                    {
                        referenceId: MsPortalFx.Assets.ManagementGroupId,
                        items: [
                            propertiesItem
                        ]
                    }
                ]
            };
            return Q(menuConfig);
        };
        return AssetTypeViewModel;
    }());
    exports.AssetTypeViewModel = AssetTypeViewModel;
});
