import ResourceArea = require("../../ResourceArea");
import ClientResources = require("ClientResources");
import ExtensionDefinition = require("../../../_generated/ExtensionDefinition");
import DataModels = JWTestExtension.DataModels;
import Def = ExtensionDefinition.ViewModels.Resource.ResourceBladeViewModel;
    /*
     * The view model for Resource.  This is consumed in ..\Resource.pdl
     */
export class ResourceBladeViewModel extends MsPortalFx.ViewModels.Blade
                                    implements Def.Contract {

    public id = ko.observable<string>();

    private _entityView: MsPortalFx.Data.EntityView<DataModels.RootResource, any>;
    private _resource: KnockoutObservable<DataModels.RootResource>;

    /**
     * Set initial blade view model values.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: ResourceArea.DataContext) {
        super();
        
        this.subtitle(ClientResources.resourceBladeSubtitle);

        this._entityView = dataContext.resourceEntities.createView(container);
        this._resource = this._entityView.item;

        ko.reactor(container,() => {
            if (this._resource()) {                
                this.title(this._resource().name());
            }
        });
    }

    public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
        this.id(inputs.id);

        return this._entityView.fetch(inputs.id);
    }
}