import ClientResources = require("ClientResources");
import QuickStartArea = require("../QuickStartArea");

export class QuickStartBladeViewModel extends MsPortalFx.ViewModels.Blade {
    constructor(contianer: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: QuickStartArea.DataContext) {
        super();
        this.title(ClientResources.quickStartBladeTitle);
        this.subtitle(ClientResources.quickStartBladeSubtitle);
    }
}