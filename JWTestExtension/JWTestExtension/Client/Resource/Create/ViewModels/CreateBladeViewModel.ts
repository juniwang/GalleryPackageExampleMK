import ResourceArea = require("../../ResourceArea");
import ClientResources = require("ClientResources");
import ExtensionDefinition = require("../../../_generated/ExtensionDefinition");
import CreateModel = require("../Models/CreateModel");
import Constants = require("../../../Shared/Constants");

import SelectorViewModel = MsPortalFx.ViewModels.Forms.Selector.ViewModel;
import FxAzure = MsPortalFx.Azure;
import Def = ExtensionDefinition.ViewModels.Resource.CreateBladeViewModel;
import Arm = FxAzure.ResourceManager;
import LocationPicker = FxAzure.ResourceManager.Pickers.Location;
import DataModels = JWTestExtension.DataModels;
import CreatorAndSelectorV2 = MsPortalFx.ViewModels.Forms.CreatorAndSelectorV2;
import Forms = MsPortalFx.ViewModels.Forms;
import SubscriptionsDropDown = FxAzure.Subscriptions.DropDown;
import LocationsDropDown = FxAzure.Locations.DropDown;
import ResourceGroups = FxAzure.ResourceGroups;

var resourceType = Constants.sdkResourceProvider + "/" + Constants.rootResource;

/**
 * Create blade view model
 */
