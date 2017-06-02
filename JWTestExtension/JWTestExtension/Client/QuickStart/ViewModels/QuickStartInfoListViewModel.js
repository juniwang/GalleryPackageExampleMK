var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ClientResources", "../../_generated/ExtensionDefinition"], function (require, exports, ClientResources, ExtensionDefinition) {
    "use strict";
    var QuickStartInfoListViewModel = (function (_super) {
        __extends(QuickStartInfoListViewModel, _super);
        function QuickStartInfoListViewModel(container, initialState, dataContext) {
            _super.call(this, initialState);
            // Sections are blocks of text.
            // They can have an icon or number (if no icon is provided).
            // They can be a link or bladeLink via the selection property
            //         or: If they are niether, then the links property can show many links & bladeLinks.
            // add a section to open an external webpage.
            this.addSection(ClientResources.quickStartInfoListTitle1, ClientResources.quickStartInfoListDesc1, ClientResources.htmlSiteMSDNAddress, MsPortalFx.Base.Images.Tools());
            // add a section to open a blade.
            this.addSection(ClientResources.quickStartInfoListTitle2, ClientResources.quickStartInfoListDesc2, {
                detailBlade: ExtensionDefinition.BladeNames.quickStartBlade,
                detailBladeInputs: {}
            }, MsPortalFx.Base.Images.Polychromatic.Heart());
        }
        return QuickStartInfoListViewModel;
    }(MsPortalFx.ViewModels.Parts.InfoList.ViewModel));
    exports.QuickStartInfoListViewModel = QuickStartInfoListViewModel;
});
