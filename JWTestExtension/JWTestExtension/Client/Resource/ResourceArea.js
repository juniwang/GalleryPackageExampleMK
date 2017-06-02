define(["require", "exports", "./SubscriptionsData"], function (require, exports, SubscriptionsData) {
    "use strict";
    var endpoint = window.fx.environment && window.fx.environment.armEndpoint && window.fx.environment.armEndpoint.replace(/\/$/, "");
    /*
     * A place for shared data to be used between all Resource part view models
     */
    var DataContext = (function () {
        function DataContext() {
            this.subscriptions = new SubscriptionsData.SubscriptionsData();
            this._armVersion = "api-version=2014-04-01";
            /**
             * Provides a 'load by id' style cache for a given resource by name.
             */
            this.resourceEntities = new MsPortalFx.Data.EntityCache({
                entityTypeName: JWTestExtension.DataModels.RootResourceType,
                sourceUri: MsPortalFx.Data.uriFormatter(endpoint + "{id}?" + this._armVersion, false),
                supplyData: function (httpMethod, uri, headers, data, params) {
                    return MsPortalFx.Base.Net2.ajax({
                        uri: uri,
                        type: httpMethod || "GET",
                        dataType: "json",
                        traditional: true,
                        headers: headers,
                        contentType: "application/json",
                        setAuthorizationHeader: true,
                        invokeApi: "api/invoke",
                        data: data
                    });
                }
            });
        }
        return DataContext;
    }());
    exports.DataContext = DataContext;
});
