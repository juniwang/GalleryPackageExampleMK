declare module JWTestExtension.DataModels {
    var ResourceBaseType: string;
    interface ResourceBase {
        id: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        type: KnockoutObservable<string>;
        location: KnockoutObservable<string>;
        etag: KnockoutObservable<string>;
    }
}
declare module JWTestExtension.DataModels {
    var RootResourceType: string;
    interface RootResource {
        properties: KnockoutObservable<JWTestExtension.DataModels.RootResourceProperties>;
        id: KnockoutObservable<string>;
        name: KnockoutObservable<string>;
        type: KnockoutObservable<string>;
        location: KnockoutObservable<string>;
        etag: KnockoutObservable<string>;
    }
}
declare module JWTestExtension.DataModels {
    var RootResourcePropertiesType: string;
    interface RootResourceProperties {
        customProperty: KnockoutObservable<string>;
        provisioningState: KnockoutObservable<string>;
    }
}
