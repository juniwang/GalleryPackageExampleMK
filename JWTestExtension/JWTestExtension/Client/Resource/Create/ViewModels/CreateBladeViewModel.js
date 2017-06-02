var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ClientResources", "../../../Shared/Constants"], function (require, exports, ClientResources, Constants) {
    "use strict";
    var FxAzure = MsPortalFx.Azure;
    var Arm = FxAzure.ResourceManager;
    var Forms = MsPortalFx.ViewModels.Forms;
    var SubscriptionsDropDown = FxAzure.Subscriptions.DropDown;
    var LocationsDropDown = FxAzure.Locations.DropDown;
    var ResourceGroups = FxAzure.ResourceGroups;
    var resourceType = Constants.sdkResourceProvider + "/" + Constants.rootResource;
    /**
     * Create blade view model
     */
    var CreateBladeViewModel = (function (_super) {
        __extends(CreateBladeViewModel, _super);
        function CreateBladeViewModel(container, initialState, dataContext) {
            _super.call(this, container);
            //set blade titles and icons
            this.title = ko.observable(ClientResources.AssetTypeNames.Resource.singular);
            this.subtitle = ko.observable(ClientResources.AssetTypeNames.Resource.singular);
            this.icon = ko.observable(MsPortalFx.Base.Images.Polychromatic.CloudService());
            this._dataContext = dataContext;
            // Instantiate an action bar view model. The property must be called 'actionBar' so the PDL
            // can wire the action bar control to this view model. We're instantiating a create action
            // bar because this is a create scenario.
            this.actionBar = new MsPortalFx.ViewModels.ActionBars.CreateActionBar.ViewModel(container);
            // We need to hook up the action bar's valid to the form's valid (which enables/disables the
            // 'Create' button based on whether the form is valid/invalid).
            this.valid.subscribe(container, this.actionBar.valid);
            this.parameterProvider = new MsPortalFx.ViewModels.ParameterProvider(container, {
                mapOutgoingDataForCollector: function (outgoing) { return outgoing; },
                mapIncomingDataForEditScope: this._mapIncomingDataForEditScope.bind(this)
            });
            // Use the form to edit the edit scope set up by the provider
            this.editScope = this.parameterProvider.editScope;
            this.armProvisioner = new Arm.Provisioner(container, initialState, {
                // This is where we supply the ARM provisioner with the template deployment options
                // required by the deployment operation.
                supplyTemplateDeploymentOptions: this._supplyProvisioningPromise.bind(this),
                // Supplying an action bar and a parameter provider allows for automatic provisioning.
                actionBar: this.actionBar,
                parameterProvider: this.parameterProvider
            });
            // Initialize the form fields.
            this._initializeFormFields(container, initialState);
        }
        Object.defineProperty(CreateBladeViewModel.prototype, "_dataModel", {
            get: function () {
                var editScope = this.editScope();
                return editScope && editScope.root;
            },
            enumerable: true,
            configurable: true
        });
        CreateBladeViewModel.prototype._initializeFormFields = function (container, initialState) {
            var _this = this;
            this.nameTextBox = new MsPortalFx.ViewModels.Forms.TextBox.ViewModel(container, this, "name", {
                label: ko.observable(ClientResources.resourceName),
                emptyValueText: ko.observable(ClientResources.enterTheName),
                validations: ko.observableArray([
                    new MsPortalFx.ViewModels.RequiredValidation(ClientResources.resourceNameRequired)
                ])
            });
            this.nameTextBox.delayValidationTimeout(500);
            this.nameTextBox.valueUpdateTrigger = MsPortalFx.ViewModels.Controls.ValueUpdateTrigger.Input;
            // The subscriptions drop down.
            var subscriptionsDropDownOptions = {
                options: ko.observableArray([]),
                form: this,
                accessor: this.createEditScopeAccessor(function (data) {
                    return data.subscription;
                }),
                validations: ko.observableArray([
                    new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectSubscription)
                ])
            };
            this.subscriptionsDropDown = new SubscriptionsDropDown(container, subscriptionsDropDownOptions);
            // The locations drop down.
            var locationsDropDownOptions = {
                options: ko.observableArray([]),
                form: this,
                accessor: this.createEditScopeAccessor(function (data) {
                    return data.location;
                }),
                subscriptionIdObservable: this.subscriptionsDropDown.subscriptionId,
                // TODO: Once you have your RP deployed in PROD/Dogfood you can remove the filter 
                // and replace it with the resourceTypesObservable below.  This will ensure that the location dropdown
                // will show only those locations where the resourceType is available to be deployed.
                //      resourceTypesObservable: ko.observable([resourceType]),
                validations: ko.observableArray([
                    new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectLocation)
                ]),
                // Optional -> Add location filtering by either providing a list of allowed locations OR
                // a list of disallowed locations (not both):
                filter: {
                    allowedLocations: {
                        locationNames: ["chinanorth"],
                        disabledMessage: "This location is disabled for demo purposes."
                    }
                }
            };
            this.locationsDropDown = new LocationsDropDown(container, locationsDropDownOptions);
            // The resource group drop down with creator inputs
            var resourceGroupsDropDownOptions = {
                options: ko.observableArray([]),
                form: this,
                accessor: this.createEditScopeAccessor(function (data) {
                    return data.resourceGroup;
                }),
                subscriptionIdObservable: this.subscriptionsDropDown.subscriptionId,
                validations: ko.observableArray([
                    new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectResourceGroup)
                ])
            };
            this.resourceGroupDropDown = new ResourceGroups.DropDown(container, resourceGroupsDropDownOptions);
            // Subscribe to resource group changes to update the location drop down with the resource group location.
            this.resourceGroupDropDown.value.subscribe(container, function (resourceGroup) {
                if (_this.locationsDropDown) {
                    var locationsDropDown = _this.locationsDropDown.control;
                    var resourceGroupLocation_1 = resourceGroup && resourceGroup.value && resourceGroup.value.location;
                    // Try to find the resource group location in the locations list.
                    // This is a hierarchical option (i.e. not the full location object).
                    var location_1 = locationsDropDown.items().first(function (item) {
                        return item.value === resourceGroupLocation_1;
                    });
                    // Since the location dropdown is filtering locations based on subscription and resource type,
                    // the list will only contain allowed locations. If the resource group location doesn't exist
                    // in the list, then it is not an allowed location, hence shouldn’t be selected. So set the
                    // new location only if it's allowed.
                    if (location_1) {
                        locationsDropDown.value(location_1.text());
                    }
                }
            });
            // The form section.
            var sectionOptions = {
                children: ko.observableArray([
                    this.nameTextBox,
                    // Also add the selector fields for the pickers.
                    this.subscriptionsDropDown.control,
                    this.resourceGroupDropDown.control,
                    this.locationsDropDown.control,
                ])
            };
            this.generalSection = new Forms.Section.ViewModel(container, sectionOptions);
            this.sections.push(this.generalSection);
        };
        CreateBladeViewModel.prototype._mapIncomingDataForEditScope = function (incoming) {
            var data = incoming;
            var galleryCreateOptions = this.armProvisioner.armProvisioningConfig
                && this.armProvisioner.armProvisioningConfig.galleryCreateOptions;
            var model = {
                name: ko.observable(),
                subscription: ko.observable(),
                resourceGroup: ko.observable({
                    value: {
                        name: ClientResources.selectResourceGroup,
                        location: null
                    },
                    createNew: false
                }),
                location: ko.observable(),
            };
            return model;
        };
        CreateBladeViewModel.prototype._supplyProvisioningPromise = function (data) {
            // This is where we supply the ARM provisioner with the template deployment options required
            // by the deployment operation.
            var galleryCreateOptions = this.armProvisioner.armProvisioningConfig
                && this.armProvisioner.armProvisioningConfig.galleryCreateOptions;
            var name = data.name();
            var subscriptionId = data.subscription().subscriptionId;
            var location = data.location();
            var isNewResourceGroup = this.resourceGroupDropDown.value().createNew;
            var resourceGroupName = this.resourceGroupDropDown.value().value.name;
            var resourceGroupLocation = this.resourceGroupDropDown.value().createNew ? location.name : this.resourceGroupDropDown.value().value.location;
            var resourceIdFormattedString = "/subscriptions/" + subscriptionId + "/resourcegroups/" + resourceGroupName + "/providers/" + resourceType + "/" + name;
            var deferred = Q.defer();
            if (data.name()) {
                // Construct the parameters required by the ARM template.
                var parameters = {
                    name: name,
                    location: location.name,
                    customProperty: name
                };
                // Fill out the template deployment options.
                var templateDeploymentOptions = {
                    subscriptionId: subscriptionId,
                    resourceGroupName: resourceGroupName,
                    resourceGroupLocation: resourceGroupLocation,
                    parameters: parameters,
                    deploymentName: galleryCreateOptions.deploymentName,
                    resourceProviders: [Constants.sdkResourceProvider],
                    resourceId: resourceIdFormattedString,
                    templateJson: this._getResourceTemplateJson(),
                };
                deferred.resolve(templateDeploymentOptions);
            }
            else {
                deferred.reject();
            }
            return deferred.promise;
        };
        CreateBladeViewModel.prototype._getResourceTemplateJson = function () {
            return JSON.stringify({
                $schema: "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
                contentVersion: "1.0.0.0",
                parameters: {
                    name: { type: "string" },
                    location: { type: "string" },
                    customProperty: { type: "string" }
                },
                resources: [
                    {
                        apiVersion: "2014-04-01",
                        name: "[parameters('name')]",
                        location: "[parameters('location')]",
                        type: resourceType,
                        properties: {
                            customProperty: "[parameters('customProperty')]"
                        }
                    }
                ]
            });
        };
        return CreateBladeViewModel;
    }(Forms.Form.ViewModel));
    exports.CreateBladeViewModel = CreateBladeViewModel;
});
