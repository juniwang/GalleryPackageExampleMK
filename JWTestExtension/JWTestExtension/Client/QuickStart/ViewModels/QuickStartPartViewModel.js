var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ClientResources"], function (require, exports, ClientResources) {
    "use strict";
    var QuickStartPartViewModel = (function (_super) {
        __extends(QuickStartPartViewModel, _super);
        function QuickStartPartViewModel(container, initialState, dataContext) {
            _super.call(this);
            this.title(ClientResources.quickStartTitle);
            this.shortTitle(ClientResources.quickStartShortTitle);
            this.description(ClientResources.quickStartDescription);
            this.icon(MsPortalFx.Base.Images.AzureQuickstart());
        }
        return QuickStartPartViewModel;
    }(MsPortalFx.ViewModels.QuickStartPart));
    exports.QuickStartPartViewModel = QuickStartPartViewModel;
});
