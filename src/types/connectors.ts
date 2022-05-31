export type FunctionGroupCode = "credentialProvider" | "authorityProvider" | "legacyAuthorityProvider" | "discoveryProvider";

export type FunctionGroupFilter = "CREDENTIAL_PROVIDER" | "AUTHORITY_PROVIDER" | "LEGACY_AUTHORITY_PROVIDER" | "DISCOVERY_PROVIDER";

export type AuthType = "none" | "basic" | "certificate" | "apiKey" | "jwt";

export type Status = "waitingForApproval" | "registered" | "connected" | "unavailable" | "misconfigured" | "failed" | "offline";
