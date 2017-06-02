/// <reference path="../../TypeReferences.d.ts" />

import ExtensionDefinition = require("../../_generated/ExtensionDefinition");
import BladeRefs = require("../../_generated/BladeReferences");
import BrowseArea = require("../BrowseArea");
import ClientResources = require("ClientResources");
import AssetsApi = MsPortalFx.Assets;
import ResourceTypesViewModels = ExtensionDefinition.ViewModels.Browse;
import ClientIcons = require("../../Shared/Icons");
/**
 * Represents the asset type information for the Resource asset type.
 */
export class AssetTypeViewModel
    implements ResourceTypesViewModels.AssetTypeViewModel.Contract {

    /**
     * Initializes a new instance of the AssetTypeViewModel view model class.
     *
     * @param container Object representing the container in the shell.
     * @param initialState Bag of properties saved to user settings via viewState.
     * @param dataContext Long lived data access object passed into all view models in the current area.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: BrowseArea.DataContext) {

    }

    /**
     * Gets the browse config.
     *
     * @return A promise which will be resolved with the browse config.
     */
    public getBrowseConfig(): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            columns: [
                // Column for the model using a custom column.
                {
                    id: "status",
                    name: ko.observable<string>(ClientResources.status),
                    itemKey: "status"
                },
            ],

            // This following are the default columns.
            defaultColumns: [
                "status",
                "location"
            ]
        });
    }

    /**
     * Gets the supplemental data for the array of resource IDs.
     *
     * @param resourceIds The array of resource IDs for the supplemental data.
     * @param properties The array of supplemental properties that are required.
     * @return A promise which will be resolved when data is ready to be streamed.
     */
    public getSupplementalData(resourceIds: string[], properties: string[]): MsPortalFx.Base.Promise {
        return null;
    }

    public getMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInformation): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig>
    {
        var overviewItem: MsPortalFx.Assets.MenuItem = {
            id: "overview",
            displayText: "Overview",
            icon: ClientIcons.Icons.cloudService,
            supplyBladeReference: () =>
            {
                return new BladeRefs.ResourceBladeReference({ id: resourceInfo.resourceId });
            }
        };

        var propertiesItem: MsPortalFx.Assets.MenuItem = {
            id: "properties",
            displayText: "Properties",
            keywords: ["subscription", "resource group", "location"],
            icon: MsPortalFx.Base.Images.Polychromatic.Controls(),
            supplyBladeReference: () => 
            {
                return new BladeRefs.PropertiesBladeReference({ id: resourceInfo.resourceId });
            }
        };

        var menuConfig = <MsPortalFx.Assets.ResourceMenuConfig>
            {
                overview: overviewItem,
                groups:
                [
                    {
                        referenceId: MsPortalFx.Assets.ManagementGroupId,
                        items: [
                            propertiesItem
                        ]
                    }
                ]
            };
        return Q(menuConfig);
    }
}