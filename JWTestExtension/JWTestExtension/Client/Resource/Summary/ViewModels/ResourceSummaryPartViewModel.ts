/// <reference path="../../../TypeReferences.d.ts" />

import ExtensionDefinition = require("../../../_generated/ExtensionDefinition");
import ClientResources = require("ClientResources");
import ResourceArea = require("../../ResourceArea");

import BladeNames = ExtensionDefinition.BladeNames;
import ResourceSummaryPartViewModel = ExtensionDefinition.ViewModels.Resource.ResourceSummaryPartViewModel;
import ViewModels = MsPortalFx.ViewModels;
import Parts = ViewModels.Parts;
import ResourceSummary = Parts.ResourceSummary;
import Properties = Parts.Properties;

/**
 * The ResourceSummray provides quick access to key properties that the consumers of the extension may want to use and also quick links
 * to common blades keys, quickstart, users, tags, settings
 */
export class ResourceSummaryPartViewModel extends ResourceSummary.ViewModel implements ResourceSummaryPartViewModel.Contract {

    private _resourceId: KnockoutObservableBase<string>;
    private _bladeSelection: KnockoutObservableBase<ViewModels.DynamicBladeSelection>;

    constructor(container: ViewModels.PartContainerContract, initialState: any, dataContext: ResourceArea.DataContext) {

        function getOptions(): ResourceSummary.Options {
            const getQuickStartSelection: ResourceSummary.GetDynamicBladeSelection = (inputs: ResourceSummaryPartViewModel.InputsContract) => {
                return <ViewModels.DynamicBladeSelection>{
                    detailBlade: BladeNames.quickStartBlade,
                    detailBladeInputs: {
                        id: inputs.resourceId
                    }
                }
            };

            return <ResourceSummary.Options>{
                getQuickStartSelection: getQuickStartSelection,
                getSettingsSelection: null,
                collapsed: false,
            };
        }

        super(initialState, getOptions(), container);

        this._resourceId = ko.observable<string>();
        this._bladeSelection = ko.observable<ViewModels.DynamicBladeSelection>({
            detailBlade: BladeNames.resourceBlade,
            detailBladeInputs: {}
        });

        const properties: Properties.Property[] = [

            // Text property
            new Properties.TextProperty(ClientResources.textPropertyLabel, this._resourceId),

            // Link property
            new Properties.LinkProperty(ClientResources.linkPropertyLabel, ClientResources.microsoftUri, ClientResources.linkPropertyLabel),

            // Open blade property
            new Properties.OpenBladeProperty(
                BladeNames.resourceBlade,
                ko.observable(BladeNames.resourceBlade),
                this._bladeSelection
            ),
        ];

        this.setProperties(properties);
    }

    // if subclass needs to run some additional logic in onInputsSet,
    // it should chain the promise returned by the base class.
    public onInputsSet(inputs: ResourceSummaryPartViewModel.InputsContract, settings: any): MsPortalFx.Base.Promise {
        return super.onInputsSet(inputs, settings).then(() => {
            this._resourceId(inputs.resourceId);

            this._bladeSelection({
                detailBlade: BladeNames.resourceBlade,
                detailBladeInputs: {
                    id: inputs.resourceId
                }
            });
        });
    }
}
