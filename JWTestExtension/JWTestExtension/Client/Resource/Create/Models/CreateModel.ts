import Azure = MsPortalFx.Azure;

interface CreateModel {
    name: KnockoutObservable<string>;
    subscription: KnockoutObservable<Azure.Subscription>;
    resourceGroup: KnockoutObservable<Azure.CreatorAndDropdDownValue<Azure.ResourceGroup>>;
    location: KnockoutObservable<Azure.Location>;
} 
export = CreateModel;