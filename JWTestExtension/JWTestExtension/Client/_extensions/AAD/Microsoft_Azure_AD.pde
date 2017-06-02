{
  "extension": "Microsoft_Azure_AD",
  "version": "1.0",
  "sdkVersion": "5.0.302.226 (production_sdk#134d6d1.151201-1911)",
  "schemaVersion": "1.0.0.2",
  "assetTypes": [],
  "parts": [
    {
      "name": "RolesPart",
      "inputs": [
        "scope"
      ],
      "commandBindings": [],
      "initialSize": 2,
      "largeInitialSize": null
    },
    {
      "name": "UsersPart",
      "inputs": [
        "scope"
      ],
      "commandBindings": [],
      "initialSize": 3,
      "largeInitialSize": null
    }
  ],
  "blades": [
    {
      "name": "SelectMember",
      "keyParameters": [],
      "inputs": [
        "collectorBindingInternals-inputs",
        "collectorBindingInternals-errors",
        "stepInput"
      ],
      "optionalInputs": [],
      "outputs": [
        "collectorBindingInternals-outputs",
        "collectorBindingInternals-commit",
        "stepOutput"
      ]
    },
    {
      "name": "SelectMemberV3",
      "keyParameters": [],
      "inputs": [
        "title",
        "subtitle"
      ],
      "optionalInputs": [],
      "outputs": [],
      "parameterProvider": true
    },
    {
      "name": "RolesListBlade",
      "keyParameters": [],
      "inputs": [
        "scope"
      ],
      "optionalInputs": [],
      "outputs": []
    },
    {
      "name": "UserAssignmentsBlade",
      "keyParameters": [],
      "inputs": [
        "scope"
      ],
      "optionalInputs": [],
      "outputs": []
    }
  ],
  "commands": []
}