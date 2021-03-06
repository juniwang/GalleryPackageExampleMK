﻿/**
 * @file Source code generated by PDL compiler.
 * @version 1.0
 * @sdkversion 5.0.302.607 (production_sdk#ffbfc5d.170130-1133)
 * @schemaversion 1.0.0.2
 */
/// <reference path="../TypeReferences.d.ts" />

import Icons = require ("../Shared/Icons");
import ClientResources = require ("ClientResources");
import EntryPointModule = require ("Program");
export = ExtensionDefinition;
module ExtensionDefinition {
    "use strict";
    var untypedManifest: any = {
  "name": null,
  "version": null,
  "schemaVersion": null,
  "sdkVersion": null,
  "notifications": [],
  "assetTypes": [
    {
      "name": "MyResource",
      "singularDisplayName": ClientResources.AssetTypeNames.Resource.singular,
      "pluralDisplayName": ClientResources.AssetTypeNames.Resource.plural,
      "lowerSingularDisplayName": ClientResources.AssetTypeNames.Resource.lowerSingular,
      "lowerPluralDisplayName": ClientResources.AssetTypeNames.Resource.lowerPlural,
      "viewModel": "Browse$AssetTypeViewModel",
      "contracts": 40,
      "partName": "ResourcePart",
      "bladeName": "ResourceBlade",
      "browseType": 1,
      "resourceType": {
        "resourceTypeName": "Microsoft.PortalSdk/rootResources",
        "apiVersion": "2014-04-01"
      },
      "icon": Icons.Icons.cloudService
    }
  ],
  "notifications2": [],
  "startBoardParts": [],
  "blades": [],
  "galleryParts": [],
  "redirects": []
};
    untypedManifest.pageVersion = window.fx.environment.pageVersion;
    export var manifest: MsPortalFx.Extension.Manifest = untypedManifest;
    MsPortalFx.Extension.registerAmd<typeof EntryPointModule>(manifest, "Program", require, "../_generated/Blades/", "../_generated/Parts", "../_generated/Controls");
}
