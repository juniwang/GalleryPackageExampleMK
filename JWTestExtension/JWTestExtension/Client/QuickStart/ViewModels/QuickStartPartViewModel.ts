import ClientResources = require("ClientResources");
import QuickStartArea = require("../QuickStartArea");

export class QuickStartPartViewModel extends MsPortalFx.ViewModels.QuickStartPart {
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: QuickStartArea.DataContext) {
        super();

        this.title(ClientResources.quickStartTitle);
        this.shortTitle(ClientResources.quickStartShortTitle);
        this.description(ClientResources.quickStartDescription);
        this.icon(MsPortalFx.Base.Images.AzureQuickstart());
    }
} 