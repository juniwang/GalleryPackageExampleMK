{
  "extension": "HubsExtension",
  "version": "1.0",
  "sdkVersion": "5.0.302.607 (production_sdk#ffbfc5d.170130-1133)",
  "schemaVersion": "1.0.0.2",
  "assetTypes": [
    {
      "name": "ArmExplorer",
      "permissions": []
    },
    {
      "name": "BrowseAll",
      "permissions": []
    },
    {
      "name": "BrowseAllWithType",
      "permissions": []
    },
    {
      "name": "BrowseService",
      "permissions": []
    },
    {
      "name": "BrowseDynamicAsset",
      "permissions": []
    },
    {
      "name": "BrowseDynamicResource",
      "permissions": []
    },
    {
      "name": "NonAssetResource",
      "permissions": []
    },
    {
      "name": "BrowseInstanceLink",
      "permissions": []
    },
    {
      "name": "BrowseResource",
      "permissions": []
    },
    {
      "name": "BrowseAllResources",
      "permissions": []
    },
    {
      "name": "BrowseRecentResources",
      "permissions": []
    },
    {
      "name": "BrowseResourceGroup",
      "permissions": []
    },
    {
      "name": "ActiveDirectoryMfaPlaceholder",
      "permissions": []
    },
    {
      "name": "ActiveDirectoryRmsPlaceholder",
      "permissions": []
    },
    {
      "name": "ApiManagementPlaceholder",
      "permissions": []
    },
    {
      "name": "BackupPlaceholder",
      "permissions": []
    },
    {
      "name": "BizTalkServicePlaceholder",
      "permissions": []
    },
    {
      "name": "CdnPlaceholder",
      "permissions": []
    },
    {
      "name": "EventHubPlaceholder",
      "permissions": []
    },
    {
      "name": "MarketplaceAddOnPlaceholder",
      "permissions": []
    },
    {
      "name": "MediaServicePlaceholder",
      "permissions": []
    },
    {
      "name": "MobileServicePlaceholder",
      "permissions": []
    },
    {
      "name": "RemoteAppPlaceholder",
      "permissions": []
    },
    {
      "name": "ServiceBusPlaceholder",
      "permissions": []
    },
    {
      "name": "SiteRecoveryPlaceholder",
      "permissions": []
    },
    {
      "name": "StorSimplePlaceholder",
      "permissions": []
    },
    {
      "name": "StreamAnalyticsPlaceholder",
      "permissions": []
    },
    {
      "name": "TrafficManagerPlaceholder",
      "permissions": []
    },
    {
      "name": "AccountPortalSearchResult",
      "permissions": []
    },
    {
      "name": "WhatsNew",
      "permissions": []
    },
    {
      "name": "Lock",
      "permissions": []
    },
    {
      "name": "Deployments",
      "permissions": []
    },
    {
      "name": "ResourceGroups",
      "permissions": [
        {
          "Name": "read",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/read"
        },
        {
          "Name": "deleteObject",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/delete"
        },
        {
          "Name": "write",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/write"
        },
        {
          "Name": "writeDeployments",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/deployments/write"
        },
        {
          "Name": "readDeployments",
          "Action": "Microsoft.Resources/subscriptions/resourceGroups/deployments/read"
        },
        {
          "Name": "readEvents",
          "Action": "Microsoft.Insights/events/read"
        }
      ]
    },
    {
      "name": "ResourceGroupEvents",
      "permissions": []
    },
    {
      "name": "ServicesHealth",
      "permissions": []
    },
    {
      "name": "Settings",
      "permissions": []
    },
    {
      "name": "Tag",
      "permissions": []
    }
  ],
  "parts": [
    {
      "name": "BrowseServicePart",
      "inputs": [
        "assetTypeId"
      ],
      "commandBindings": [],
      "initialSize": 2
    },
    {
      "name": "BrowseServiceListPart",
      "inputs": [
        "assetTypeId"
      ],
      "commandBindings": [],
      "initialSize": 8
    },
    {
      "name": "BrowseServiceListPartWithCookie",
      "inputs": [
        "assetTypeId",
        "cookie"
      ],
      "commandBindings": [],
      "initialSize": 8
    },
    {
      "name": "Resources",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 8
    },
    {
      "name": "ResourceGroupMapPart",
      "inputs": [
        "resourceGroup"
      ],
      "commandBindings": [],
      "initialSize": 5
    },
    {
      "name": "ResourceMapPart",
      "inputs": [
        "assetOwner",
        "assetType",
        "assetId"
      ],
      "commandBindings": [],
      "initialSize": 5
    },
    {
      "name": "DiagnosticsTile",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 1
    },
    {
      "name": "WhatsNewTile",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 2
    },
    {
      "name": "FeedbackTile",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 0
    },
    {
      "name": "ServicesHealthPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 5
    },
    {
      "name": "SpecPickerListViewPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 9
    },
    {
      "name": "PricingTierLauncher",
      "inputs": [
        "entityId"
      ],
      "commandBindings": [],
      "initialSize": 3
    },
    {
      "name": "SpecComparisonPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 8
    },
    {
      "name": "SpecPickerListViewPartV3",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 9,
      "parameterProvider": true
    },
    {
      "name": "SpecPickerGridViewPartV3",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 9,
      "parameterProvider": true
    },
    {
      "name": "PricingTierLauncherV3",
      "inputs": [
        "entityId"
      ],
      "commandBindings": [],
      "initialSize": 3
    },
    {
      "name": "ResourceFilterPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 8
    },
    {
      "name": "ResourceTagsPart",
      "inputs": [
        "resourceId"
      ],
      "commandBindings": [],
      "initialSize": null
    },
    {
      "name": "GettingStartedPart",
      "inputs": [],
      "commandBindings": [],
      "initialSize": 99,
      "initialHeight": 5,
      "initialWidth": 4
    }
  ],
  "blades": [
    {
      "name": "UnauthorizedAssetBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "NotFoundAssetBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "UnavailableAssetBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "NoCreateFlowBlade",
      "keyParameters": [],
      "inputs": [
        "marketplaceItemId"
      ],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "Resources",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": []
    },
    {
      "name": "BrowseAllResourcesBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": []
    },
    {
      "name": "BrowseResourceBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": []
    },
    {
      "name": "BrowseInstanceLinkBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": []
    },
    {
      "name": "BrowseResourceGroupBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [
        "resourceType",
        "selectedSubscriptionId",
        "filter",
        "scope",
        "kind"
      ],
      "outputs": []
    },
    {
      "name": "MapResourceGroupBlade",
      "keyParameters": [],
      "inputs": [
        "id"
      ],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "ResourceGroupPickerV3Blade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true
    },
    {
      "name": "DeployFromTemplateBlade",
      "keyParameters": [],
      "inputs": [
        "internal_bladeCallerParams"
      ],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true
    },
    {
      "name": "ParametersEditorBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true
    },
    {
      "name": "TemplateEditorBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true
    },
    {
      "name": "LocationPickerV3Blade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true
    },
    {
      "name": "DeploymentDetailsBlade",
      "keyParameters": [
        "id"
      ],
      "inputs": [
        "id"
      ],
      "optionalInputs": [
        "referrerInfo"
      ],
      "outputs": []
    },
    {
      "name": "ResourceGroupMapBlade",
      "keyParameters": [
        "id"
      ],
      "inputs": [
        "id"
      ],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "ResourceMenuBlade",
      "keyParameters": [],
      "inputs": [
        "id"
      ],
      "optionalInputs": [
        "menuid",
        "referrerInfo"
      ],
      "outputs": []
    },
    {
      "name": "ServicesHealthBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "SettingsBlade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "SubscriptionPickerV3Blade",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true
    },
    {
      "name": "DeployToAzure",
      "keyParameters": [],
      "inputs": [],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true
    }
  ],
  "bladeTypeScriptDependencies": null,
  "commands": [
    {
      "name": "MoveResourceCommand",
      "inputs": [
        "resourceId"
      ]
    }
  ],
  "controls": []
}