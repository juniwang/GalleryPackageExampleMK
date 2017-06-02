/// <reference path="FxEnvironment.d.ts" />
/// <reference path="Html5.d.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />
/// <reference path="knockout.projections.d.ts" />
/// <reference path="MsPortalFx.d.ts" />
/// <reference path="Q.d.ts" />
/// <reference path="require.d.ts" />

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Base\Base.Net.Batch.d.ts
declare module "Fx/Base/Base.Net.Batch" {
    export = Main;
    module Main {
        import FxBase = MsPortalFx.Base;
        import Net2 = FxBase.Net2;
        /**
         * The contract for the batch settings.
         */
        interface BatchMultipleSettings {
            /**
             * The endpoint to make the request to.
             */
            endpoint: string;
            /**
             * The list of batch requests. All URIs have to be relative URIs in the request.
             */
            batchRequests: BatchRequest[];
            /**
             * Determines whether the ajax request is part of a background task.
             * If true the batch request will be pushed on to the background queue.
             */
            isBackgroundTask?: boolean;
            /**
             * Determines whether to append a telemetry header for the ARM calls.
             *
             * Set to a non-empty string to append the header. The value should be 60 characters or less and will be trimmed
             * if longer.
             */
            telemetryHeader?: string;
        }
        /**
         * Response for a request within a batch.
         */
        interface BatchResponseItem<T> {
            /**
             * The response content. Can be success or failure.
             */
            content: T;
            /**
             * The response headers.
             */
            headers: StringMap<string>;
            /**
             * The response status code.
             */
            httpStatusCode: number;
        }
        /**
         * Batch response.
         */
        interface BatchResponse {
            /**
             * The success response from ARM.
             */
            responses: BatchResponseItem<any>[];
        }
        /**
         * Individual batch request.
         */
        interface BatchRequest {
            /**
             * The URI to call.
             */
            uri: string;
            /**
             * The http method for the call. Defaults to GET
             * Note that ARM only supports GET calls in batch.
             */
            httpMethod?: string;
        }
        /**
         * Calls the API by batching multiple requests together.
         * Use this API if you have a single AJAX request but there is potential for batching this
         * with other requests.
         *
         * There are a few limitations when using this:
         *   - All requests must have absolute URIs
         *   - All requests to ARM must start with /providers/.. or /subscriptions/...
         *   - ARM only supports GET requests
         *
         * @param settings The settings to use to call batch.
         */
        function batch<T>(settings: Net2.NetAjaxSettings<T>): FxBase.PromiseV<BatchResponseItem<T>>;
        /**
         * Performs a batch ajax request using the given set of URIs.
         * This API is recommended if you have a set of URIs that can be called concurrently using batch.
          * There are a few limitations when using this:
         *   - All requests must have absolute URIs
         *   - All requests to ARM must start with /providers/.. or /subscriptions/...
         *   - ARM only supports GET requests
         *   - The max number of requests in a batch call is 20
         *
         * @param settings The settings that are to be passed to the batch call.
         * @return A promise for the batch call.
         */
        function batchMultiple(settings: BatchMultipleSettings): FxBase.PromiseV<BatchResponse>;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Composition\CustomControl.d.ts
declare module "Fx/Composition/CustomControl" {
    export = Main;
    module Main {
        /**
         * Defines the contract for control container that will be passed to the extension authored custom control.
         * Container acts as a lifetime manger for custom control resources and provides various shell interaction methods
         * that can be invoked by custom control.
         */
        interface Container extends MsPortalFx.Base.LifetimeManager {
            /**
             * Method to indicate that extension has partial data and ready to render the control.
             */
            revealContent(): void;
        }
        /**
         * Defines the contract for various properties that will be passed to the extension authored custom control.
         */
        interface Context<TOptions> {
            /**
             * The element to render the control in.
             */
            element: Element;
            /**
             * The configurable options used to render the control.
             */
            options: TOptions;
            /**
             * Control container that will be passed to the extension authored custom control.
             * Container is a lifetime manager and custom control should hook up its subscriptions, computed etc with the container.
             */
            container: Container;
            /**
             * Name of the extension consuming the custom control.
             * Custom control can decide if it needs to allow this extension to use the control or disallow the extension from using the control.
             * Custom control author is responsible for white listing which extensions will be able to use their published control.
             */
            callingExtensionName: string;
        }
        /**
         * Defines the contract for extension authored custom control.
         */
        interface Contract<TOptions> {
            /**
             * Context properties that will be setup by shell for extension authored custom control.
             * Context object will be set before onInitialize method is called.
             */
            context: Context<TOptions>;
            /**
             * Initialize method will be called by the shell after setting up the context properties on the custom control.
             * Extension author should resolve the promise once the data is fetched and control is ready to render.
             * In the event that control can be revealed with partial data, call revealContent on the container object present in the context.
             */
            onInitialize(): Q.Promise<any>;
            /**
             * Optionally pass in a dispose method which will be invoked when the control is disposed.
             */
            dispose?(): void;
        }
        /**
         * Default exports available on every custom control.
         */
        interface DefaultExports {
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Composition\CustomControl\FormField.d.ts
declare module "Fx/Composition/CustomControl/FormField" {
    import FxFormField = require("Fx/Controls/CustomControl/FormField");
    export = Main;
    module Main {
        import FxLifetimeManager = MsPortalFx.Base.LifetimeManager;
        /**
         * Defines the exports exposed by the form field custom control.
         * Extension author developing form field custom control must provide implementation for all the methods in the exports.
         */
        interface Exports {
            /**
             * triggerValidation method will be invoked to start the validation. Custom control implementation should implement any validation logic and return if the control is in valid state or not.
             *
             * @return Promise returning a boolean to indicate if control is in valid state or not.
             */
            triggerValidation(): Q.Promise<boolean>;
            /**
             * clearValidation method will be invoked reset the validation state.
             *
             * @return Returns a promise.
             */
            clearValidation(): Q.Promise<any>;
        }
        /**
         * Specifies the control contract for custom control implementing a form field.
         * Custom control implementation should provide appropriate implementation for the methods specified in the contract to properly participate in validation.
         */
        interface Contract extends Exports {
        }
        /**
         * Helper method to register the custom control to the validation framework.
         * Custom control should invoke this method so that control's triggerValidation will be invoked when Sections or ActionBar validation is triggered.
         *
         * @param formElement The root element which holds the label and form field container.
         * @param formControl Custom form field control with FormControlContract implementation.
         * @param formField The form field view model.
         */
        function registerControlForValidation<TValue>(lifetime: FxLifetimeManager, formElement: Element, formControl: Contract, formField: FxFormField.Options<TValue>): void;
        /**
         * Helper method to add a label and info ballon to the specified form container element.
         * The helper will inject appropriate style classes and will aid in having similar form field UX for the custom control.
         *
         * @param lifetime A LifetimeManager object that will notify when the data is no longer being used by the caller.
         * @param formElement The root element which holds the label and form field container.
         * @param formContainerElement The element which holds the custom control form field.
         * @param formField The form field view model.
         */
        function addLabelAndBalloon<TValue>(lifetime: FxLifetimeManager, formElement: Element, formContainerElement: Element, formField: FxFormField.Options<TValue>): void;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Composition\FramePart.d.ts
declare module "Fx/Composition/FramePart" {
    export = Main;
    module Main {
        /**
         * The signature of messages used by the FramePart.
         */
        const signature: string;
        /**
         * The kind of message indicating that content can be revealed.
         */
        const revealContentMessageKind: string;
        /**
         * The kind of message indicating that initialization has completed.
         */
        const initializationCompleteMessageKind: string;
        module Internal {
            interface Data<T> {
                /**
                 * Data passed from the shell to the control.
                 */
                postMessage: KnockoutObservable<Message<T>>;
                /**
                 * Data passed from the control to the shell.
                 */
                receiveMessage: KnockoutObservable<Message<T>>;
                /**
                 * Indicates whether the iframe control has initialized.
                 */
                isFrameReady: KnockoutObservable<boolean>;
                /**
                 * The signature to be used for messages routed to/from the IFrame.
                 */
                signature: string;
            }
            interface Options extends Main.Options {
                /**
                 * The signature of messages used by the FramePart.
                 */
                signature: string;
            }
        }
        /**
         * Defines the signature for a message handler.
         */
        type MessageHandler = (data: any) => void;
        /**
         * Defines a message sent between a frame part's view model and the frame.
         */
        interface Message<T> {
            /**
             * The message signature.
             */
            signature: string;
            /**
             * The message kind.
             */
            kind: string;
            /**
             * The message data.
             */
            data: T;
        }
        interface Options {
            /**
             * The URL of the page to load in the frame.
             */
            src: string;
        }
        class ViewModel {
            private _handlers;
            private _readyPromise;
            /**
             * The URL of the page to embed.
             */
            src: string;
            /**
             * Data passed to/from the shell and the control.
             */
            private _msPortalFxData;
            /**
             * Creates the view model for a frame part..
             *
             * @param lifetime Lifetime manager for this view model.
             * @param src The URL for the frame to be loaded in the part.
             */
            constructor(lifetime: MsPortalFx.ViewModels.PartContainerContract, options: Options);
            waitForFrameReady(): Q.Promise<void>;
            /**
             * Posts a message to the frame.
             *
             * @param kind The message kind.
             * @param data The data associated to the message.
             */
            postMessage: <T>(kind: string, data?: T) => void;
            /**
             * Attaches an event handler function for message events of the specified kind.
             *
             * @param kind The kind of message to listen to.
             * @param handler A function to execute when a message of the specified kind is received.
             */
            on(kind: string, handler: MessageHandler): void;
            /**
             * Removes an event handler.
             *
             * @param kind The kind of message.
             * @param handler A function previously attached to message events of the specified kind.
             */
            off(kind: string, handler: MessageHandler): void;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Composition\MenuBlade.d.ts
declare module "Fx/Composition/MenuBlade" {
    import * as Menu from "Fx/Controls/Menu";
    export = Main;
    module Main {
        /**
         * Defines an item in a group of the menu.
         */
        interface MenuItem extends Menu.MenuItem {
        }
        /**
         * Defines a group in the menu.
         */
        interface MenuGroup extends Menu.MenuGroup {
        }
        /**
         * The options for the menu.
         */
        interface Options extends Menu.Options {
        }
        /**
         * The sort functions used to sort groups in the menu.
         */
        const SortFunction: typeof Menu.SortFunction;
        /**
         * Defines the view model for a menu blade.
         */
        class ViewModel extends MsPortalFx.ViewModels.Blade {
            menu: Menu.ViewModel;
            /**
             * Creates the view model for a menu blade.
             *
             * @param container The container for the view model.
             */
            constructor(container: MsPortalFx.ViewModels.ContainerContract);
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\Batch\HeatMap.d.ts
declare module "Fx/Controls/Batch/HeatMap" {
    export = Main;
    module Main {
        /**
         * Represent an item in the heatMap
         */
        interface Item {
            /**
             * Id of an item in the heatmap. This NEED to be unique.
             */
            id: string;
            /**
             * State of the item
             */
            state: string;
            /**
             * Optional setting to make the item less opaque on the heatmap.
             * Default: 1
             */
            opacity?: number;
        }
        /**
         * Possible position of the legend relative to the heatmap.
         * i.e. LegendLocation.Left means the legend will be on the left of the heatmap.
         *
         * LegendLocation.None will not show the legend
         */
        enum LegendLocation {
            None = 0,
            Top = 1,
            Right = 2,
            Bottom = 3,
            Left = 4,
        }
        /**
         * Represent a possible state an item can have
         */
        interface State {
            /**
             * State id, Item added to the Heatmap should have their state match this id
             */
            id: string;
            /**
             * Label for the legend
             */
            label: KnockoutObservableBase<string>;
            /**
             * Color the tile with this state will have
             */
            color: MsPortalFx.ColorUtil.ColorCode;
            /**
             * Color opacity
             * @default 1
             */
            opacity?: number;
        }
        interface Options {
            /**
             * Message to be displayed in the heatmap if the item list is empty
             */
            noItemsMessage?: KnockoutObservableBase<string>;
            /**
             * List of available states. Every state that might be used in an item later on should be here.
             */
            states?: State[];
            /**
             * When one of the item has a state not defined in the lis_t above it will use this color
             */
            unknownStateColor?: MsPortalFx.ColorUtil.ColorCode;
            /**
             * Enable selection on the heatmap
             * @default true
             */
            isSelectable?: boolean;
            /**
             * If the heatmap control should expand automatically if the number of items don't fit in the initial window
             * @default false
             */
            isExpandable?: boolean;
            /**
             * Minimum number of pixel a tile side can be in the heatmap
             * Cannot be less that 1
             * @default 10
             */
            minTileSize?: number;
            /**
             * Maximum number of pixel a tile side can be in the heatmap
             * @default 100
             */
            maxTileSize?: number;
            /**
             * Legend location relative to the heatmap.
             * None will not show the legend.
             * @default Right
             */
            legendLocation?: KnockoutObservableBase<LegendLocation>;
        }
        interface ItemListDiff {
            added: Item[];
            updated: Item[];
            removed: Item[];
        }
        class ViewModel extends MsPortalFx.ViewModels.Controls.Base.ViewModel {
            states: State[];
            unknownStateColor: MsPortalFx.ColorUtil.ColorCode;
            noItemsMessage: KnockoutObservableBase<string>;
            errorMessage: string;
            minTileSize: number;
            maxTileSize: number;
            /**
             * Enable selection on the heatmap
             * @default true
             */
            isSelectable: boolean;
            /**
             * If the heatmap control should expand automatically if the number of items don't fit in the initial window
             * @default false
             */
            isExpandable: boolean;
            /**
             * Cache of the items used to compute the edits
             */
            private itemMap;
            /**
             * Legend location relative to the heatmap.
             * None will not show the legend.
             * @default Right
             * @see LegendOptions
             */
            legendLocation: KnockoutObservableBase<LegendLocation>;
            /**
             * Internal mapping of state by ID.
             * Used in the widget.
             */
            stateMap: StringMap<State>;
            /**
             * Internal callback that will pass the difference of items everytime setItems is called
             */
            _msPortalFxUpdateCallback: KnockoutObservable<(diffs: ItemListDiff) => void>;
            /**
             * Internal update to ask for a canvas redraw
             */
            _msPortalFxUpdateCanvas: KnockoutObservable<number>;
            /**
             * Observable containing the currently selected item.
             * Seleletable must be set to true in the options for this to be updated
             */
            selectedItem: KnockoutObservable<Item>;
            selectable: MsPortalFx.ViewModels.Selectable<Item>;
            /**
             * Buffer for to keep the last setItems args until the implementation set the callback
             */
            private _lastItemsBuffer;
            private defaultOptions;
            constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager, options?: Options);
            setItems(items: Item[]): void;
            /**
             * Force a render of the heatmap.
             * Use this if you have enableAutoRendering to false.
             */
            render(): void;
            private _createStateMap();
            private _createItemMap(items);
            private _computeDifference(oldMap, newMap);
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\CustomControl\FormField.d.ts
declare module "Fx/Controls/CustomControl/FormField" {
    export = Main;
    module Main {
        import FxViewModels = MsPortalFx.ViewModels;
        import FxForms = FxViewModels.Forms;
        /**
         * Specifies the options contract for form field custom control.
         * Extension author implementing a form field custom control must inherit their options contract from the below contract.
         * To optimize the amount of options properties exchanged across proxied layer, the recommendation is to expose optional properties.
         * Another recommended optimization is to have a union type with T and KnockoutObservableBase<T>.
         * Consumer of the control can decide if a specific properties needs to be configured or default implementation is fine.
         * Consumer of the control should allocate observable values if they will be subsequently need observable updates or will be updating those.
         * For optional properties, control implementation should have default values in the control if explicit values are not passed in the options.
         * For union types, control implementation should check which type was passed in and handle based on the passed in type.
         * The addLabelAndBalloon API will provide default implementations for various optional label properties and extension author implementing the
         * form field custom control should use addLabelAndBalloon API to add label support and align with portal form styling.
         */
        interface Options<TValue> {
            /**
             * Current value of the field.
             */
            value: KnockoutObservableBase<TValue>;
            /**
             * Whether the form element is dirty.
             */
            dirty?: KnockoutObservableBase<boolean>;
            /**
             * A flag to indicate validation state of the control.
             */
            valid?: KnockoutObservableBase<boolean>;
            /**
             * Label for the field.
             */
            label?: KnockoutObservableBase<string> | string;
            /**
             * Label position for the field.
             */
            labelPosition?: KnockoutObservableBase<FxForms.LabelPosition> | FxForms.LabelPosition;
            /**
             * SubLabel for the field.
             */
            subLabel?: KnockoutObservableBase<string> | string;
            /**
             * SubLabel position for the field.
             */
            subLabelPosition?: KnockoutObservableBase<FxForms.SubLabelPosition> | FxForms.SubLabelPosition;
            /**
             * Specifies sanitized HTML that will be displayed in an info balloon next to the field's label.
             */
            infoBalloonContent?: KnockoutObservableBase<string> | string;
            /**
             * Specifies Link object that will be displayed in an info balloon next to the field's label.
             */
            infoBalloonLinkContent?: KnockoutObservableBase<MsPortalFx.ViewModels.Controls.Balloon.Link> | MsPortalFx.ViewModels.Controls.Balloon.Link;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\DropDown.d.ts
declare module "Fx/Controls/DropDown" {
    export = Main;
    module Main {
        interface Item<T> {
            text: string | KnockoutObservableBase<string>;
            selectedItemOverride?: string | KnockoutObservableBase<string>;
            value: T;
            disabled?: boolean | KnockoutObservableBase<boolean>;
        }
        interface Group<T> {
            text: string | KnockoutObservableBase<string>;
            children?: Array<Item<T> | Group<T>> | KnockoutObservableBase<Array<Item<T> | Group<T>>>;
            disabled?: boolean | KnockoutObservableBase<boolean>;
        }
        interface Options<T> extends MsPortalFx.ViewModels.Forms.Base.Input.Options<T> {
            items?: KnockoutObservableBase<Array<Item<T> | Group<T>>>;
            filter?: boolean | KnockoutObservableBase<boolean>;
            /**
            * Sets the filter textbox's placeholder.
            * Default is blank.
            */
            filterPlaceholder?: string | KnockoutObservable<string>;
            /**
             * Callback which will override our simple substring filtering.
             * Return list of items you wish to filter.
             * Doesn't do anything unless filter is true.
             */
            customFilter?: (value: string) => MsPortalFx.Base.PromiseV<T[]>;
            multiselect?: boolean | KnockoutObservableBase<boolean>;
            selectAll?: boolean | KnockoutObservableBase<boolean>;
            /**
             * Callback which will override our selectAll functionality.
             * Allows you to select any items you wish, we don't do any selecting when you provide this override.
             */
            selectAllOverride?: () => MsPortalFx.Base.PromiseV<any>;
        }
        class ViewModel<T> extends MsPortalFx.ViewModels.Forms.Base.Input.ViewModel<T> {
            items: KnockoutObservableBase<Array<Item<T> | Group<T>>>;
            filter: boolean | KnockoutObservableBase<boolean>;
            /**
            * Sets the filter textbox's placeholder.
            * Default is blank.
            */
            filterPlaceholder: string | KnockoutObservable<string>;
            /**
             * Callback which will override our simple substring filtering.
             */
            customFilter: (value: string) => MsPortalFx.Base.PromiseV<T[]>;
            multiselect: boolean | KnockoutObservableBase<boolean>;
            selectAll: boolean | KnockoutObservableBase<boolean>;
            /**
             * Callback which will override our selectAll functionality.
             */
            selectAllOverride: () => MsPortalFx.Base.PromiseV<any>;
            /**
             * Value is of type T or Array<T> depending on whether multiselect is set;
             */
            value: KnockoutObservableBase<T> & KnockoutObservableBase<Array<T>>;
            /**
             * Constructs an instance of a Dropdown form field.
             *
             * @param lifetimeManager A LifetimeManager object that will notify when the data is no longer being used by the caller.
             * @param options Optional The set of options to configure the Dropdown control.
             */
            constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager, options?: Options<T>);
            /**
             * Constructs an instance of a Dropdown form field.
             *
             * @param lifetimeManager A LifetimeManager object that will notify when the data is no longer being used by the caller.
             * @param form The form element within which the Dropdown is contained.
             * @param observablePath The path to the value on the EditScope to be bound to this field.
             * @param options Optional The set of options to configure the Dropdown control.
             */
            constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager, form: MsPortalFx.ViewModels.Forms.Form.ViewModel<any>, observablePath: string, options?: Options<T>);
            /**
             * Constructs an instance of a Dropdown form field.
             *
             * @param lifetimeManager A LifetimeManager object that will notify when the data is no longer being used by the caller.
             * @param form The form element within which the Dropdown is contained.
             * @param accessor Used to read and write values to the edit scope.  Use Form.createEditScopeAccessor methods to create this object.
             * @param options Optional The set of options to configure the Dropdown control.
             */
            constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager, form: MsPortalFx.ViewModels.Forms.Form.ViewModel<any>, accessor: MsPortalFx.ViewModels.Forms.EditScopeAccessors<string>, options?: Options<T>);
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\Essentials.d.ts
declare module "Fx/Controls/Essentials" {
    import { Container as BladeContainer } from "Fx/Composition/Blade";
    import { ClickableLink } from "Fx/Composition";
    export = Main;
    module Main {
        import FxViewModels = MsPortalFx.ViewModels;
        import BaseViewModel = FxViewModels.Controls.Base.ViewModel;
        /**
         * Essentials type of options.
         */
        const enum OptionType {
            /**
             * Default options with resource id.
             */
            Default = 1,
            /**
             * Custom layout capable options with resource id.
             */
            CustomLayout = 2,
            /**
             * Non-resource options.
             */
            NonResource = 3,
        }
        /**
         * Built-In properties those can be obtained from resource data.
         */
        const enum BuiltInType {
            /**
             * Built-in resource group property.
             */
            ResourceGroup = 1,
            /**
             * Built-in status property.
             */
            Status = 2,
            /**
             * Built-in location property.
             */
            Location = 3,
            /**
             * Built-in subscription name property.
             */
            SubscriptionName = 4,
            /**
             * Built-in subscription id property.
             */
            SubscriptionId = 5,
        }
        /**
         * Blade close options.
         */
        interface BladeCloseOptions {
            /**
             * Built-in type to know who called the onBladeClose.
             */
            builtInType: BuiltInType;
            /**
             * A callback funtion called when the resource blade is closed.
             */
            onBladeClose: (type: BuiltInType) => void;
        }
        /**
         * Base options.
         */
        interface Options {
            /**
             * Expanded state of the essentials control.
             */
            expanded?: KnockoutObservable<boolean>;
            /**
             * This function is called when the expander is clicked.
             */
            onExpanderClick?: (isExpanded: boolean) => void;
        }
        /**
         * Most common default options with resource.
         */
        interface DefaultOptions extends Options {
            /**
             * Resource id.
             */
            resourceId: string;
            /**
             * List of built-in types to hide.
             */
            hiddenBuiltInTypes?: BuiltInType[];
            /**
             * List of built-in types to hide the "change", move resource, button.
             */
            hiddenChangeLink?: BuiltInType[];
            /**
             * Additional static properties on the left besides the usual 5 items.
             */
            additionalLeft?: (Item | MultiLineItem)[];
            /**
             * Additional static properties on the right.
             */
            additionalRight: (Item | MultiLineItem)[];
            /**
             * This callback function is called when the resource blade is opened.
             */
            onBladeOpen?: (type: BuiltInType) => void;
            /**
             * This callback function is called when the resource blade is closed.
             */
            onBladeClose?: (type: BuiltInType) => void;
        }
        /**
         * Custom layout options with resource.
         */
        interface CustomLayoutOptions extends Options {
            /**
             * Resource id.
             */
            resourceId: string;
            /**
             * List of items to render on the left pane.
             */
            left: (Item | MultiLineItem | BuiltInType)[];
            /**
             * List of items to render on the right pane.
             */
            right: (Item | MultiLineItem | BuiltInType)[];
            /**
             * List of built-in types to hide the "change" button, move resource blade opening button, right next to the built-in type label.
             */
            hiddenChangeLink?: BuiltInType[];
            /**
             * This callback function is called when the resource blade is opened.
             */
            onBladeOpen?: (type: BuiltInType) => void;
            /**
             * This callback function is called when the resource blade is closed.
             */
            onBladeClose?: (type: BuiltInType) => void;
        }
        /**
         * Non-resource options.
         */
        interface NonResourceOptions extends Options {
            /**
             * List of items to render on the left pane.
             */
            left: (Item | MultiLineItem)[];
            /**
             * List of items to render on the right pane.
             */
            right: (Item | MultiLineItem)[];
        }
        /**
         * Properties of an item.
         */
        interface ItemProperty {
            /**
             * Item value to show.
             */
            value: string | KnockoutObservable<string>;
            /**
             * OnClick handler for the item.
             */
            onClick?: (() => void) | ClickableLink;
        }
        /**
         * Single-line item.
         */
        interface Item extends ItemProperty {
            /**
             * Label for the item.
             */
            label: string;
        }
        /**
         * Multi-line item.
         */
        interface MultiLineItem {
            /**
             * Label for the multi-line item.
             */
            label: string;
            /**
             * Arrays of item properties.
             * Multi-line item contains one label and multiple item properties.
             */
            lines: ItemProperty[];
        }
        /**
         * Essentials control viewModel.
         */
        class ViewModel extends BaseViewModel {
            /**
             * Expanded state.
             */
            expanded: KnockoutObservable<boolean>;
            /**
             * Essentials disabled state.
             */
            disabled: KnockoutObservable<boolean>;
            private _container;
            private _msPortalFxPrivates;
            /**
             * Constructs essentials viewModel.
             * The most common essentials control with resource id.
             *
             * @param container A template blade container.
             * @param options The set of options to configure the essentials.
             */
            constructor(container: BladeContainer, options: DefaultOptions);
            /**
             * Constructs essentials viewModel.
             * Essentials control with resource id and flexible layout capability.
             *
             * @param container A template blade container.
             * @param options The set of options to configure the essentials.
             */
            constructor(container: BladeContainer, options: CustomLayoutOptions);
            /**
             * Constructs essentials viewModel.
             * Essentials control without resource id and flexible layout capability.
             *
             * @param container A template blade container.
             * @param options The set of options to configure the essentials.
             */
            constructor(container: BladeContainer, options: NonResourceOptions);
            /**
             * Add items dynamically to the essentials control.
             *
             * @param left An array of item to add.
             * @param right An array of item to add.
             */
            addDynamicProperties(left: (Item | MultiLineItem)[], right: (Item | MultiLineItem)[]): void;
            /**
             * Set "Status" property.
             * No effect with NonResourceOptions essentials control.
             *
             * @param status A string value to set the "Status" property value.
             */
            modifyStatus(status: string): void;
            private _openBlade(resourceId, bladeCloseOptions?);
            private _openMoveResourceBlade(bladeReference);
            private _getResourceInfo(resourceId);
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\HotSpot.d.ts
declare module "Fx/Controls/HotSpot" {
    import Selectable = require("Fx/Composition/Selectable");
    export = Main;
    module Main {
        import BaseViewModel = MsPortalFx.ViewModels.Controls.HotSpot.BaseViewModel;
        interface ViewModelOptions {
            onClick?: () => void;
            clickableDuringCustomize?: boolean;
        }
        /**
         * View model for hotspots
         */
        class ViewModel extends BaseViewModel {
            private _msPortalFxOnClick;
            /**
             * Creates a HotSpot ViewModel.
             */
            constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager, options?: ViewModelOptions);
        }
        class ViewModel2 extends FxImpl.Controls.HotSpot.ViewModel2 {
            /**
             * Creates a HotSpot ViewModel.
             */
            constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager, selectableOptions?: Selectable.Selectable2Options<any>, clickableDuringCustomize?: boolean);
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\Legend.d.ts
declare module "Fx/Controls/Legend" {
    export = Main;
    module Main {
        /**
         * Defines hatching patterns.
         */
        enum Pattern {
            /**
             * The area is solid.
             */
            Solid = 0,
            /**
             * The area is cross hatched.
             */
            CrossHatching = 1,
            /**
             * The area is diagonal hatched.
             */
            DiagonalHatching = 2,
            /**
             * The area is hatched horizontally.
             */
            DottedHatching = 3,
        }
        /**
         * Options for Legend ViewModel.
         */
        interface Options {
            /**
             * Data being displayed.
             */
            data?: KnockoutObservableArray<any>;
            /**
             * Data key used to identify the row index. Leave unset to use the index within data.
             */
            indexKey?: string;
            /**
             * Data key used to identify the color.
             */
            colorKey: string;
            /**
             * Data key of the hatching pattern.
             */
            hatchingKey?: string;
            /**
             * Data key used to identify the boolean column indicating if the row is selected.
             */
            selectedKey?: string;
            /**
             * Data key used to label the row for display purpose. Data has to be string, we use to show center caption for quick indication of the item.
             */
            labelKey: string;
            /**
             * Index of current hovered row in the legend.
             */
            hoveredIndex?: KnockoutObservable<string>;
        }
        class ViewModel extends MsPortalFx.ViewModels.Controls.Base.ViewModel {
            /**
             * Data being displayed.
             */
            data: KnockoutObservableArray<any>;
            /**
             * Data key used to identify the row index. Leave unset to use the index within data.
             */
            indexKey: string;
            /**
             * Data key used to identify the color.
             */
            colorKey: string;
            /**
             * Data key of the hatching pattern.
             */
            hatchingKey: string;
            /**
             * Data key used to identify the boolean column indicating if the row is selected.
             */
            selectedKey: string;
            /**
             * Data key used to label the row for display purpose. Data has to be string, we use to show center caption for quick indication of the item.
             */
            labelKey: string;
            /**
             * Index of current hovered row in the legend.
             */
            hoveredIndex: KnockoutObservable<string>;
            constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager, options?: Options);
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\Menu.d.ts
declare module "Fx/Controls/Menu" {
    export = Main;
    module Main {
        import FxViewModels = MsPortalFx.ViewModels;
        import FxControls = FxViewModels.Controls;
        import FxGrid = MsPortalFx.ViewModels.Controls.Lists.Grid;
        /**
         * Attributes common to all items and groups in the menu.
         */
        interface MenuItemBase extends FxImpl.Controls.Menu.MenuItemBase {
        }
        /**
         * Defines an item in a group of the menu.
         */
        interface MenuItem extends FxImpl.Controls.Menu.MenuItem {
        }
        /**
         * Defines a group in the menu.
         */
        interface MenuGroup extends FxImpl.Controls.Menu.MenuGroup {
        }
        /**
         * The options for the menu.
         */
        interface Options extends FxImpl.Controls.Menu.Options {
        }
        /**
         * The sort order used for groups in the menu.
         */
        export import SortOrder = FxGrid.SortOrder;
        /**
         * The sort functions used to sort groups in the menu.
         */
        enum SortFunction {
            /**
             * Uses the built-in Array.sort() function.
             */
            Default = 0,
            /**
             * Uses the getTime() value of Date object to sort.
             */
            DateTime = 1,
            /**
             * Uses custom sorting, that ensures that the support group is prioritized over others.
             */
            SupportFirst = 9999,
        }
        /**
         * Defines the view model for the menu control.
         */
        class ViewModel extends FxControls.Base.ViewModel {
            /**
             * The groups of menu items.
             */
            groups: KnockoutObservableArray<MenuGroup>;
            /**
             * Specifies the sort order used for groups in the menu.
             */
            groupSortOrder: SortOrder;
            /**
             * Specifies the sort function used to order groups in the menu.
             */
            groupSortFunction: SortFunction;
            private _msPortalFxData;
            constructor(lifetime: MsPortalFx.Base.LifetimeManager, groupSortFunction?: SortFunction);
            /**
             * Sets the options for the menu.
             *
             * @param options The options to configure the menu.
             */
            setOptions: (options: Options) => void;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\Toolbar\MoveResourceToolbarButton.d.ts
declare module "Fx/Controls/Toolbar/MoveResourceToolbarButton" {
    import * as FxCompositionBlade from "Fx/Composition/Blade";
    export = Main;
    module Main {
        import FxViewModels = MsPortalFx.ViewModels;
        import Toolbars = FxViewModels.Toolbars;
        interface Options {
            /**
             * Resource id.
             */
            resourceId: string;
        }
        /**
         * Creates the move resource toolbar button.
         */
        class ViewModel extends Toolbars.DialogButton implements Toolbars.ToolbarButtonContract {
            /**
             * Creates the move resource toolbar button for moving resources acrooss resource groups/subscriptions.
             *
             * @param container container for the toolbar.
             * @param resourceId resource Id of the resource to be moved.
             *
             * @return A toolbar button which allows moving resources across resource groups/subscriptions.
             */
            constructor(container: FxCompositionBlade.Container, options: Options);
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Controls\Video.d.ts
declare module "Fx/Controls/Video" {
    export = Main;
    module Main {
        /**
         * Options that can be set on the Video control
         */
        interface Options {
            /**
             * Source of the video
             */
            src?: KnockoutObservableBase<string> | string;
            /**
             * Play video immediatly after load
             */
            autoplay?: KnockoutObservableBase<boolean> | boolean;
        }
        /**
         * Video control view model
         */
        class ViewModel extends MsPortalFx.ViewModels.Controls.Base.ViewModel {
            /**
             * URL of the desired video
             */
            src: KnockoutObservableBase<string> | string;
            /**
             * Play video immediatly after load
             */
            autoplay: KnockoutObservableBase<boolean> | boolean;
            /**
             * True if current video type supports autoplay
             */
            canAutoplay: KnockoutReadOnlyObservable<boolean>;
            /**
             * Constructs Video view model
             *
             * @param lifetime - Lifetime Manager for the view model
             * @param options - Set of options to configure video control
             */
            constructor(lifetime: MsPortalFx.Base.LifetimeManager, options?: Options);
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Feedback.d.ts
declare module "Fx/Feedback" {
    export = Main;
    module Main {
        /**
         * DEPRECATED - no longer opens a feedback pane
         *
         * @param resourceId? The ID of the resource the user has deleted.
         * @param additionalData? Any additional data to log with the feedback submission.
         */
        function openResourceDeletedFeedbackPane(resourceId?: string, additionalData?: any): Q.Promise<any>;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Commands\ListCommand.d.ts
declare module "Fx/Internal/Commands/ListCommand" {
    export = Main;
    module Main {
        class ListCommand extends MsPortalFx.ViewModels.ListCommand implements FxImpl.ListCommand2Contract {
            lc2: boolean;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Composition\CustomControl.d.ts
declare module "Fx/Internal/Composition/CustomControl" {
    import FxCustomControl = require("Fx/Composition/CustomControl");
    export = Main;
    module Main {
        import ControlType = MsPortalFx.ViewModels.ControlType;
        const triggerValidationFunc: string;
        const clearValidationFunc: string;
        /**
         * Defines the contract for an AMD module that contains a custom control.
         */
        interface Module<T> {
            /**
             * Defines the class used for the custom control.
             */
            Control: new () => FxCustomControl.Contract<T>;
        }
        /**
         * Defines the internal properties that will be merged with the control's view model properties to generate the control reference.
         */
        interface HostContract {
            /**
             * Defaults to CustomControl and internally assigned.
             */
            controlType: ControlType;
            /**
             * Metadata properties to uniquely indentify the custom control.
             */
            _msPortalFxMetadata: {
                name: string;
                extension: string;
            };
            /**
             * StringMap of function callbacks linking the view model methods with the corresponding exported methods from the control.
             */
            _msPortalFxExportsCallback: KnockoutObservableBase<StringMap<Function>>;
        }
        /**
         * Mixes an object that plays the following roles: -
         * 1. Control reference to determine the custom control to initialize.
         * 2. View model for the custom control.
         * 3. Optionally, provide form validation infrastructure.
         * NOTE: Even though this API is within an 'Internal' module, we need to maintain runtime
         * compatibility. This is necessary since this API is consumed by PDL auto-generated code.
         */
        function makeReference<T, TExports>(lifetime: MsPortalFx.Base.LifetimeManager, name: string, extension: string, options: T, isFormField?: boolean): T & TExports;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Composition\CustomControlUtil.d.ts
declare module "Fx/Internal/Composition/CustomControlUtil" {
    export = Main;
    module Main {
        import FxLabelAndBalloon = MsPortalFx.ViewModels.Forms.Base.LabelAndBalloon;
        var utilitiesModule: CustomControlUtilities;
        /**
         * Defines the contract for LabelAndBalloonWidget implemented in the shell.
         */
        interface LabelAndBalloonWidgetContract {
            /**
             * Method to attach the label widget and link the provided form element and form container element.
             *
             * @param domAnchor Root form element which has the label and form container element holding the form control.
             * @param elementToAppend The form container element which holds the form control.
             */
            appendWidgetToDom(domAnchor: JQuery, elementToAppend: JQuery): void;
            /**
             * Method to insert label before the form container element.
             *
             * @param anchor The form container element.
             * @param labelOptions Optional config properties for the label.
             */
            insertLabelBefore(anchor: JQuery, labelOptions?: {
                emptyLabel?: boolean;
                inlineLabel?: boolean;
            }): void;
            /**
             * Method to insert sublabel after the form container element.
             *
             * @param anchor The form container element.
             */
            insertSubLabelAfter(anchor: JQuery): void;
        }
        /**
         * Defines custom control specific helper utilities available only in the shell but needed in the framework client context.
         * The actual implementation of the utilities will be set during runtime.
         */
        interface CustomControlUtilities {
            /**
             * Creates an instance of LabelAndBalloonWidget from shell.
             *
             * @param lifetime A LifetimeManager object that will notify when the data is no longer being used by the caller.
             * @param labelOptions Config options for LabelAndBalloonWidget.
             * @return An instance of LabelAndBalloonWidget.
             */
            createLabelAndBalloonWidget(lifetime: MsPortalFx.Base.LifetimeManager, labelOptions: FxLabelAndBalloon.Options): LabelAndBalloonWidgetContract;
        }
        /**
         * Intializes the actual utilities implementation from shell at runtime.
         *
         * @param utilities Shell custom control utilities implementation.
         */
        function initialize(utilities: CustomControlUtilities): void;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Composition\MenuBlade.d.ts
declare module "Fx/Internal/Composition/MenuBlade" {
    import MenuBlade = require("Fx/Composition/MenuBlade");
    export = Main;
    module Main {
        /**
         * Defines an item in a group of the menu.
         */
        interface MenuItem extends MenuBlade.MenuItem {
            /**
             * A value indicating whether or not the item should be visible in the menu.
             */
            visible?: KnockoutObservable<boolean>;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\Grid2.d.ts
declare module "Fx/Internal/Controls/Grid2/Grid2" {
    export = Main;
    module Main {
        import Lists = FxImpl.ViewModels.Controls.Lists;
        import Grid2 = Lists.Grid2;
        /**
         * Data for a Grid2 Row
         */
        interface Row<T, TId> extends Grid2.Row<T, TId> {
        }
        /**
         * Data for a Grid2 Column
         */
        interface Column extends Grid2.Column {
        }
        /**
         * Grid2 initialization options
         */
        interface Options<T, TId> extends Grid2.Options<T, TId> {
        }
        /**
         * Grid2 context menu initialization options
         */
        interface ContextMenuOptions extends Grid2.ContextMenuOptions {
        }
        /**
         * Grid2 demand loading initialization options
         */
        interface DemandLoadingOptions extends Grid2.DemandLoadingOptions {
        }
        /**
         * Grid2 editing initialization options
         */
        interface EditingOptions extends Grid2.EditingOptions {
        }
        /**
         * Grid2 focus initialization options
         */
        interface FocusOptions extends Grid2.FocusOptions {
        }
        /**
         * Grid2 grouping initialization options
         */
        interface GroupingOptions extends Grid2.GroupingOptions {
        }
        /**
         * Grid2 hierarchical initialization options
         */
        interface HierarchicalOptions extends Grid2.HierarchicalOptions {
        }
        /**
         * Grid2 hover initialization options
         */
        interface HoverOptions extends Grid2.HoverOptions {
        }
        /**
         * Grid2 paging initialization options
         */
        interface PagingOptions extends Grid2.PagingOptions {
        }
        /**
         * Grid2 resizing initialization options
         */
        interface ResizingOptions extends Grid2.ResizingOptions {
        }
        /**
         * Grid2 scrolling initialization options
         */
        interface ScrollingOptions extends Grid2.ScrollingOptions {
        }
        /**
         * Grid2 search initialization options
         */
        interface SearchOptions extends Grid2.SearchOptions {
        }
        /**
         * Grid2 selection initialization options
         */
        interface SelectionOptions extends Grid2.SelectionOptions {
        }
        /**
         * Grid2 sorting initialization options
         */
        interface SortingOptions extends Grid2.SortingOptions {
        }
        /**
         * View model class for Grid2
         */
        class ViewModel<T, TId> extends Lists.Base.ViewModel<T, TId> implements Grid2.Contract<T, TId>, Lists.Base.ActionHandler {
            /**
             * Shows the column header.
             */
            showHeader: boolean;
            /**
             * Column definitions.
             */
            columns: KnockoutObservableArray<Grid2.Column>;
            /**
             * Summary of the table.
             */
            summary: KnockoutObservable<string>;
            /**
             * No rows message when no items are displayed.
             */
            noRowsMessage: KnockoutObservable<string>;
            /**
             * Message displayed while loading of the table begins.
             * This occurs while retieving the count of items to obtain from the data source.
             */
            loadingMessage: KnockoutObservable<string>;
            /**
             * Row ids of all currently disabled rows.
             */
            disabledRowIds: KnockoutObservableArray<any>;
            contextMenu: Grid2.ContextMenuContract;
            demandLoading: Grid2.DemandLoadingContract;
            editing: Grid2.EditingContract;
            focus: Grid2.FocusContract;
            hover: Grid2.HoverContract;
            grouping: Grid2.GroupingContract;
            hierarchical: Grid2.HierarchicalContract;
            paging: Grid2.PagingContract;
            reordering: Grid2.ReorderingContract;
            resizing: Grid2.ResizingContract;
            scrolling: Grid2.ScrollingContract;
            search: Grid2.SearchContract;
            selection: Grid2.SelectionContract<T, TId>;
            sorting: Grid2.SortingContract;
            _filterActions: boolean;
            constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager, options?: Options<T, TId>);
            dispose(): void;
            private _initialize(options);
            private _validate();
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Base.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base" {
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Base class for grid2 plugins
             */
            class BasePlugin {
                _contract: Grid2.Contract<any, any>;
                constructor(contract: Grid2.Contract<any, any>);
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.ContextMenu.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.ContextMenu" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 context menu plugin
             */
            class ContextMenuPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.DemandLoading.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.DemandLoading" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 demand loading plugin
             */
            class DemandLoadingPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Editing.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Editing" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 editing plugin
             */
            class EditingPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Focus.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Focus" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 focus plugin
             */
            class FocusPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Grouping.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Grouping" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 grouping plugin
             */
            class GroupingPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Hierarchical.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Hierarchical" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 hierarchical plugin
             */
            class HierarchicalPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Hover.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Hover" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 hover plugin
             */
            class HoverPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Paging.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Paging" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 paging plugin
             */
            class PagingPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Reordering.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Reordering" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 reordering plugin
             */
            class ReorderingPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Resizing.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Resizing" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 resizing plugin
             */
            class ResizingPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Scrolling.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Scrolling" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 scrolling plugin
             */
            class ScrollingPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Search.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Search" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 search plugin
             */
            class SearchPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Selection.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Selection" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        import Selection2 = MsPortalFx.ViewModels.Internal.Selection2;
        module Internal {
            /**
             * Selectable set used by grids to handle different columns activating different blades.
             */
            class GridSelectionViewModel<T, TId> implements Grid2.SelectionContract<T, TId> {
                /**
                 * Data item dynamic selection provider.
                 */
                dynamicSelectionProvider: Selection2.DynamicSelectionProvider<any, T, any>;
                /**
                 * Data item command group provider.
                 */
                commandGroupProvider: Selection2.CommandGroupProvider<T>;
                /**
                 * Set selection mode.
                 * Single (Default), Multiple, or None.
                 */
                selectionMode: Selection2.SelectionMode;
                /**
                 * Set activation mode.
                 * Single (Default), Multiple, or None.
                 */
                activationMode: Selection2.ActivationMode;
                /**
                 * Indicates when all items in the set are selected.
                 */
                selectedAll: KnockoutReadOnlyObservable<boolean>;
                /**
                 * Currently activated data item ids and column information in the set.
                 */
                activatedIdsWithColumnInformation: KnockoutReadOnlyObservableArray<{
                    id: TId;
                    column: string;
                }>;
                /**
                 * Enables selection.
                 * Default is true.
                 */
                enabled: boolean;
                /**
                 * The property containing the uri of the website it should open when activated.
                 */
                linkUriProperty: string;
                _msPortalFxSelectableSet: Selection2.SelectableSet<T, {
                    id: TId;
                    column: string;
                }>;
                private _selectedIds;
                private _unselectedIds;
                private _activatedIds;
                /**
                 * Constructs a list base selection view model.
                 *
                 * @param lifetime Lifetime manager.
                 * @param options Selection options.
                 */
                constructor(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.SelectionOptions);
                /**
                 * Currently selected data item ids in the set.
                 */
                selectedIds: KnockoutReadOnlyObservableArray<TId>;
                /**
                 * Currently unselected data items when selectAll is applied.
                 */
                unselectedIds: KnockoutReadOnlyObservableArray<TId>;
                /**
                 * Currently activated data item ids in the set.
                 */
                activatedIds: KnockoutReadOnlyObservableArray<TId>;
            }
            class SelectionPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\Grid2\ViewModels.Grid2.Sorting.d.ts
declare module "Fx/Internal/Controls/Grid2/ViewModels.Grid2.Sorting" {
    import Base = require("Fx/Internal/Controls/Grid2/ViewModels.Grid2.Base");
    export = Main;
    module Main {
        import Grid2 = FxImpl.ViewModels.Controls.Lists.Grid2;
        module Internal {
            /**
             * Grid2 sorting plugin
             */
            class SortingPlugin extends Base.Internal.BasePlugin implements Grid2.Internal.Plugin {
                constructor(contract: Grid2.Contract<any, any>);
                initialize(lifetime: MsPortalFx.Base.LifetimeManager, options: Grid2.Options<any, any>): void;
                isEnabled(): boolean;
                validate(plugins: Grid2.Internal.Plugins): void;
            }
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Controls\IntuneAppFileUpload.d.ts
declare module "Fx/Internal/Controls/IntuneAppFileUpload" {
    export = Main;
    module Main {
        import VMForms = MsPortalFx.ViewModels.Forms;
        import Base = VMForms.Base;
        import FxFileUpload = MsPortalFx.ViewModels.FileUpload;
        import FxPromise = MsPortalFx.Base.Promise;
        /**
         *  Specifies the types of App Platforms
         */
        const enum AppPlatform {
            /**
             *  iOS
             */
            iOS = 0,
            /**
             * Android
             */
            Android = 1,
        }
        /**
         * Intune Context
         * This is an optional property in ResumeContext and presence of this property in ResumeContext indicates the intent to resume an upload after browser refresh/crash/close.
         */
        interface IntuneAppContext {
            /**
             * Intune application id (guid) associated with the uploaded file content
             */
            appId: string;
            /**
             * Intune application type
             */
            appType: string;
            /**
             * Intune client activity id
             */
            activityId: string;
            /**
             * Graph endpoint defines the environment to connect to
             */
            graphEndpoint: string;
            /**
             * Graph version controls flighting
             */
            graphVersion: string;
            /**
             * App properties in the UX that can be updated with final patch
             */
            appProperites: StringMap<string>;
        }
        /**
         * Optional context information passed to the resume API.
         * Resume is called to start a new upload, start a new upload overriding upload context, resume an in-memory paused upload and resume an upload across browser session.
         * Intune context provides information specific to creating apps in the Microsoft Intune cloud service.
         */
        interface IntuneContext extends FxFileUpload.ResumeContext {
            /**
             * Used to pass information to the Intune App uploader which is needed to complete the creation of an Intune application after the file content has been uploaded.
             */
            intuneAppContext?: IntuneAppContext;
        }
        /**
         * App metadata information.
         */
        interface AppMetadataContract {
            /**
             * Primary identifier of the app used for detection
             */
            appId: string;
            /**
             * Version identifier of the app used for detection
             */
            versionId: string;
            /**
             * The name of app package
             */
            appName: string;
            /**
             * The name of app package file
             */
            appFileName: string;
            /**
             * The total size of the app in bytes
             */
            appPackageSize: number;
            /**
             * The type of app package
             */
            appPackageType: string;
            /**
             * App version for display
             */
            appVersion: string;
            /**
             * The device platform for the package
             */
            appPlatform: AppPlatform;
            /**
             * The minimum platform OS version supported by the app package
             */
            minPlatformVersion: string;
            /**
             * Is the app package MAM enabled
             */
            mamEnabled: boolean;
            /**
             * Intune MAM SDK version (if MAM enabled)
             */
            mamSDKVersion: string;
            /**
             * The date the app expires and can no longer be installed
             */
            expirationDate: string;
            /**
             * Manifest XML as a base 64 string
             */
            manifest: string;
            /**
             * Array of app metadata properties parsed from the app package
             * which are unique to the platform or package type
             */
            appProperties: StringMap<string>;
            /**
             * Error messages to indicate the runtime errors.
             */
            errorMessage?: string;
            /**
             * Method to parse the selected app content files
             */
            parse: () => Q.Promise<any>;
        }
        interface AppInfoContract {
            /**
             * The name of app package, typically the filename of the app package
             */
            appName: string;
            /**
             * The total size of the app package
             */
            appSize: string;
            /**
             * Upload category tag provided by extension.
             */
            appVersion: string;
            /**
             * The device platform for the package
             */
            appPlatformDescription: string;
            /**
             * Is the app package MAM enabled
             */
            mamEnabledDescription: string;
            /**
             * Error messages to indicate the runtime errors.
             */
            errorMessage?: string;
        }
        /**
         * Options to initialize the file upload view model.
         */
        interface Options extends Base.Options.Options<string> {
            /**
             * A comma-separated list of allowed file extensions.
             * This is upload control specific validations that will validate if the selected file is in the allowed file extension list.
             * If the selected file is not in the extension list, a validation error will be flagged and the selected file will be marked as invalid.
             * Eg: "pfx,cer"
             */
            allowedFileExtensions?: string | KnockoutObservableBase<string>;
            /**
             * The maximum number of files allowed to be uploaded at once.
             * This limit is applied post-selection.
             */
            maxFiles?: number;
            /**
             * The upload context options around how/where to upload and size limits.
             */
            uploadContext?: KnockoutObservableBase<FxFileUpload.UploadContext>;
        }
        /**
         * IntuneApp file upload ViewModel.
         */
        class ViewModel extends Base.Options.ViewModel<string> {
            /**
             * A comma-separated list of allowed app file extensions.
             * This is upload control specific validations that will validate if the selected app package file is in the allowed file extension list.
             * If the selected file is not in the extension list, a validation error will be flagged and the selected file will be marked as invalid.
             * Eg: "ipa,apk,appx"
             */
            allowedFileExtensions: string | KnockoutObservableBase<string>;
            /**
             * The maximum number of files allowed to be uploaded at once.
             * This limit is applied post-selection.
             */
            maxFiles: number;
            /**
             * The upload context options around how/where to upload and size limits.
             */
            uploadContext: KnockoutObservableBase<FxFileUpload.UploadContext>;
            /**
             * Each time user clicks on the browse dialog, user can choose one or multiple files and each selected file is represented as SelectedFile on the extension iframe.
             * The selected files are surfaced in the selectedFiles array.
             * The array will be cleared if user chooses to click browse dialog to pick a different set of files.
             * Setting the value property null or calling resetUploadTasks() will clear the array.
             */
            selectedFiles: KnockoutReadOnlyObservableArray<FxFileUpload.SelectedFileContract>;
            /**
             * Observable array holds all the app upload tasks. Each task represents the file details, status, and upload progress, etc.
             * UploadTask is used to initiate the file upload, pause/resume uploads, cancel and dispose the upload.
             */
            uploadTasks: KnockoutReadOnlyObservableArray<FxFileUpload.AsyncUploadTaskContract>;
            /**
             * The app information available to the UI
             */
            appInfo: KnockoutObservableBase<AppInfoContract>;
            /**
             * The app metadata read from the application package file (App version, platform, MinOS, etc.)
             */
            appMetadata: KnockoutObservableBase<AppMetadataContract>;
            /**
             * Callback to handle upload management operations. The callback is populated by the upload widget which will then delegate the needed action to the global upload manager.
             */
            _msPortalFxUploadActionCallback: KnockoutObservableBase<FxFileUpload.UploadActionCallback>;
            /**
             * Constructs a standalone instance of a TextBox form field.
             *
             * @param lifetime A lifetime object that will notify when the data is no longer being used by the caller.
             * @param options Optional The set of options to configure the TextField control.
             */
            constructor(lifetime: MsPortalFx.Base.LifetimeManager, options?: Options);
            /**
             * Method to create an UploadTask associated with the selected file and populate that in the uploadTasks array.
             * File browse selections can be made any number of times. When autoAddUploadTaks is set to true, the selected files will be added automatically to the uploadTasks array.
             * If autoAddploadTasks is false, the selected file should be explicitly added to uploadTasks array by calling the addUploadTasks() method.
             * Extension authors will then be able to start the upload.
             *
             * @param selectedFiles User selected files to add to uploadTasks array to prepare for the file upload.
             */
            addUploadTasks(selectedFiles: FxFileUpload.SelectedFile[]): FxPromise;
            /**
             * Method to reset the uploadTasks array. This method will use the widget callback to intialize the uploadTasks array with empty array.
             * Calling this method will not dispose(abort) the uploads.
             * Uploads which have already started will continue upload in the background.
             * Uploads which have not been started will be cleaned up.
             * Invoking this method will clear the uploadTasks array, selectedFiles array and the value property.
             */
            resetUploadTasks(): FxPromise;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\ArrayBaseNavigator.d.ts
declare module "Fx/Internal/Data/ArrayBaseNavigator" {
    export = ArrayBaseNavigator;
    import SortProjection = require("Fx/Internal/Data/SortProjection");
    import FilterProjection = require("Fx/Internal/Data/FilterProjection");
    import ContinuationProjection = require("Fx/Internal/Data/ContinuationProjection");
    import PageProjection = require("Fx/Internal/Data/PageProjection");
    import MapProjection = require("Fx/Internal/Data/MapProjection");
    import FxcData = FxImpl.Data;
    import SortOrder = FxcData.SortOrder;
    import NavigatorOptions = FxcData.NavigatorOptions;
    import Property = FxcData.Property;
    import Navigator = FxcData.Navigator;
    import Expressions = FxcData.Expressions;
    import NavigatorItem = FxcData.NavigatorItem;
    import FxBase = MsPortalFx.Base;
    import Promises = FxBase.Promises;
    import CancelationToken = Promises.CancelationToken;
    import DisposableLifetimeManager = FxBase.DisposableLifetimeManager;
    class ArrayBaseNavigator<T, TData, TId> implements Navigator<T, TData, TId> {
        properties: Property[];
        allowedFilterExpressions: Expressions.AllowedExpressions;
        searchText: KnockoutObservable<string>;
        filterExpression: KnockoutObservable<Expressions.Expression>;
        sortOrder: KnockoutObservableArray<SortOrder>;
        selectedProperties: KnockoutObservableArray<Property>;
        filter: (data: TData) => boolean;
        search: (searchText: string, data: TData) => boolean;
        compare: (sortOrder: SortOrder[], value: TData, compareTo: TData) => number;
        protected _items: KnockoutObservableArray<NavigatorItem<T, TId>>;
        protected _totalItems: KnockoutObservable<number>;
        protected _startIndex: KnockoutObservable<number>;
        protected _pageSize: KnockoutObservable<number>;
        protected _canLoadMore: KnockoutObservable<boolean>;
        protected _autoRefresh: boolean;
        protected _projectionLifetime: DisposableLifetimeManager;
        protected _filtered: KnockoutObservableArray<TData>;
        protected _filterProjection: FilterProjection<TData>;
        protected _sorted: KnockoutObservableArray<TData>;
        protected _sortProjection: SortProjection<TData>;
        protected _continued: KnockoutObservableArray<TData>;
        protected _continuationProjection: ContinuationProjection<TData>;
        protected _paged: KnockoutObservableArray<TData>;
        protected _pageProjection: PageProjection<TData>;
        protected _mapProjection: MapProjection<TData, NavigatorItem<T, TId>>;
        private _sourceItems;
        private _deferredInitialize;
        private _initialQueryParams;
        private _inputParamsPromise;
        private _filterExpressionFunc;
        private _searchFunc;
        private _lifetime;
        private _currentRequest;
        private _getId;
        private _getModel;
        /**
         * Constructs and datasource for an observable array.
         */
        constructor(options: ArrayBaseNavigator.Options<T, TData, TId>);
        initialized: FxBase.Promise;
        sourceItems: KnockoutObservableArray<TData>;
        private _initialize(queryParams?);
        private _setProjections();
        protected _setFilterProjection(): void;
        protected _setSortProjection(): void;
        protected _setContinuationProjection(): void;
        protected _setPageProjection(): void;
        protected _setMapProjection(): void;
        /**
            * Throws an error.
            */
        protected _throw(message: string): void;
        /**
            * Validates that start and count are within the array bounds.
            */
        protected _validateBounds(skip: number, take: number, total?: number): void;
        private _compareData(itemA, itemB);
        /**
            * Filters the array acorrding to the specified search or filtering properties.
            */
        private _filterFunc(data);
        protected _createItems(dataItems: TData[], models?: T[]): NavigatorItem<T, TId>[];
        /**
            * Maps the array
            */
        protected _map(dataItems: TData[]): NavigatorItem<T, TId>[];
        private _updateItems(items, models);
        protected _queryParamsChanged(): void;
        /**
            * Loads a single page into the _items collection for display.
            */
        protected _load(token: CancelationToken, skip?: number, take?: number, last?: number): FxBase.Promise;
        protected _refresh(token: CancelationToken): FxBase.Promise;
        /**
            * Appends a page into the _items collection for display.
            */
        protected _loadMore(token: CancelationToken, take: number): FxBase.Promise;
        /**
            * Begins a new request and returns the cancelation token for it.
            * If there is an existing request it will be canceled.
            *
            * @return The request cancelation token.
            */
        protected _beginRequest(): CancelationToken;
        /**
            * Marks a request as completed.
            * This prevents the next _beginRequest from attempting to cancel it.
            *
            * @param cancelationToken The request cancelation token from _beginRequest.
            */
        protected _endRequest(cancelationToken: CancelationToken): void;
    }
    module ArrayBaseNavigator {
        interface Options<T, TData, TId> extends NavigatorOptions<T, TData, TId> {
            sourceItems?: KnockoutObservableArray<TData> | TData[];
            properties?: Property[];
            getId?: (data: TData) => TId;
            getModel?: (data: TData[]) => T[] | FxBase.PromiseV<T[]>;
            filter?: (item: TData) => boolean;
            search?: (searchText: string, item: TData) => boolean;
            compare?: (sortOrder: SortOrder[], value: TData, compareTo: TData) => number;
            autoRefresh?: boolean;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\ArrayDemandLoadNavigator.d.ts
declare module "Fx/Internal/Data/ArrayDemandLoadNavigator" {
    export = ArrayDemandLoadNavigator;
    import ArrayBaseNavigator = require("Fx/Internal/Data/ArrayBaseNavigator");
    import FxcData = FxImpl.Data;
    import NavigatorItem = FxcData.NavigatorItem;
    import PagedDemandLoadNavigator = FxcData.PagedDemandLoadNavigator;
    import DemandLoadNavigatorOptions = FxcData.DemandLoadNavigatorOptions;
    import FxBase = MsPortalFx.Base;
    import FxPromise = FxBase.Promise;
    class ArrayDemandLoadNavigator<T, TData, TId> extends ArrayBaseNavigator<T, TData, TId> implements PagedDemandLoadNavigator<T, TData, TId> {
        items: KnockoutReadOnlyObservableArray<NavigatorItem<T, TId>>;
        totalItems: KnockoutReadOnlyObservableBase<number>;
        pageSize: KnockoutReadOnlyObservableBase<number>;
        startIndex: KnockoutReadOnlyObservableBase<number>;
        canLoadMore: KnockoutReadOnlyObservableBase<boolean>;
        protected _defaultTake: number;
        constructor(options: ArrayDemandLoadNavigator.Options<T, TData, TId>);
        protected _setContinuationProjection(): void;
        protected _setPageProjection(): void;
        private _loadMoreRequest;
        loadMore(take?: number): FxPromise;
        refresh(): FxPromise;
        loadPage(skip: number, take: number): FxPromise;
    }
    module ArrayDemandLoadNavigator {
        interface Options<T, TData, TId> extends DemandLoadNavigatorOptions<T, TData, TId>, ArrayBaseNavigator.Options<T, TData, TId> {
            getId: (data: TData) => TId;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\ArrayListNavigator.d.ts
declare module "Fx/Internal/Data/ArrayListNavigator" {
    export = ArrayListNavigator;
    import ArrayBaseNavigator = require("Fx/Internal/Data/ArrayBaseNavigator");
    import FxcData = FxImpl.Data;
    import NavigatorItem = FxcData.NavigatorItem;
    import ListNavigatorOptions = FxcData.ListNavigatorOptions;
    import PagedListNavigator = FxcData.PagedListNavigator;
    class ArrayListNavigator<T, TData, TId> extends ArrayBaseNavigator<T, TData, TId> implements PagedListNavigator<T, TData, TId> {
        items: KnockoutReadOnlyObservableArray<NavigatorItem<T, TId>>;
        totalItems: KnockoutReadOnlyObservableBase<number>;
        startIndex: KnockoutReadOnlyObservable<number>;
        pageSize: KnockoutReadOnlyObservable<number>;
        canLoadMore: KnockoutReadOnlyObservable<boolean>;
        constructor(options: ArrayListNavigator.Options<T, TData, TId>);
        refresh(): MsPortalFx.Base.Promise;
        loadAll(): MsPortalFx.Base.Promise;
        loadPage(skip: number, take: number): MsPortalFx.Base.Promise;
    }
    module ArrayListNavigator {
        interface Options<T, TData, TId> extends ListNavigatorOptions<T, TData, TId>, ArrayBaseNavigator.Options<T, TData, TId> {
            getId: (data: TData) => TId;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\BaseProjection.d.ts
declare module "Fx/Internal/Data/BaseProjection" {
    export = BaseProjection;
    import FxBase = MsPortalFx.Base;
    import LifetimeManager = FxBase.LifetimeManager;
    abstract class BaseProjection<TSource, TDest> {
        /**
         * The destination array for the projection.
         */
        destination: KnockoutObservableArray<TDest>;
        protected _lifetime: LifetimeManager;
        protected _source: KnockoutReadOnlyObservableArray<TSource> | KnockoutProjectableComputedArray<TSource>;
        protected _autoRefresh: boolean;
        protected _internalEdit: boolean;
        constructor(options: BaseProjection.Options<TSource, TDest>);
        /**
         * Refreshes the destination by re-calculating from the source.
         */
        abstract refresh(): void;
        /**
         * Transforms source edits into destination edits and applies them to the destination.
         *
         * @param sourceEdits The edits that just occured to the source.
         */
        protected abstract _update(sourceEdits: KnockoutArrayEdit<TSource>[]): void;
        /**
         * Replaces the destination array.
         *
         * @param destinationArray The new array.
         */
        protected _replace(destinationArray: TDest[]): void;
        /**
         * Applies edits to the destination array.
         *
         * @param destinationEdits Array edits to apply.
         */
        protected _apply(destinationEdits: KnockoutArrayEdit<TDest>[]): void;
    }
    module BaseProjection {
        interface Options<TSource, TDest> {
            lifetime: LifetimeManager;
            source: KnockoutReadOnlyObservableArray<TSource> | KnockoutProjectableComputedArray<TSource>;
            destination?: KnockoutObservableArray<TDest>;
            autoRefresh?: boolean;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\ClientFilters.d.ts
declare module "Fx/Internal/Data/ClientFilters" {
    export = ClientFilters;
    import FxcData = FxImpl.Data;
    import Expressions = FxcData.Expressions;
    module ClientFilters {
        /**
         * Accessor provided to filter function to get a value by identity.
         */
        interface ValueAccessor {
            (name: string): any;
        }
        /**
         * Filter function.
         */
        interface Filter {
            (getValue: ValueAccessor): boolean;
        }
        /**
         * Creates a filter function from an expression tree.
         *
         * @param filterExpression The expression tree to convert into a function.
         * @param allowedFilterExpressions Dictionary of allowed expression types for the filter function.
         * @return A javascript filter function.
         */
        function CreateFilter(filterExpression: Expressions.Expression, allowedFilterExpressions: StringMap<boolean>): Filter;
        /**
         * Adds all expressions supported for client filters to an allowed expressions map and returns it.
         *
         * @param allowedExpressions An existing allowed expressions map to add the entries to.
         * @return The allowed expressions map.
         */
        function allowedExpressions(allowedExpressions?: Expressions.AllowedExpressions): Expressions.AllowedExpressions;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\ContinuationProjection.d.ts
declare module "Fx/Internal/Data/ContinuationProjection" {
    export = ContinuationProjection;
    import BaseProjection = require("Fx/Internal/Data/BaseProjection");
    class ContinuationProjection<T> extends BaseProjection<T, T> {
        canLoadMore: KnockoutObservable<boolean>;
        totalCount: KnockoutObservable<number>;
        private _maxIndex;
        constructor(options: ContinuationProjection.Options<T>);
        refresh(): void;
        reset(): void;
        loadMore(count: number): void;
        private _load();
        protected _update(sourceEdits: KnockoutArrayEdit<T>[]): void;
    }
    module ContinuationProjection {
        interface Options<T> extends BaseProjection.Options<T, T> {
            canLoadMore?: KnockoutObservable<boolean>;
            totalCount?: KnockoutObservable<number>;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\Expressions.d.ts
declare module "Fx/Internal/Data/Expressions" {
    export = ExpressionsModule;
    module ExpressionsModule {
        import Expressions = FxImpl.Data.Expressions;
        import Expression = Expressions.Expression;
        import EqualsExpression = Expressions.EqualsExpression;
        import NotEqualsExpression = Expressions.NotEqualsExpression;
        import GreaterThanExpression = Expressions.GreaterThanExpression;
        import GreaterThanOrEqualsExpression = Expressions.GreaterThanOrEqualsExpression;
        import LessThanExpression = Expressions.LessThanExpression;
        import LessThanOrEqualsExpression = Expressions.LessThanOrEqualsExpression;
        function Equals(left: Expression, right: Expression): EqualsExpression;
        function NotEquals(left: Expression, right: Expression): NotEqualsExpression;
        function GreaterThan(left: Expression, right: Expression): GreaterThanExpression;
        function GreaterThanOrEqual(left: Expression, right: Expression): GreaterThanOrEqualsExpression;
        function LessThan(left: Expression, right: Expression): LessThanExpression;
        function LessThanOrEqual(left: Expression, right: Expression): LessThanOrEqualsExpression;
        import AndExpression = Expressions.AndExpression;
        import OrExpression = Expressions.OrExpression;
        import NotExpression = Expressions.NotExpression;
        function And(...expressions: Expression[]): AndExpression;
        function Or(...expressions: Expression[]): OrExpression;
        function Not(expression: Expression): NotExpression;
        import AddExpression = Expressions.AddExpression;
        import SubtractExpression = Expressions.SubtractExpression;
        import MultiplyExpression = Expressions.MultiplyExpression;
        import DivideExpression = Expressions.DivideExpression;
        import ModuloExpression = Expressions.ModuloExpression;
        import NegateExpression = Expressions.NegateExpression;
        function Add(...expressions: Expression[]): AddExpression;
        function Subtract(...expressions: Expression[]): SubtractExpression;
        function Multiply(...expressions: Expression[]): MultiplyExpression;
        function Divide(...expressions: Expression[]): DivideExpression;
        function Modulo(...expressions: Expression[]): ModuloExpression;
        function Negate(expression: Expression): NegateExpression;
        import GroupExpression = Expressions.GroupExpression;
        function Group(expression: Expression): GroupExpression;
        import BooleanExpression = Expressions.BooleanExpression;
        import GuidExpression = Expressions.GuidExpression;
        import DecimalExpression = Expressions.DecimalExpression;
        import DoubleExpression = Expressions.DoubleExpression;
        import IntegerExpression = Expressions.IntegerExpression;
        import StringExpression = Expressions.StringExpression;
        import NullExpression = Expressions.NullExpression;
        function Boolean(value: boolean): BooleanExpression;
        function Guid(value: string): GuidExpression;
        function Decimal(value: string): DecimalExpression;
        function Double(value: number): DoubleExpression;
        function Integer(value: number): IntegerExpression;
        function String(value: string): StringExpression;
        function Null(): NullExpression;
        function Identifier(name: string): {
            type: string;
            name: string;
        };
        import RoundExpression = Expressions.RoundExpression;
        import FloorExpression = Expressions.FloorExpression;
        import CeilingExpression = Expressions.CeilingExpression;
        function Round(expression: Expression): RoundExpression;
        function Floor(expression: Expression): FloorExpression;
        function Ceiling(expression: Expression): CeilingExpression;
        import StartsWithExpression = Expressions.StartsWithExpression;
        import EndsWithExpression = Expressions.EndsWithExpression;
        import ContainsExpression = Expressions.ContainsExpression;
        function StartsWith(expression: Expression, start: Expression): StartsWithExpression;
        function EndsWith(expression: Expression, end: Expression): EndsWithExpression;
        function Contains(expression: Expression, value: Expression): ContainsExpression;
        import TrimExpression = Expressions.TrimExpression;
        import ToUpperExpression = Expressions.ToUpperExpression;
        import ToLowerExpression = Expressions.ToLowerExpression;
        import IndexOfExpression = Expressions.IndexOfExpression;
        import SubStringExpression = Expressions.SubStringExpression;
        import ConcatExpression = Expressions.ConcatExpression;
        function Trim(expression: Expression): TrimExpression;
        function ToUpper(expression: Expression): ToUpperExpression;
        function ToLower(expression: Expression): ToLowerExpression;
        function IndexOf(expression: Expression, value: Expression): IndexOfExpression;
        function SubString(expression: Expression, start: Expression, count?: Expression): SubStringExpression;
        function Concat(expression: Expression, value: Expression): ConcatExpression;
        import MonthExpression = Expressions.MonthExpression;
        import YearExpression = Expressions.YearExpression;
        import DayExpression = Expressions.DayExpression;
        import HourExpression = Expressions.HourExpression;
        import MinuteExpression = Expressions.MinuteExpression;
        import SecondExpression = Expressions.SecondExpression;
        import NowExpression = Expressions.NowExpression;
        function Month(expression: Expression): MonthExpression;
        function Year(expression: Expression): YearExpression;
        function Day(expression: Expression): DayExpression;
        function Hour(expression: Expression): HourExpression;
        function Minute(expression: Expression): MinuteExpression;
        function Second(expression: Expression): SecondExpression;
        function Now(): NowExpression;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\FilterProjection.d.ts
declare module "Fx/Internal/Data/FilterProjection" {
    export = FilterProjection;
    import BaseProjection = require("Fx/Internal/Data/BaseProjection");
    class FilterProjection<T> extends BaseProjection<T, T> {
        private _filter;
        private _states;
        private _damageIndex;
        private _damageOffset;
        constructor(options: FilterProjection.Options<T>);
        refresh(): void;
        private _repairTo(stateIndex);
        private _addState(stateIndex, filtered);
        private _deleteState(stateIndex);
        protected _update(sourceEdits: KnockoutArrayEdit<T>[]): void;
    }
    module FilterProjection {
        interface Options<T> extends BaseProjection.Options<T, T> {
            filter: (item: T) => boolean;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\LifetimeMapProjection.d.ts
declare module "Fx/Internal/Data/LifetimeMapProjection" {
    export = LifetimeMapProjection;
    import BaseProjection = require("Fx/Internal/Data/BaseProjection");
    /**
     * Maps the array into the destination array.
     *
     */
    class LifetimeMapProjection<T, U> extends BaseProjection<T, U> {
        private _mapping;
        private _states;
        constructor(options: LifetimeMapProjection.Options<T, U>);
        private _mapState(value);
        refresh(): void;
        protected _update(sourceEdits: KnockoutArrayEdit<T>[]): void;
    }
    module LifetimeMapProjection {
        interface Options<T, U> extends BaseProjection.Options<T, U> {
            mapping: (itemLifetime: MsPortalFx.Base.LifetimeManager, item: T) => U;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\MapProjection.d.ts
declare module "Fx/Internal/Data/MapProjection" {
    export = MapProjection;
    import BaseProjection = require("Fx/Internal/Data/BaseProjection");
    /**
     * Maps the array into the destination array.
     */
    class MapProjection<T, U> extends BaseProjection<T, U> {
        private _mapping;
        constructor(options: MapProjection.Options<T, U>);
        refresh(): void;
        protected _update(sourceEdits: KnockoutArrayEdit<T>[]): void;
    }
    module MapProjection {
        interface Options<T, U> extends BaseProjection.Options<T, U> {
            mapping: (item: T[]) => U[];
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\OData.d.ts
declare module "Fx/Internal/Data/OData" {
    export = OData;
    import FxcData = FxImpl.Data;
    import Expressions = FxcData.Expressions;
    import QueryParams = FxcData.QueryParams;
    import FxData = MsPortalFx.Data;
    module OData {
        /**
         * Serializes query parameters to OData v4 format.
         *
         * @param params The query parameters.
         * @return The query string.
         */
        function serializeODataQueryParams(params: QueryParams): string;
        /**
         * Adds all expressions supported for odata v4 filters to an allowed expressions map and returns it.
         *
         * @param allowedExpressions An existing allowed expressions map to add the entries to.
         * @return The allowed expressions map.
         */
        function allowedExpressions(allowedExpressions?: Expressions.AllowedExpressions): Expressions.AllowedExpressions;
        function processServerResponse(response: any): FxData.DataCacheProcessedResponse;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\PageMapProjection.d.ts
declare module "Fx/Internal/Data/PageMapProjection" {
    export = PageMapProjection;
    import BaseProjection = require("Fx/Internal/Data/BaseProjection");
    /**
     * Maps a page of the source array into the destination array.
     */
    class PageMapProjection<T, U> extends BaseProjection<T, U> {
        /**
         * The last requested page size.
         */
        pageSize: KnockoutObservable<number>;
        /**
         * The start index of the current page.
         */
        startIndex: KnockoutObservable<number>;
        /**
         * The total number of items available to be paged.
         */
        totalCount: KnockoutObservable<number>;
        private _requestedStartIndex;
        private _requestedPageSize;
        private _mapping;
        private _states;
        private _loaded;
        /**
         * Constructs a page map projection that maps a page of the source array into the destination array.
         *
         * @param options Options for constructing the projection.
         */
        constructor(options: PageMapProjection.Options<T, U>);
        /**
         * Refreshes the current page from the source items.
         */
        refresh(): void;
        /**
         * Loads mapped objects of everything in the source array into the destination page array.
         */
        loadAll(): void;
        /**
         * Loads mapped objects of the requested page from the source array into the destination page array.
         */
        loadPage(startIndex: number, pageSize: number): void;
        /**
         * Updates the current page when the source array changes.
         *
         * @param sourceEdits The changes to the source array.
         */
        protected _update(sourceEdits: KnockoutArrayEdit<T>[]): void;
        private _load(startIndex?, pageSize?);
        private _makeState(value);
        private _createStates();
        private _mapStates(start, end);
    }
    module PageMapProjection {
        /**
         * Options for construction a PageMapProjection.
         */
        interface Options<T, U> extends BaseProjection.Options<T, U> {
            /**
             * The page start index observable that will be updated on page changes.
             */
            startIndex?: KnockoutObservable<number>;
            /**
             * The page size observable that will be updated on page changes.
             */
            pageSize?: KnockoutObservable<number>;
            /**
             * The total count observable that will be updated on page changes.
             */
            totalCount?: KnockoutObservable<number>;
            /**
             * The mapping function to create destination items for the current page.
             */
            mapping: (item: T[]) => U[];
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\PageProjection.d.ts
declare module "Fx/Internal/Data/PageProjection" {
    export = PageProjection;
    import BaseProjection = require("Fx/Internal/Data/BaseProjection");
    class PageProjection<T> extends BaseProjection<T, T> {
        pageSize: KnockoutObservable<number>;
        startIndex: KnockoutObservable<number>;
        totalCount: KnockoutObservable<number>;
        private _requestedStartIndex;
        private _requestedPageSize;
        private _loaded;
        constructor(options: PageProjection.Options<T>);
        refresh(): void;
        loadAll(): void;
        loadPage(startIndex: number, pageSize: number): void;
        private _load(startIndex?, pageSize?);
        protected _update(sourceEdits: KnockoutArrayEdit<T>[]): void;
    }
    module PageProjection {
        interface Options<T> extends BaseProjection.Options<T, T> {
            startIndex?: KnockoutObservable<number>;
            pageSize?: KnockoutObservable<number>;
            totalCount?: KnockoutObservable<number>;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\QueryBaseNavigator.d.ts
declare module "Fx/Internal/Data/QueryBaseNavigator" {
    export = QueryBaseNavigator;
    import FxcData = FxImpl.Data;
    import SortOrder = FxcData.SortOrder;
    import NavigatorOptions = FxcData.NavigatorOptions;
    import Property = FxcData.Property;
    import Expressions = FxcData.Expressions;
    import NavigatorItem = FxcData.NavigatorItem;
    import QueryParams = FxcData.QueryParams;
    import FxData = MsPortalFx.Data;
    import FxBase = MsPortalFx.Base;
    import FxPromise = FxBase.Promise;
    import FxPromiseV = FxBase.PromiseV;
    import Promises = FxBase.Promises;
    import CancelationToken = Promises.CancelationToken;
    class QueryBaseNavigator<T, TData, TId, TParams> {
        protected _items: KnockoutObservableArray<NavigatorItem<T, TId>>;
        /**
         * The exposed properties supported by the items in the data cache.
         */
        properties: Property[];
        /**
         * The allowed operation for this data source.
         */
        allowedFilterExpressions: Expressions.AllowedExpressions;
        /**
         * The requested search terms.
         */
        searchText: KnockoutObservable<string>;
        /**
         * The filter expression.
         */
        filterExpression: KnockoutObservable<Expressions.Expression>;
        /**
         * The columns to sort by.
         */
        sortOrder: KnockoutObservableArray<SortOrder>;
        /**
         * The columns to select for values in the data row.
         */
        selectedProperties: KnockoutObservableArray<Property>;
        private _params;
        private _initialized;
        private _currentRequest;
        /**
         * The method for extracting the id from the data item.
         */
        private _getId;
        private _getModel;
        protected _getParams: (navigatorParams: QueryParams, params: TParams) => TParams;
        protected _queryCache: FxData.QueryCache<TData, TParams>;
        protected _lifetimeManager: FxBase.DisposableLifetimeManager;
        constructor(options: QueryBaseNavigator.Options<T, TData, TId, TParams>);
        /**
         * Disposes resources.
         */
        dispose(): void;
        initialized: FxPromise;
        params: KnockoutObservable<TParams>;
        /**
         * The query cache.
         */
        queryCache: FxData.QueryCache<TData, QueryParams>;
        protected _throw(message: string): void;
        /**
         * Validates that skip and take are within the array bounds.
         */
        protected _validateBounds(skip: number, take: number): void;
        /**
         * Validates the take count.
         */
        protected _validateCount(take: number): void;
        /**
         * Validates data source state.
         */
        protected _validateState(): void;
        protected _createItems(dataItems: TData[], models?: T[]): NavigatorItem<T, TId>[];
        /**
         * Maps the array
         */
        protected _map(dataItems: TData[]): NavigatorItem<T, TId>[];
        private _updateItems(items, models);
        /**
         * Begins a new request and returns the cancelation token for it.
         * If there is an existing request it will be canceled.
         *
         * @return The request cancelation token.
         */
        protected _beginRequest(): CancelationToken;
        /**
         * Marks a request as completed.
         * This prevents the next _beginRequest from attempting to cancel it.
         *
         * @param cancelationToken The request cancelation token from _beginRequest.
         */
        protected _endRequest(cancelationToken: CancelationToken): void;
    }
    module QueryBaseNavigator {
        interface Options<T, TData, TId, TParams> extends NavigatorOptions<T, TData, TId> {
            /**
             * The lifetime manager for the data navigator.
             */
            lifetimeManager?: FxBase.LifetimeManager;
            /**
             * The query cache for retrieving data.
             */
            queryCache?: FxData.QueryCache<TData, TParams>;
            getParams?: (navigatorParams: QueryParams, params: TParams) => TParams;
            /**
             * The method for obtaining the id.
             */
            getId?: (data: TData) => TId;
            getModel?: (data: TData[]) => T[] | FxPromiseV<T[]>;
            /**
             * The available columns of the data.
             */
            properties?: Property[];
            /**
             * Filters that are allowed on the instance of the data source.
             */
            allowedFilterExpressions?: Expressions.AllowedExpressions;
            /**
             * Handler for adding extended properties to the data row.
             */
            initialized?: FxPromise;
            params?: TParams | KnockoutObservable<TParams>;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\QueryDemandLoadNavigator.d.ts
declare module "Fx/Internal/Data/QueryDemandLoadNavigator" {
    export = QueryDemandLoadNavigator;
    import QueryBaseNavigator = require("Fx/Internal/Data/QueryBaseNavigator");
    import FxcData = FxImpl.Data;
    import NavigatorItem = FxcData.NavigatorItem;
    import DemandLoadNavigatorOptions = FxcData.DemandLoadNavigatorOptions;
    import PagedDemandLoadNavigator = FxcData.PagedDemandLoadNavigator;
    import FxData = MsPortalFx.Data;
    import FxBase = MsPortalFx.Base;
    class QueryDemandLoadNavigator<T, TData, TId, TParams> extends QueryBaseNavigator<T, TData, TId, TParams> implements PagedDemandLoadNavigator<T, TData, TId> {
        items: KnockoutReadOnlyObservableArray<NavigatorItem<T, TId>>;
        canLoadMore: KnockoutReadOnlyObservableBase<boolean>;
        totalItems: KnockoutReadOnlyObservableBase<number>;
        startIndex: KnockoutReadOnlyObservableBase<number>;
        pageSize: KnockoutReadOnlyObservableBase<number>;
        protected _canLoadMore: KnockoutObservable<boolean>;
        protected _totalItems: KnockoutObservable<number>;
        protected _startIndex: KnockoutObservable<number>;
        protected _pageSize: KnockoutObservable<number>;
        protected _excludeData: (item: TData) => boolean;
        private _pendingItems;
        private _pendingCanLoadMore;
        private _continuationToken;
        protected _loadedItems: KnockoutObservableArray<TData>;
        private _projectionLifetime;
        private _pageMapProjection;
        private _view;
        private _takeExtra;
        private _refreshing;
        constructor(options: QueryDemandLoadNavigator.Options<T, TData, TId, TParams>);
        private _disposeProjections();
        private _setProjections();
        private _loadMoreRequest;
        /**
         * Gets more rows when using continuation based access.
         */
        loadMore(take?: number): FxBase.Promise;
        private _lastLoadByContinuationRequest;
        /**
         * Requests rows by continuation until count has been returned or the end of the data.
         */
        private _loadByContinuation(cancelationToken, last, takeExtra?, force?);
        private _loadByContinuationRecursive(cancelationToken, last, takeExtra?, force?);
        /**
         * Refreshes the navigator
         *
         * @param force if set to true, the navigator will also refresh the query view.
         */
        refresh(force?: boolean): FxBase.Promise;
        loadPage(skip: number, take: number): FxBase.Promise;
        /**
         * Removes items from the current view using the excludeData function.
         */
        protected _removeExcludedItems(): void;
    }
    module QueryDemandLoadNavigator {
        interface Options<T, TData, TId, TParams> extends DemandLoadNavigatorOptions<T, TData, TId>, QueryBaseNavigator.Options<T, TData, TId, TParams> {
            /**
             * The lifetime manager for the data navigator.
             */
            lifetimeManager: FxBase.LifetimeManager;
            /**
             * The query cache for retrieving data.
             */
            queryCache: FxData.QueryCache<TData, TParams>;
            /**
             * The method for obtaining the id.
             */
            getId: (data: TData) => TId;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\QueryListNavigator.d.ts
declare module "Fx/Internal/Data/QueryListNavigator" {
    export = QueryListNavigator;
    import MapProjection = require("Fx/Internal/Data/MapProjection");
    import QueryBaseNavigator = require("Fx/Internal/Data/QueryBaseNavigator");
    import FxcData = FxImpl.Data;
    import NavigatorItem = FxcData.NavigatorItem;
    import ListNavigatorOptions = FxcData.ListNavigatorOptions;
    import PagedListNavigator = FxcData.PagedListNavigator;
    import FxData = MsPortalFx.Data;
    import FxBase = MsPortalFx.Base;
    import DisposableLifetimeManager = FxBase.DisposableLifetimeManager;
    class QueryListNavigator<T, TData, TId, TParams> extends QueryBaseNavigator<T, TData, TId, TParams> implements PagedListNavigator<T, TData, TId> {
        items: KnockoutReadOnlyObservableArray<NavigatorItem<T, TId>>;
        totalItems: KnockoutReadOnlyObservableBase<number>;
        startIndex: KnockoutReadOnlyObservableBase<number>;
        pageSize: KnockoutReadOnlyObservableBase<number>;
        canLoadMore: KnockoutReadOnlyObservableBase<boolean>;
        protected _totalItems: KnockoutObservable<number>;
        protected _startIndex: KnockoutObservable<number>;
        protected _pageSize: KnockoutObservable<number>;
        protected _canLoadMore: KnockoutObservable<boolean>;
        protected _projectionLifetime: DisposableLifetimeManager;
        protected _mapProjection: MapProjection<TData, NavigatorItem<T, TId>>;
        private _view;
        /**
         * Constructs and datasource for an observable array.
         *
         * @param options Option for constructing the data source.
         */
        constructor(options: QueryListNavigator.Options<T, TData, TId, TParams>);
        /**
         * Resets the data source.
         */
        refresh(): FxBase.Promise;
        /**
         * Gets a span of rows.
         */
        loadAll(): FxBase.Promise;
        /**
         * Gets a span of rows.
         */
        loadPage(skip: number, take: number): FxBase.Promise;
        private _setProjections(dataItems);
    }
    module QueryListNavigator {
        interface Options<T, TData, TId, TParams> extends ListNavigatorOptions<T, TData, TId>, QueryBaseNavigator.Options<T, TData, TId, TParams> {
            /**
             * The lifetime manager for the data navigator.
             */
            lifetimeManager: FxBase.LifetimeManager;
            /**
             * The query cache for retrieving data.
             */
            queryCache: FxData.QueryCache<TData, TParams>;
            /**
             * The method for obtaining the id.
             */
            getId: (data: TData) => TId;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Data\SortProjection.d.ts
declare module "Fx/Internal/Data/SortProjection" {
    export = SortProjection;
    import BaseProjection = require("Fx/Internal/Data/BaseProjection");
    class SortProjection<T> extends BaseProjection<T, T> {
        private _compare;
        constructor(options: SortProjection.Options<T>);
        refresh(): void;
        protected _update(sourceEdits: KnockoutArrayEdit<T>[]): void;
    }
    module SortProjection {
        interface Options<T> extends BaseProjection.Options<T, T> {
            compare: (item1: T, item2: T) => number;
        }
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Internal\Utils\KnockoutArrayUtils.d.ts
declare module "Fx/Internal/Utils/KnockoutArrayUtils" {
    export = KnockoutArrayUtils;
    module KnockoutArrayUtils {
        /**
         * KnockoutArrayEdit added status.
         */
        const EditStatusAdded: string;
        /**
         * KnockoutArrayEdit deleted status.
         */
        const EditStatusDeleted: string;
        /**
         * KnockoutArrayEdit retained status.
         */
        const EditStatusRetained: string;
        /**
         * Creates edits for the target array corresponding to the edits from the source array.
         *
         * @param edits The source array edits.
         * @param target The array to target.
         * @param mapFuns Maps edit items to target array items when creating new entries for the target array.
         * @return A new set of edits for the target array.
         */
        function mapArrayEdits<T, U>(edits: KnockoutArrayEdit<T>[], target: U[], mapFunc: (value: T) => U): KnockoutArrayEdit<U>[];
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Pinner.d.ts
declare module "Fx/Pinner" {
    export = Main;
    module Main {
        import FxBase = MsPortalFx.Base;
        import FxRpc = FxBase.Rpc.Internal;
        import FxComposition = MsPortalFx.Composition;
        /**
         * Options that can be passed when calling the pin function.
         */
        interface Options {
            /**
             * The value to indicate whether to show a notification or not.
             */
            notify: boolean;
        }
        module Internal {
            /**
             * RPC endpoint to pin provided parts.
             */
            const pinEndPoint: FxRpc.FuncEndPointDefinition<PinParams, string>;
            /**
             * Options that must be passed when calling the pin function.
             */
            interface PinParams {
                /**
                 * Parts to pin to the dashboard.
                 */
                parts: FxComposition.PartReference<any>[];
                /**
                 * The value to indicate whether to show a notification or not.
                 */
                options?: Options;
            }
        }
        /**
            * Pins the specified parts to the currently opened dashboard.
            *
            * @param parts Parts to pin to the dashboard.
            * @param options Optional arguments used by the function.
            * @return A promise that resolves to completion of pinning.
            */
        function pin(parts: FxComposition.PartReference<any>[], options?: Options): FxBase.Promise;
    }
}

// FILE: E:\bt\787750\repo\src\SDK\Framework.Client\TypeScript\Fx\Specs\DropDown.d.ts
declare module "Fx/Specs/DropDown" {
    export = Main;
    module Main {
        import FxViewModels = MsPortalFx.ViewModels;
        import Specs = MsPortalFx.Azure.ResourceManager.Pickers.Specs;
        import FxForms = FxViewModels.Forms;
        import SpecPicker = HubsExtension.Azure.SpecPicker;
        /**
         * A spec picker drop down which will show promotoed features of the specs available.
         */
        module DropDown {
            /**
             * Inteface to select the pricing blade on a spec drop down
             */
            interface PricingBladeSelection extends FxViewModels.DynamicBladeSelection {
                /**
                 * An identifying string for the hotspot. Must be unique from all other hotspots
                 * on the part so that the parameter provider can hook into the collector correctly
                 * advise name spacing as well e.g. "Spec.DropDown.Foo1"
                 */
                hotspot: string;
            }
            /**
             * Options for the spec picker dropdown
             */
            interface Options extends FxForms.Base.Input.Options<string> {
                /**
                 * The Form ViewModel for the selector control.
                 */
                form: FxForms.Form.ViewModel<any>;
                /**
                 * The path to the property on the Form data model being set
                 * Used instead of accessor
                 */
                accessor: FxForms.EditScopeAccessors<Specs.Result>;
                /**
                 * The spec picker extender viewmodel which will be used to display specs to be picked
                 */
                specPickerExtender: SpecPicker.SpecPickerExtender;
                /**
                 * A callback that supplies initial data for the parameter provider
                 * in the child blade each time it opens.
                 *
                 * Note that the object received by the parameter provider will be a
                 * deep clone of the value you give, rather than the original instance,
                 * because it is passed (and sometimes stored) in a serialized form.
                 *
                 * @return Initial data for the child blade.
                 */
                initialData: KnockoutObservableBase<Specs.InitialData>;
                /**
                 * The pricing blade to open
                 */
                pricingBlade?: PricingBladeSelection;
            }
            /**
             * This is a section which has on it a selectable on it.
             * This is to keep a consistent api with the spec selector
             * and infobox with the control having a selectable
             */
            interface SelectableSection extends FxForms.Section.ViewModel {
                /**
                 * The selectable on the section control to be bound to
                 * in the pdl
                 */
                selectable?: FxViewModels.Selectable<any>;
            }
        }
        /**
         * DropDown which creates a collector and selector that launches a spec picker blade
         */
        class DropDown {
            /**
             * ParameterCollector created to interface with the spec picker blade ParameterProvider
             */
            collector: FxViewModels.ParameterCollector<SpecPicker.ParameterCollectionV3.SpecPickerProviderCollectorParameter>;
            /**
             * The info box control.
             */
            control: DropDown.SelectableSection;
            /**
             * Click handler for the label
             */
            labelClick: () => void;
            /**
             * The selected spec(s).
             */
            value: KnockoutObservable<Specs.Result>;
            /**
             * Constructs a drop down for specs that can launch a specpicker blade
             *
             * @param container The container associated with the part or other composition item hosting this parameter collector.
             * @param DropDown options that extends both the colector and the BaseDropDownOptions
             */
            constructor(container: FxViewModels.ContainerContract, options: DropDown.Options);
        }
    }
}
