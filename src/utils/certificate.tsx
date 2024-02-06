import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { CertificateDetailResponseModel } from 'types/certificate';
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateType,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
    PlatformEnum,
} from 'types/openapi';

export const emptyCertificate: CertificateDetailResponseModel = {
    uuid: '',
    commonName: '',
    serialNumber: '',
    issuerCommonName: '',
    certificateContent: '',
    issuerDn: '',
    subjectDn: '',
    notBefore: '',
    notAfter: '',
    publicKeyAlgorithm: '',
    signatureAlgorithm: '',
    keySize: -1,
    keyUsage: [],
    extendedKeyUsage: [],
    basicConstraints: '',
    state: CertificateState.PendingIssue,
    validationStatus: CertificateValidationStatus.NotChecked,
    fingerprint: '',
    certificateType: CertificateType.X509,
    issuerSerialNumber: '',
    subjectAlternativeNames: {},
    privateKeyAvailability: false,
    trustedCa: false,
};

export function formatPEM(pemString: string, csr?: boolean) {
    const PEM_STRING_LENGTH = pemString.length,
        LINE_LENGTH = 64;
    const wrapNeeded = PEM_STRING_LENGTH > LINE_LENGTH;

    if (wrapNeeded) {
        let formattedString = '',
            wrapIndex = 0;

        for (let i = LINE_LENGTH; i < PEM_STRING_LENGTH; i += LINE_LENGTH) {
            formattedString += pemString.substring(wrapIndex, i) + '\r\n';
            wrapIndex = i;
        }

        formattedString += pemString.substring(wrapIndex, PEM_STRING_LENGTH);

        return `-----BEGIN CERTIFICATE${csr ? ' REQUEST' : ''}-----\n${formattedString}\n-----END CERTIFICATE${csr ? ' REQUEST' : ''}-----`;
    } else {
        return `-----BEGIN CERTIFICATE${csr ? ' REQUEST' : ''}-----\n${pemString}\n-----END CERTIFICATE${csr ? ' REQUEST' : ''}-----`;
    }
}

export function downloadFile(content: any, fileName: string) {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

export function getCertificateStatusColor(
    status: CertificateState | CertificateValidationStatus | CertificateEventHistoryDtoStatusEnum | ComplianceStatus | ComplianceRuleStatus,
) {
    switch (status) {
        case CertificateState.Requested:
            return '#3754a5';
        case CertificateState.Archived:
            return '#6c757d';
        case CertificateState.Rejected:
            return '#eb3349';
        case CertificateState.Issued:
            return '#1ab394';
        case CertificateState.Failed:
            return '#c7182c';
        case CertificateState.PendingApproval:
            return '#3754a5';
        case CertificateState.PendingIssue:
            return '#3782a5';
        case CertificateState.PendingRevoke:
            return '#eb3f33';
        case CertificateState.Revoked:
            return '#632828';

        case CertificateValidationStatus.Valid:
            return '#1ab394';
        case CertificateValidationStatus.Expired:
            return '#eb3349';
        case CertificateValidationStatus.Revoked:
            return '#632828';
        case CertificateValidationStatus.Expiring:
            return '#f37d63';
        case CertificateValidationStatus.Invalid:
            return '#131212';
        case CertificateValidationStatus.Inactive:
            return '#6c757d';
        case CertificateValidationStatus.NotChecked:
            return '#7fa2c1';
        case CertificateValidationStatus.Failed:
            return '#9c0012';

        case ComplianceStatus.Na:
            return '#6c757d';
        case ComplianceStatus.Nok:
            return '#eb3349';
        case ComplianceStatus.Ok:
            return '#1ab394';
        case ComplianceStatus.NotChecked:
            return '#7fa2c1';

        case ComplianceRuleStatus.Na:
            return '#6c757d';
        case ComplianceRuleStatus.Nok:
            return '#eb3349';
        case ComplianceRuleStatus.Ok:
            return '#1ab394';

        case CertificateEventHistoryDtoStatusEnum.Failed:
            return '#eb3349';
        case CertificateEventHistoryDtoStatusEnum.Success:
            return '#1ab394';

        default:
            return '#6c757d';
    }
}

export function useGetStatusText() {
    const certificateStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateState));
    const certificateValidationStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateValidationStatus));
    const complianceStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceStatus));
    const complianceRuleStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceRuleStatus));

    return useCallback(
        (
            status:
                | CertificateState
                | CertificateValidationStatus
                | CertificateEventHistoryDtoStatusEnum
                | ComplianceStatus
                | ComplianceRuleStatus,
        ) => {
            switch (status) {
                case CertificateValidationStatus.Valid:
                case CertificateValidationStatus.Invalid:
                case CertificateValidationStatus.Expiring:
                case CertificateValidationStatus.Expired:
                case CertificateValidationStatus.Revoked:
                case CertificateValidationStatus.NotChecked:
                case CertificateValidationStatus.Inactive:
                case CertificateValidationStatus.Failed:
                    return getEnumLabel(certificateValidationStatusEnum, status);

                case CertificateState.Revoked:
                case CertificateState.Archived:
                case CertificateState.Requested:
                case CertificateState.Rejected:
                case CertificateState.Issued:
                case CertificateState.PendingApproval:
                case CertificateState.PendingIssue:
                case CertificateState.PendingRevoke:
                    return getEnumLabel(certificateStatusEnum, status);

                case CertificateEventHistoryDtoStatusEnum.Success:
                    return 'Success';
                case CertificateEventHistoryDtoStatusEnum.Failed:
                    return 'Failed';

                case ComplianceStatus.Ok:
                case ComplianceStatus.Nok:
                case ComplianceStatus.Na:
                case ComplianceStatus.NotChecked:
                    return getEnumLabel(complianceStatusEnum, status);

                case ComplianceRuleStatus.Ok:
                case ComplianceRuleStatus.Nok:
                case ComplianceRuleStatus.Na:
                    return getEnumLabel(complianceRuleStatusEnum, status);

                default:
                    return 'Unknown';
            }
        },
        [certificateStatusEnum, certificateValidationStatusEnum, complianceStatusEnum, complianceRuleStatusEnum],
    );
}

