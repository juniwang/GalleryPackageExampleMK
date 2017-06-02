/// <reference path="../TypeReferences.d.ts" />

/**
 * Represents the data layer for querying Subscriptions from Hubs extension.
 */
export class SubscriptionsData {

    public subscriptions = ko.pureComputed<MsPortalFx.Azure.Subscription[]>(() => {
        var list = this._subscriptionList();
        return list || [];
    });

    private _load: MsPortalFx.Base.Promise;
    private _subscriptionList = ko.observable<MsPortalFx.Azure.Subscription[]>();

    public fetchSubscriptions(): MsPortalFx.Base.Promise {
        if (!this._load) {
            this._load = MsPortalFx.Azure.getAllSubscriptions().then((subscriptions) => {
                this._subscriptionList(subscriptions);
            });
        }

        return this._load;
    }
}