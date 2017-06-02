// <reference path="../TypeReferences.d.ts" />
import ExtensionDefinition = require("../_generated/ExtensionDefinition");
import DataModels = JWTestExtension.DataModels;
import SubscriptionsData = require("./SubscriptionsData");

var endpoint = window.fx.environment && window.fx.environment.armEndpoint && window.fx.environment.armEndpoint.replace(/\/$/, "");
/*
 * A place for shared data to be used between all Resource part view models
 */
export class DataContext {
    
    public subscriptions = new SubscriptionsData.SubscriptionsData();
    private _armVersion = "api-version=2014-04-01";

    /**
     * Provides a 'load by id' style cache for a given resource by name.
     */
    public resourceEntities = new MsPortalFx.Data.EntityCache<DataModels.RootResource, string>({
        entityTypeName: JWTestExtension.DataModels.RootResourceType,
        sourceUri: MsPortalFx.Data.uriFormatter(endpoint + "{id}?" + this._armVersion, false),
        supplyData: (httpMethod: string, uri: string, headers?: StringMap<any>, data?: any, params?: any) => {
            return MsPortalFx.Base.Net2.ajax({
                uri: uri,
                type: httpMethod || "GET",
                dataType: "json",
                traditional: true,
                headers: headers,
                contentType: "application/json",
                setAuthorizationHeader: true,
                invokeApi: "api/invoke", // for more detail see http://aka.ms/portalfx/cors
                data: data
            })
        }
    });
}
