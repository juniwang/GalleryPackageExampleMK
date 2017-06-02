var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ClientResources"], function (require, exports, ClientResources) {
    "use strict";
    var QuickStartBladeViewModel = (function (_super) {
        __extends(QuickStartBladeViewModel, _super);
        function QuickStartBladeViewModel(contianer, initialState, dataContext) {
            _super.call(this);
            this.title(ClientResources.quickStartBladeTitle);
            this.subtitle(ClientResources.quickStartBladeSubtitle);
        }
        return QuickStartBladeViewModel;
    }(MsPortalFx.ViewModels.Blade));
    exports.QuickStartBladeViewModel = QuickStartBladeViewModel;
});
