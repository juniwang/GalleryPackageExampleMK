import ResourceArea = require("../../ResourceArea");
import ClientResources = require("ClientResources");
import ExtensionDefinition = require("../../../_generated/ExtensionDefinition");

import Def = ExtensionDefinition.ViewModels.Resource.PropertiesPartViewModel;
import MsFxProperties = MsPortalFx.ViewModels.Parts.Properties;
import DataModels = JWTestExtension.DataModels;

export class PropertiesPartViewModel extends MsPortalFx.ViewModels.Parts.Properties.ViewModel implements Def.Contract {

    private _entityView: MsPortalFx.Data.EntityView<DataModels.RootResource, any>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: ResourceArea.DataContext) {
        super(initialState);

        this._entityView = dataContext.resourceEntities.createView(container);

        var resource = this._entityView.item;
        this.populateProperties(container, resource);
    }

    public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
        return this._entityView.fetch(inputs.id);
    }

    private populateProperties(lifetime: MsPortalFx.Base.LifetimeManager, resource: KnockoutObservable<DataModels.RootResource>): void {
        var partProperties: MsFxProperties.Property[] = [];
        partProperties.push(
            new MsFxProperties.TextProperty(ClientResources.resourceNameColumn, ko.computed(lifetime, () => { return resource() ? resource().name() : ClientResources.loadingText })),
            new MsFxProperties.TextProperty(ClientResources.resourceLocationColumn, ko.computed(lifetime,() => { return resource() ? resource().location() : ClientResources.loadingText; })),
            new MsFxProperties.CopyFieldProperty(lifetime, ClientResources.subscriptionId, ko.computed(lifetime, () => { return resource() ? MsPortalFx.ViewModels.Services.ResourceTypes.parseResourceDescriptor(resource().id()).subscription : ClientResources.loadingText })));

        this.setProperties(partProperties);
    }
}
