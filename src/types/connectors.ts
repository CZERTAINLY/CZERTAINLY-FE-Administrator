export type FunctionGroupCode = "credentialProvider" | "authorityProvider" | "legacyAuthorityProvider" | "discoveryProvider" | "entityProvider" | "locationProvider";

export type FunctionGroupFilter = "CREDENTIAL_PROVIDER" | "AUTHORITY_PROVIDER" | "LEGACY_AUTHORITY_PROVIDER" | "DISCOVERY_PROVIDER" | "ENTITY_PROVIDER" | "LOCATION_PROVIDER";

export type AuthType = "none" | "basic" | "certificate" | "apiKey" | "jwt";

export type Status = "waitingForApproval" | "registered" | "connected" | "unavailable" | "misconfigured" | "failed" | "offline";
