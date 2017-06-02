/// <reference path="../../TypeReferences.d.ts" />

import BrowseArea = require("../BrowseArea");
import ClientResources = require("ClientResources");
import DataModels = JWTestExtension.DataModels;
import ExtensionDefinition = require("../../_generated/ExtensionDefinition");

/**
 * This sample uses the base class implementation. You can also implement the
 * interface MsPortalFx.ViewModels.ButtonPartContract.
 */
export class ResourcePartViewModel extends MsPortalFx.ViewModels.AssetPart {

    /**
     * Resource object used to persist bindings.
     */
    public resource: KnockoutObservable<DataModels.RootResource>;
        
    /**
     * View model constructor.
     *
     * @param container Object representing the part in the shell.
     * @param initialState Bag of properties saved to user settings via viewState.
     * @param dataContext Long lived data access object passed into all view models in the current area.
     */
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: BrowseArea.DataContext) {
        super();
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
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        this.assetId(inputs.id);

        var descriptor = MsPortalFx.ViewModels.Services.ResourceTypes.parseResourceDescriptor(inputs.id);
        this.assetName(descriptor.resource);
        return null;
    }
}