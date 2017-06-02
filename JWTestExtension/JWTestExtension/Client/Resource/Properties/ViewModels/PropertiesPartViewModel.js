var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ClientResources"], function (require, exports, ClientResources) {
    "use strict";
    var MsFxProperties = MsPortalFx.ViewModels.Parts.Properties;
    var PropertiesPartViewModel = (function (_super) {
        __extends(PropertiesPartViewModel, _super);
        function PropertiesPartViewModel(container, initialState, dataContext) {
            _super.call(this, initialState);
            this._entityView = dataContext.resourceEntities.createView(container);
            var resource = this._entityView.item;
            this.populateProperties(container, resource);
        }
        PropertiesPartViewModel.prototype.onInputsSet = function (inputs) {
            return this._entityView.fetch(inputs.id);
        };
        PropertiesPartViewModel.prototype.populateProperties = function (lifetime, resource) {
            var partProperties = [];
            partProperties.push(new MsFxProperties.TextProperty(ClientResources.resourceNameColumn, ko.computed(lifetime, function () { return resource() ? resource().name() : ClientResources.loadingText; })), new MsFxProperties.TextProperty(ClientResources.resourceLocationColumn, ko.computed(lifetime, function () { return resource() ? resource().location() : ClientResources.loadingText; })), new MsFxProperties.CopyFieldProperty(lifetime, ClientResources.subscriptionId, ko.computed(lifetime, function () { return resource() ? MsPortalFx.ViewModels.Services.ResourceTypes.parseResourceDescriptor(resource().id()).subscription : ClientResources.loadingText; })));
            this.setProperties(partProperties);
        };
        return PropertiesPartViewModel;
    }(MsPortalFx.ViewModels.Parts.Properties.ViewModel));
    exports.PropertiesPartViewModel = PropertiesPartViewModel;
});
