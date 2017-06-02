/// <reference path="../TypeReferences.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Represents the data layer for querying Subscriptions from Hubs extension.
     */
    var SubscriptionsData = (function () {
        function SubscriptionsData() {
            var _this = this;
            this.subscriptions = ko.pureComputed(function () {
                var list = _this._subscriptionList();
                return list || [];
            });
            this._subscriptionList = ko.observable();
        }
        SubscriptionsData.prototype.fetchSubscriptions = function () {
            var _this = this;
            if (!this._load) {
                this._load = MsPortalFx.Azure.getAllSubscriptions().then(function (subscriptions) {
                    _this._subscriptionList(subscriptions);
                });
            }
            return this._load;
        };
        return SubscriptionsData;
    }());
    exports.SubscriptionsData = SubscriptionsData;
});
