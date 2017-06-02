var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ClientResources"], function (require, exports, ClientResources) {
    "use strict";
    /*
     * The view model for Resource.  This is consumed in ..\Resource.pdl
     */
    var ResourceBladeViewModel = (function (_super) {
        __extends(ResourceBladeViewModel, _super);
        /**
         * Set initial blade view model values.
         */
        function ResourceBladeViewModel(container, initialState, dataContext) {
            var _this = this;
            _super.call(this);
            this.id = ko.observable();
            this.subtitle(ClientResources.resourceBladeSubtitle);
            this._entityView = dataContext.resourceEntities.createView(container);
            this._resource = this._entityView.item;
            ko.reactor(container, function () {
                if (_this._resource()) {
                    _this.title(_this._resource().name());
                }
            });
        }
        ResourceBladeViewModel.prototype.onInputsSet = function (inputs) {
            this.id(inputs.id);
            return this._entityView.fetch(inputs.id);
        };
        return ResourceBladeViewModel;
    }(MsPortalFx.ViewModels.Blade));
    exports.ResourceBladeViewModel = ResourceBladeViewModel;
});