export class CreateBladeViewModel
    extends Forms.Form.ViewModel<CreateModel>
    implements Def.Contract {

    public title: KnockoutObservable<string>;

    public subtitle: KnockoutObservable<string>;

    public icon: KnockoutObservable<MsPortalFx.Base.Image>;

    public actionBar: MsPortalFx.ViewModels.ActionBars.CreateActionBar.ViewModel;

    public parameterProvider: MsPortalFx.ViewModels.ParameterProvider<CreateModel, CreateModel>;

    public nameTextBox: MsPortalFx.ViewModels.Forms.TextBox.ViewModel;

    public subscriptionsDropDown: SubscriptionsDropDown;

    public resourceGroupDropDown: ResourceGroups.DropDown;

    public locationsDropDown: LocationsDropDown;

    public armProvisioner: Arm.Provisioner<CreateModel>;

    public generalSection: Forms.Section.ViewModel;

    private _dataContext: ResourceArea.DataContext;

    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: ResourceArea.DataContext) {
        super(container);
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

        this.parameterProvider = new MsPortalFx.ViewModels.ParameterProvider<CreateModel, CreateModel>(container, {
            mapOutgoingDataForCollector: (outgoing: CreateModel) => outgoing,
            mapIncomingDataForEditScope: this._mapIncomingDataForEditScope.bind(this)
        });

        // Use the form to edit the edit scope set up by the provider
        this.editScope = this.parameterProvider.editScope;

        this.armProvisioner = new Arm.Provisioner<CreateModel>(container, initialState, {
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

    private get _dataModel(): CreateModel {
        var editScope = this.editScope();
        return editScope && editScope.root;
    }

    private _initializeFormFields(container: MsPortalFx.ViewModels.ContainerContract, initialState?: any): void {
        this.nameTextBox = new MsPortalFx.ViewModels.Forms.TextBox.ViewModel(
            container,
            this,
            "name",
            {
                label: ko.observable(ClientResources.resourceName),
                emptyValueText: ko.observable(ClientResources.enterTheName),
                validations: ko.observableArray([
                    new MsPortalFx.ViewModels.RequiredValidation(ClientResources.resourceNameRequired)
                ])
            });

        this.nameTextBox.delayValidationTimeout(500);
        this.nameTextBox.valueUpdateTrigger = MsPortalFx.ViewModels.Controls.ValueUpdateTrigger.Input;

        // The subscriptions drop down.
        var subscriptionsDropDownOptions: SubscriptionsDropDown.Options = {
            options: ko.observableArray([]),
            form: this,
            accessor: this.createEditScopeAccessor((data) => {
                return data.subscription;
            }),
            validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
                new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectSubscription)
            ])
        };
        this.subscriptionsDropDown = new SubscriptionsDropDown(container, subscriptionsDropDownOptions);

        // The locations drop down.
        var locationsDropDownOptions: LocationsDropDown.Options = {
            options: ko.observableArray([]),
            form: this,
            accessor: this.createEditScopeAccessor((data) => {
                return data.location;
            }),
            subscriptionIdObservable: this.subscriptionsDropDown.subscriptionId,
            // TODO: Once you have your RP deployed in PROD/Dogfood you can remove the filter 
            // and replace it with the resourceTypesObservable below.  This will ensure that the location dropdown
            // will show only those locations where the resourceType is available to be deployed.
            //      resourceTypesObservable: ko.observable([resourceType]),

            validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
                new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectLocation)
            ]),
            // Optional -> Add location filtering by either providing a list of allowed locations OR
            // a list of disallowed locations (not both):
            filter: {
                allowedLocations: {
                    locationNames: ["chinanorth"],
                    disabledMessage: "This location is disabled for demo purposes."
                }
                //     OR -> disallowedLocations: [{
                //         name: "westeurope",
                //         disabledMessage: "This location is disabled for demo purporses (disallowed location)."
                //     }]
            }
        };
        this.locationsDropDown = new LocationsDropDown(container, locationsDropDownOptions);

        // The resource group drop down with creator inputs
        var resourceGroupsDropDownOptions: ResourceGroups.DropDown.Options = {
            options: ko.observableArray([]),
            form: this,
            accessor: this.createEditScopeAccessor((data) => {
                return data.resourceGroup;
            }),
            subscriptionIdObservable: this.subscriptionsDropDown.subscriptionId,
            validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
                new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectResourceGroup)
            ])
        };
        this.resourceGroupDropDown = new ResourceGroups.DropDown(container, resourceGroupsDropDownOptions);

        // Subscribe to resource group changes to update the location drop down with the resource group location.
        this.resourceGroupDropDown.value.subscribe(container, (resourceGroup) => {
            if (this.locationsDropDown) { // Make sure it's initialized.
                let locationsDropDown = <Forms.FilterComboBox.ViewModel>this.locationsDropDown.control;

                let resourceGroupLocation = resourceGroup && resourceGroup.value && resourceGroup.value.location;
                // Try to find the resource group location in the locations list.
                // This is a hierarchical option (i.e. not the full location object).
                let location = locationsDropDown.items().first((item) => {
                    return item.value === resourceGroupLocation;
                });

                // Since the location dropdown is filtering locations based on subscription and resource type,
                // the list will only contain allowed locations. If the resource group location doesn't exist
                // in the list, then it is not an allowed location, hence shouldn’t be selected. So set the
                // new location only if it's allowed.
                if (location) {
                    locationsDropDown.value(location.text());
                }
            }
        });

        // The form section.
        var sectionOptions = <Forms.Section.Options>{
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
    }

    private _mapIncomingDataForEditScope(incoming: CreateModel): CreateModel {
        var data: any = incoming;

        var galleryCreateOptions = this.armProvisioner.armProvisioningConfig
            && this.armProvisioner.armProvisioningConfig.galleryCreateOptions;

        var model: CreateModel = {
            name: ko.observable<string>(),
            subscription: ko.observable<FxAzure.Subscription>(),
            resourceGroup: ko.observable<FxAzure.CreatorAndDropdDownValue<FxAzure.ResourceGroup>>({
                value: {
                    name: ClientResources.selectResourceGroup,
                    location: null
                },
                createNew: false
            }),
            location: ko.observable<FxAzure.Location>(),
        };
        return model;
    }

    private _supplyProvisioningPromise(data: CreateModel): MsPortalFx.Base.PromiseV<Arm.TemplateDeploymentOptions> {
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

        var resourceIdFormattedString =
            `/subscriptions/${subscriptionId}/resourcegroups/${resourceGroupName}/providers/${resourceType}/${name}`;

        var deferred = Q.defer<Arm.TemplateDeploymentOptions>();

        if (data.name()) {
            // Construct the parameters required by the ARM template.
            var parameters: StringMap<string> = {
                name: name,
                location: location.name,
                customProperty: name
            };

            // Fill out the template deployment options.
            var templateDeploymentOptions: Arm.TemplateDeploymentOptions = {
                subscriptionId: subscriptionId,
                resourceGroupName: resourceGroupName,
                resourceGroupLocation: resourceGroupLocation,
                parameters: parameters,
                deploymentName: galleryCreateOptions.deploymentName,
                resourceProviders: [Constants.sdkResourceProvider],
                resourceId: resourceIdFormattedString,
                templateJson: this._getResourceTemplateJson(),
                //
                // Or -> templateLinkUri: galleryCreateOptions.deploymentTemplateFileUris["CreateResource"],
            };

            deferred.resolve(templateDeploymentOptions);
        } else {
            deferred.reject();
        }

        return deferred.promise;
    }

    private _getResourceTemplateJson(): string {
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
    }
}