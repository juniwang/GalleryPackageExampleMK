var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ClientResources"], function (require, exports, ClientResources) {
    "use strict";
    var PropertiesBladeViewModel = (function (_super) {
        __extends(PropertiesBladeViewModel, _super);
        function PropertiesBladeViewModel(container, initialState, dataContext) {
            _super.call(this);
            /**
             * Blade view model constructor.
             *
             * @param container Object representing the blade in the shell.
             * @param initialState Bag of properties saved to user settings via viewState.
             * @param dataContext Long lived data access object passed into all view models in the current area.
             */
            this.resourceId = ko.observable();
            this.title(ClientResources.propertiesBladeTitle);
            this.icon(MsPortalFx.Base.Images.Polychromatic.Info());
        }
        /**
         * Invoked when the Part's inputs change.
         */
        PropertiesBladeViewModel.prototype.onInputsSet = function (inputs) {
            this.resourceId(inputs.id);
            this.title(ClientResources.propertiesBladeTitle);
            return null;
        };
        return PropertiesBladeViewModel;
    }(MsPortalFx.ViewModels.Blade));
    exports.PropertiesBladeViewModel = PropertiesBladeViewModel;
});