/*
function getDistinguishedName(dn: DistinguishedName): string {

   const segments = [] as string[];

   if (dn) {

      if (dn.commonName) {
         segments.push(`CN=${dn.commonName}`);
      }
      if (dn.organizationName) {
         segments.push(`O=${dn.organizationName}`);
      }
      if (dn.organizationalUnitName) {
         segments.push(`OU=${dn.organizationalUnitName}`);
      }
      if (dn.localityName) {
         segments.push(`L=${dn.localityName}`);
      }
      if (dn.countryName) {
         segments.push(`C=${dn.countryName}`);
      }

   }

   return segments.join(',');

}

export function getCertificateInformation(encoded: string): CertificateModel {

   let toDecode;

   if (encoded.includes('-----BEGIN CERTIFICATE-----')) {
      toDecode = encoded.substring(encoded.indexOf('-----BEGIN CERTIFICATE-----'));
   } else {
      toDecode = `-----BEGIN CERTIFICATE-----\n${btoa(encoded)}\n-----END CERTIFICATE-----\n`;
   }

   try {

      const cert = Certificate.fromPEM(Buffer.from(toDecode, 'utf-8'));
      const subjectDn = getDistinguishedName(cert.subject);
      const issuerDn = getDistinguishedName(cert.issuer);

      return {
         uuid: "",
         commonName: cert.subject.commonName,
         issuerCommonName: cert.issuer.commonName,
         certificateContent: toDecode.replace(/\r\n/g, "\n").replace("-----BEGIN CERTIFICATE-----\n", "").replace("\n-----END CERTIFICATE-----", "").replace(/\n/g, ""),
         publicKeyAlgorithm: cert.publicKey.algo,
         signatureAlgorithm: cert.signatureAlgorithm,
         basicConstraints: "",
         status: "unknown",
         fingerprint: cert.publicKey.getFingerprint("sha256").toString("base64"),
         subjectAlternativeNames: {},
         keySize: cert.publicKey.keyRaw.byteLength / 8,
         keyUsage: [cert.keyUsage.toString()],
         subjectDn,
         issuerDn,
         notBefore: cert.validFrom.toString(),
         notAfter: cert.validTo.toString(),
         serialNumber: cert.serialNumber,
      };

   } catch (e) {
      throw (e);
   }

}


export function certificatePEM2CertificateModel(certificate: string): CertificateModel {

   const crt = Certificate.fromPEM(Buffer.from(certificate));

   enum KeyUsageFlags {
      digitalSignature = 1,
      nonRepudiation = 2,
      keyEncipherment = 4,
      dataEncipherment = 8,
      keyAgreement = 16,
      keyCertSign = 32,
      cRLSign = 64,
      encipherOnly = 128,
      decipherOnly = 256
   }


   function buildDnString(dn: DistinguishedName): string {

      const tmp: string[] = [];

      if (dn.commonName) tmp.push(`CN=${dn.commonName}`);
      if (dn.organizationName) tmp.push(`O=${dn.organizationName}`);
      if (dn.organizationalUnitName) tmp.push(`OU=${dn.organizationalUnitName}`);
      if (dn.localityName) tmp.push(`L=${dn.localityName}`);
      if (dn.countryName) tmp.push(`C=${dn.countryName}`);

      return tmp.join(";");

   }


   function buildKeyUsages(): string[] {

      const tmp: string[] = [];

      if (crt.keyUsage & KeyUsageFlags.digitalSignature) tmp.push("digitalSignature");
      if (crt.keyUsage & KeyUsageFlags.nonRepudiation) tmp.push("nonRepudiation");
      if (crt.keyUsage & KeyUsageFlags.keyEncipherment) tmp.push("keyEncipherment");
      if (crt.keyUsage & KeyUsageFlags.dataEncipherment) tmp.push("dataEncipherment");
      if (crt.keyUsage & KeyUsageFlags.keyAgreement) tmp.push("keyAgreement");
      if (crt.keyUsage & KeyUsageFlags.keyCertSign) tmp.push("keyCertSign");
      if (crt.keyUsage & KeyUsageFlags.cRLSign) tmp.push("cRLSign");
      if (crt.keyUsage & KeyUsageFlags.encipherOnly) tmp.push("encipherOnly");
      if (crt.keyUsage & KeyUsageFlags.decipherOnly) tmp.push("decipherOnly");

      return tmp;

   }


   function buildBasicConstraints(): string {

      const tmp: string[] = [];

      const bc = crt.extensions.find(ext => ext.name === "basicConstraints");
      if (!bc) return "";

      tmp.push(`critical: ${bc.critical ? "yes" : "no"}`);
      tmp.push(`CA: ${bc.isCA ? "true" : "false"}`);
      tmp.push(`Path length: ${bc.maxPathLen === -1 ? "unlimited" : bc.maxPathLen.toString()}`);

      return tmp.join(", ");

   }


   function getSubjectAlternativeNames(): CertificateSubjectAlternativeNamesModel {

      return {
         dNSName: crt.dnsNames,
         directoryName: [],
         ediPartyName: [],
         iPAddress: crt.ipAddresses,
         otherName: [],
         registeredID: [],
         rfc822Name: [],
         uniformResourceIdentifier: crt.uris,
         x400Address: crt.emailAddresses
      }

   }


   let encoded = certificate;

   if (!encoded.startsWith('-----BEGIN CERTIFICATE-----')) {
      encoded = `-----BEGIN CERTIFICATE-----\n${encoded}\n-----END CERTIFICATE-----\n`;
   }

   return {
      uuid: "",
      commonName: crt.subject.commonName,
      issuerCommonName: crt.issuer.commonName,
      issuerSerialNumber: crt.issuer.serialName,
      issuerDn: buildDnString(crt.issuer),
      subjectDn: buildDnString(crt.subject),
      serialNumber: crt.serialNumber,
      notBefore: crt.validFrom.toUTCString(),
      notAfter: crt.validTo.toUTCString(),
      keySize: crt.publicKey.keyRaw.length,
      publicKeyAlgorithm: crt.publicKey.algo,
      signatureAlgorithm: crt.signatureAlgorithm,
      fingerprint: btoa(crt.publicKey.getFingerprint("sha1").toString()),
      keyUsage: buildKeyUsages(),
      basicConstraints: buildBasicConstraints(),
      extendedKeyUsage: [],
      subjectAlternativeNames: getSubjectAlternativeNames(),

      status: "unknown",
      certificateContent: encoded,
      certificateType: "X509",

   }

}


*/
