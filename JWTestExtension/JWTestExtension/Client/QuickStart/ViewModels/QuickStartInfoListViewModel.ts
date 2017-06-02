import ClientResources = require("ClientResources");
import ExtensionDefinition = require("../../_generated/ExtensionDefinition");
import QuickStartArea = require("../QuickStartArea");

export class QuickStartInfoListViewModel extends MsPortalFx.ViewModels.Parts.InfoList.ViewModel {
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: QuickStartArea.DataContext) {
        super(initialState);

        // Sections are blocks of text.
        // They can have an icon or number (if no icon is provided).
        // They can be a link or bladeLink via the selection property
        //         or: If they are niether, then the links property can show many links & bladeLinks.

        // add a section to open an external webpage.
        this.addSection(ClientResources.quickStartInfoListTitle1,
            ClientResources.quickStartInfoListDesc1,
            ClientResources.htmlSiteMSDNAddress,
            MsPortalFx.Base.Images.Tools());

        // add a section to open a blade.
        this.addSection(
            ClientResources.quickStartInfoListTitle2,
            ClientResources.quickStartInfoListDesc2, {
                detailBlade: ExtensionDefinition.BladeNames.quickStartBlade,
                detailBladeInputs: {}
            }, MsPortalFx.Base.Images.Polychromatic.Heart());
    }
}