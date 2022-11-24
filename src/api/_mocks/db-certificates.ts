import { CertificateDTO } from "api/certificates"


export interface DbCertificate extends CertificateDTO {
}


interface DbCertificateList {
   [key: string]: DbCertificate;
}


export const dbCertificates: DbCertificateList = {

   "Lukas Kopenec": {

      uuid: "af774229-e796-4f9c-906c-a49ebce74c53",
      commonName: "Lukas Kopenec",
      serialNumber: "659734db638fc6e550e7891f20c6581488ed7f0d",
      issuerCommonName: "Lukas Kopenec",
      certificateContent: "MIICgTCCAiegAwIBAgIUZZc022OPxuVQ54kfIMZYFIjtfw0wCgYIKoZIzj0EAwIwgZUxCzAJBgNVBAYTAkNaMRcwFQYDVQQIDA5DemVjaCBSZXB1YmxpYzEPMA0GA1UEBwwGUHJhZ3VlMRgwFgYDVQQKDA9DbG91ZGZpZWxkIGEucy4xFjAUBgNVBAMMDUx1a2FzIEtvcGVuZWMxKjAoBgkqhkiG9w0BCQEWG2x1a2FzLmtvcGVuZWNAY2xvdWRmaWVsZC5jejAeFw0yMDA5MjkwNjI2MTFaFw0yMTA5MjQwNjI2MTFaMIGVMQswCQYDVQQGEwJDWjEXMBUGA1UECAwOQ3plY2ggUmVwdWJsaWMxDzANBgNVBAcMBlByYWd1ZTEYMBYGA1UECgwPQ2xvdWRmaWVsZCBhLnMuMRYwFAYDVQQDDA1MdWthcyBLb3BlbmVjMSowKAYJKoZIhvcNAQkBFhtsdWthcy5rb3BlbmVjQGNsb3VkZmllbGQuY3owWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATvEO6gSqSKh6eMR9qb2mMk611Q3H0zm81zSYReo9W04WhwZBzuo+3D3cC3un30Y6A08qJOJ0ZJlUnZJA7QXo05o1MwUTAdBgNVHQ4EFgQUe+9WPjzrGJtduozZbY6Le2eHwhEwHwYDVR0jBBgwFoAUe+9WPjzrGJtduozZbY6Le2eHwhEwDwYDVR0TAQH/BAUwAwEB/zAKBggqhkjOPQQDAgNIADBFAiAb0lSWpbDQ3j4MAoOLqeR3SbNYVSc1MRjqNt34WSKqQQIhAIWy3TK6KLX8R8AyRdiSDGYXG3zzK+wjDGoataX4wfYY",
      issuerDn: "EMAILADDRESS=lukas.kopenec@cloudfield.cz, CN=Lukas Kopenec, O=Cloudfield a.s., L=Prague, ST=Czech Republic, C=CZ",
      subjectDn: "EMAILADDRESS=lukas.kopenec@cloudfield.cz, CN=Lukas Kopenec, O=Cloudfield a.s., L=Prague, ST=Czech Republic, C=CZ",
      notBefore: "2020-09-29T11:56:11.000+00:00",
      notAfter: "2021-09-24T11:56:11.000+00:00",
      publicKeyAlgorithm: "EC",
      signatureAlgorithm: "SHA256withECDSA",
      keySize: 256,
      keyUsage: [],
      basicConstraints: "Subject Type=CA",
      meta: undefined,
      status: "unknown",
      fingerprint: "bf05dc3f28c3752f4296fb56237bf75034863f3141fb38715d9b88df882fa708",
      subjectAlternativeNames: {
         registeredID: [],
         ediPartyName: [],
         iPAddress: [],
         x400Address: [],
         rfc822Name: [],
         otherName: [],
         dNSName: [],
         directoryName: [],
         uniformResourceIdentifier: [],
      },
      certificateType: "X509",
      entity: {
         uuid: "",
         entityType: "HSM",
         name: "Hardware Security Module 1",
         description: "SRV1"
      },
      certificateGroup: {
         uuid: "",
         name: "test group 1",
         description: "test group 1"
      },
      owner: "Pradeep",
      complianceStatus: "ok"

   },

   "CLIENT1": {

      uuid: "a2217e05-e20e-4326-8d93-4cfdd3d3853c",
      commonName: "CLIENT1",
      serialNumber: "177e75f42e95ecb98f831eb57de27b0bc8c47643",
      issuerCommonName: "localhost",
      certificateContent: "MIIDPTCCAiUCFBd+dfQuley5j4MetX3iewvIxHZDMA0GCSqGSIb3DQEBCwUAMF0xCzAJBgNVBAYTAkNaMRAwDgYDVQQIDAdDemVjaGlhMQswCQYDVQQHDAJDQjENMAsGA1UECgwEM0tFWTEMMAoGA1UECwwDREVWMRIwEAYDVQQDDAlsb2NhbGhvc3QwHhcNMjAwOTI1MTE1NDU3WhcNMzAwODA0MTE1NDU3WjBZMQswCQYDVQQGEwJDWjEQMA4GA1UECAwHQ3plY2hpYTELMAkGA1UEBwwCQ0IxCzAJBgNVBAoMAkNGMQwwCgYDVQQLDANERVYxEDAOBgNVBAMMB0NMSUVOVDEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/SsO+9IzQ85xxyiT+ou8RDNxZMP0Ja8YKrdu19BTFjyLtVLpb+I1XqzlXFdJcObYZ5ZboyALB00i5Ds0TTs8ydgEeaw0K2O96DnGh4z5r4qLuF+fpVR+3A8kKRSrqJN1JNPFeb+NKsilUNvx5plZBm5+VTd64Sop6r1DALEDBS8AxRJSgp4x/oCq+T4zLh9XDyVUQ68axLgF86sS4YcBYKQVTH7KwRx+FGPFnBqt2ll2IherJ1N1dheXdLqzPYY+uIhs55wUPRhQibjiJhM9NgMYsmOPZRzsPIr6+gUil82rmSfyMg/A0wT4dsm6MT7ly6PPRyxoRvhNvfn96FsCRAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAI+YNR82n23p9014wa+99aEWJfujlirY07jhAQmsGTkkFM5QTNJzwi6VYnUwjlJMOXw8fEiBVRHUiyLV5RWZGiGZuLdCZgYCjtzCtWuOPidShAK5GpLDipG9upZ+RCNpBXVbb6J5tEI0esTSxZ/jwj2JqZZayhRmRXL/j8vGRn74atTILeFwUIYsSreoMI8wG1Rk0que09LgP1RmCiSl1GUSTL/lrK/dYaw0orZwUxzKg/KNnTYprYiAIVRsHUz8bkd6mGEBCfDdpEp0l7laBej2R8RhGDwuxjma1ZrwlCsKLlpdn2lwzqIEc+Zl7dxiLTb1NLMH80f4LCuF1iFCD6E=",
      issuerDn: "CN=localhost, OU=DEV, O=3KEY, L=CB, ST=Czechia, C=CZ",
      subjectDn: "CN=CLIENT1, OU=DEV, O=CF, L=CB, ST=Czechia, C=CZ",
      notBefore: "2020-09-25T17:24:57.000+00:00",
      notAfter: "2030-08-04T17:24:57.000+00:00",
      publicKeyAlgorithm: "RSA",
      signatureAlgorithm: "SHA256withRSA",
      keySize: 2048,
      keyUsage: [],
      basicConstraints: "Subject Type=End Entity",
      meta: undefined,
      status: "unknown",
      fingerprint: "e1481e7eb80a265189da1c42c21066b006ed46afc1b55dd610a31bb8ec5da8b8",
      subjectAlternativeNames: {
         registeredID: [],
         ediPartyName: [],
         iPAddress: [],
         x400Address: [],
         rfc822Name: [],
         otherName: [],
         dNSName: [],
         directoryName: [],
         uniformResourceIdentifier: [],
      },
      certificateType: "X509",
      issuerSerialNumber: "4d94dc3da65485a2befac3ed7199efe407ba6e02",
      entity: {
         uuid: "",
         entityType: "HSM",
         name: "Hardware Security Module 1",
         description: "SRV1"
      },
      certificateGroup: {
         uuid: "",
         name: "test group 1",
         description: "test group 1"
      },
      owner: "Pradeep",
      complianceStatus: "na"

   },

   "t1c.com": {

      uuid: "3a0f59f9-906d-45d2-bcb0-f14f077c7ee9",
      commonName: "t1c.com",
      serialNumber: "ea1acbe5c57a642a",
      issuerCommonName: "t1c.com",
      certificateContent: "MIICvTCCAaWgAwIBAgIJAOoay+XFemQqMA0GCSqGSIb3DQEBBQUAMBIxEDAOBgNVBAMTB3QxYy5jb20wHhcNMjEwOTE3MTMzODI3WhcNMzEwOTE1MTMzODI3WjASMRAwDgYDVQQDEwd0MWMuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2e5LGKooSrI5c3jZGKCfNpDnm4pww1YkWmD762V603sVRRkrQgQ6ttP4Kjb2tJmrfWLOfMhbkTfUdWq4Ve4z5cnczRADZ+x7wKRywjUqt0mU4MixmyDoCNuq+PI0/4ckOpuNimwaOPxa3xyYkWyldZeYLJQUDzsN1eciuOMEnxGZQW9memiLd6xbKYLq40vO5sIbl+ocLcafVIj3/E3KERf9bUVHWSKxsDoqnCGPerySXSDpuG3H3Y3Jj2KODHyZa+qgnr7Cz2q3fxJWqpvxVq3+pjyb4VYcj5746QSAwYjjOxBmGjUjyNhGJnMJ4kHGkyPxlODES4nqIi3LljOdZwIDAQABoxYwFDASBgNVHREECzAJggd0MWMuY29tMA0GCSqGSIb3DQEBBQUAA4IBAQAx0PXc+pYb8jWHva4dGD324dk0l4QfbS378akUD091WsK44teSlZMGkBjcVukFx9KHjwZV+R8ZElTOiuoURMZjjsDSynGavBH2CbQSgOrziL66ciD8VByXwmTOLaPnOaaqkv9gCBNVovCZvPaxY9dLf91hXqlTGfmXPVHCYApzPEeqjm9oXU3IZUFu64ZennMMNq/cjyOoZ6pjxWzJ+UdSKofQBj7YXGXGqTAUW23345vBnXqmBbI3lUXTiUk0+/E5CvPEbrtdE+wh98im6CBaQE1eHCCvSVwPaEk5InnicO4FfYpa4i/uLFmTzyERUV8bKMaFuZKhAygL+i1JPO5j",
      issuerDn: "CN=t1c.com",
      subjectDn: "CN=t1c.com",
      notBefore: "2021-09-17T13:38:27.000+00:00",
      notAfter: "2031-09-15T13:38:27.000+00:00",
      publicKeyAlgorithm: "RSA",
      signatureAlgorithm: "SHA1withRSA",
      keySize: 2048,
      keyUsage: [],
      basicConstraints: "Subject Type=End Entity",
      meta: undefined,
      status: "unknown",
      fingerprint: "20537cb2a6853b5c356162b3caa2ddf65ec1d18aa6753510dd64250689eeba5e",
      subjectAlternativeNames: {
         registeredID: [],
         ediPartyName: [],
         iPAddress: [],
         x400Address: [],
         rfc822Name: [],
         otherName: [],
         dNSName: ["t1c.com"],
         directoryName: [],
         uniformResourceIdentifier: [],
      },
      certificateType: "X509",
      entity: {
         uuid: "",
         entityType: "HSM",
         name: "Hardware Security Module 1",
         description: "SRV1"
      },
      certificateGroup: {
         uuid: "",
         name: "test group 1",
         description: "test group 1"
      },
      owner: "Pradeep",
      complianceStatus: "na"

   },

   "GTS Root R1C3": {

      uuid: "cf68d3ec-742a-45ba-84a8-b1fec379f634",
      commonName: "GTS CA 1C3",
      serialNumber: "159612451717983579589660725350",
      issuerCommonName: "GTS Root R1",
      certificateContent: "-----BEGIN CERTIFICATE-----\nMIIFljCCA36gAwIBAgINAgO8U1lrNMcY9QFQZjANBgkqhkiG9w0BAQsFADBHMQsw\nCQYDVQQGEwJVUzEiMCAGA1UEChMZR29vZ2xlIFRydXN0IFNlcnZpY2VzIExMQzEU\nMBIGA1UEAxMLR1RTIFJvb3QgUjEwHhcNMjAwODEzMDAwMDQyWhcNMjcwOTMwMDAw\nMDQyWjBGMQswCQYDVQQGEwJVUzEiMCAGA1UEChMZR29vZ2xlIFRydXN0IFNlcnZp\nY2VzIExMQzETMBEGA1UEAxMKR1RTIENBIDFDMzCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBAPWI3+dijB43+DdCkH9sh9D7ZYIl/ejLa6T/belaI+KZ9hzp\nkgOZE3wJCor6QtZeViSqejOEH9Hpabu5dOxXTGZok3c3VVP+ORBNtzS7XyV3NzsX\nlOo85Z3VvMO0Q+sup0fvsEQRY9i0QYXdQTBIkxu/t/bgRQIh4JZCF8/ZK2VWNAcm\nBA2o/X3KLu/qSHw3TT8An4Pf73WELnlXXPxXbhqW//yMmqaZviXZf5YsBvcRKgKA\ngOtjGDxQSYflispfGStZloEAoPtR28p3CwvJlk/vcEnHXG0g/Zm0tOLKLnf9LdwL\ntmsTDIwZKxeWmLnwi/agJ7u2441Rj72ux5uxiZ0CAwEAAaOCAYAwggF8MA4GA1Ud\nDwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwEgYDVR0T\nAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUinR/r4XN7pXNPZzQ4kYU83E1HScwHwYD\nVR0jBBgwFoAU5K8rJnEaK0gnhS9SZizv8IkTcT4waAYIKwYBBQUHAQEEXDBaMCYG\nCCsGAQUFBzABhhpodHRwOi8vb2NzcC5wa2kuZ29vZy9ndHNyMTAwBggrBgEFBQcw\nAoYkaHR0cDovL3BraS5nb29nL3JlcG8vY2VydHMvZ3RzcjEuZGVyMDQGA1UdHwQt\nMCswKaAnoCWGI2h0dHA6Ly9jcmwucGtpLmdvb2cvZ3RzcjEvZ3RzcjEuY3JsMFcG\nA1UdIARQME4wOAYKKwYBBAHWeQIFAzAqMCgGCCsGAQUFBwIBFhxodHRwczovL3Br\naS5nb29nL3JlcG9zaXRvcnkvMAgGBmeBDAECATAIBgZngQwBAgIwDQYJKoZIhvcN\nAQELBQADggIBAIl9rCBcDDy+mqhXlRu0rvqrpXJxtDaV/d9AEQNMwkYUuxQkq/BQ\ncSLbrcRuf8/xam/IgxvYzolfh2yHuKkMo5uhYpSTld9brmYZCwKWnvy15xBpPnrL\nRklfRuFBsdeYTWU0AIAaP0+fbH9JAIFTQaSSIYKCGvGjRFsqUBITTcFTNvNCCK9U\n+o53UxtkOCcXCb1YyRt8OS1b887U7ZfbFAO/CVMkH8IMBHmYJvJh8VNS/UKMG2Yr\nPxWhu//2m+OBmgEGcYk1KCTd4b3rGS3hSMs9WYNRtHTGnXzGsYZbr8w0xNPM1IER\nlQCh9BIiAfq0g3GvjLeMcySsN1PCAJA/Ef5c7TaUEDu9Ka7ixzpiO2xj2YC/WXGs\nYye5TBeg2vZzFb8q3o/zpWwygTMD0IZRcZk0upONXbVRWPeyk+gB9lm+cZv9TSjO\nz23HFtz30dZGm6fKa+l3D/2gthsjgx0QGtkJAITgRNOidSOzNIb2ILCkXhAd4FJG\nAJ2xDx8hcFH1mt0G/FX0Kw4zd8NLQsLxdxP8c4CU6x+7Nz/OAipmsHMdMqUybDKw\njuDEI/9bfU1lcKwrmz3O2+BtjjKAvpafkmO8l7tdufThcV4q5O8DIrGKZTqPwJNl\n1IXNDw9bg1kWRxYtnCQ6yICmJhSFm/Y3m6xv+cXDBlHz4n/FsRC6UfTd\n-----END CERTIFICATE-----\n",
      issuerDn: "CN=GTS Root R1, O=Google Trust Services LLC, C=US",
      subjectDn: "CN=GTS CA 1C3, O=Google Trust Services LLC, C=US",
      notBefore: "2020-08-13T00:00:42.000+00:00",
      notAfter: "2027-09-30T00:00:42.000+00:00",
      publicKeyAlgorithm: "RSA",
      signatureAlgorithm: "SHA256withRSA",
      keySize: 2048,
      extendedKeyUsage: ["1.3.6.1.5.5.7.3.1", "1.3.6.1.5.5.7.3.2"],
      keyUsage: ["digitalSignature", "keyCertSign", "cRLSign"],
      basicConstraints: "Subject Type=End Entity",
      meta: {
         discoverySource: "https://google.com:443",
         cipherSuite: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      },
      status: "valid",
      fingerprint: "23ecb03eec17338c4e33a6b48a41dc3cda12281bbc3ff813c0589d6cc2387522",
      subjectAlternativeNames: {
         registeredID: [],
         ediPartyName: [],
         iPAddress: [],
         x400Address: [],
         rfc822Name: [],
         otherName: [],
         dNSName: [],
         directoryName: [],
         uniformResourceIdentifier: [],
      },
      certificateType: "X509",
      entity: {
         uuid: "",
         entityType: "HSM",
         name: "Hardware Security Module 1",
         description: "SRV1"
      },
      certificateGroup: {
         uuid: "",
         name: "test group 1",
         description: "test group 1"
      },
      owner: "Pradeep",
      complianceStatus: "ok"

   },

   "GTS Root R1": {

      uuid: "8203558b-ba20-4d32-9c20-5e02db929096",
      commonName: "GTS Root R1",
      serialNumber: "159159747900478145820483398898491642637",
      issuerCommonName: "GlobalSign Root CA",
      certificateContent: "-----BEGIN CERTIFICATE-----\nMIIFYjCCBEqgAwIBAgIQd70NbNs2+RrqIQ/E8FjTDTANBgkqhkiG9w0BAQsFADBX\nMQswCQYDVQQGEwJCRTEZMBcGA1UEChMQR2xvYmFsU2lnbiBudi1zYTEQMA4GA1UE\nCxMHUm9vdCBDQTEbMBkGA1UEAxMSR2xvYmFsU2lnbiBSb290IENBMB4XDTIwMDYx\nOTAwMDA0MloXDTI4MDEyODAwMDA0MlowRzELMAkGA1UEBhMCVVMxIjAgBgNVBAoT\nGUdvb2dsZSBUcnVzdCBTZXJ2aWNlcyBMTEMxFDASBgNVBAMTC0dUUyBSb290IFIx\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAthECix7joXebO9y/lD63\nladAPKH9gvl9MgaCcfb2jH/76Nu8ai6Xl6OMS/kr9rH5zoQdsfnFl97vufKj6bwS\niV6nqlKr+CMny6SxnGPb15l+8Ape62im9MZaRw1NEDPjTrETo8gYbEvs/AmQ351k\nKSUjB6G00j0uYODP0gmHu81I8E3CwnqIiru6z1kZ1q+PsAewnjHxgsHA3y6mbWwZ\nDrXYfiYaRQM9sHmklCitD38m5agI/pboPGiUU+6DOogrFZYJsuB6jC511pzrp1Zk\nj5ZPaK49l8KEj8C8QMALXL32h7M1bKwYUH+E4EzNktMg6TO8UpmvMrUpsyUqtEj5\ncuHKZPfmghCN6J3Cioj6OGaK/GP5Afl4/Xtcd/p2h/rs37EOeZVXtL0m79YB0esW\nCruOC7XFxYpVq9Os6pFLKcwZpDIlTirxZUTQAs6qzkm06p98g7BAe+dDq6dso499\niYH6TKX/1Y7DzkvgtdizjkXPdsDtQCv9Uw+wp9U7DbGKogPeMa3Md+pvez7W35Ei\nEua++tgy/BBjFFFy3l3WFpO9KWgz7zpm7AeKJt8T11dleCfeXkkUAKIAf5qoIbap\nsZWwpbkNFhHax2xIPEDgfg1azVY80ZcFuctL7TlLnMQ/0lUTbiSw1nH69MG6zO0b\n9f6BQdgAmD06yK56mDcYBZUCAwEAAaOCATgwggE0MA4GA1UdDwEB/wQEAwIBhjAP\nBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTkrysmcRorSCeFL1JmLO/wiRNxPjAf\nBgNVHSMEGDAWgBRge2YaRQ2XyolQL30EzTSo//z9SzBgBggrBgEFBQcBAQRUMFIw\nJQYIKwYBBQUHMAGGGWh0dHA6Ly9vY3NwLnBraS5nb29nL2dzcjEwKQYIKwYBBQUH\nMAKGHWh0dHA6Ly9wa2kuZ29vZy9nc3IxL2dzcjEuY3J0MDIGA1UdHwQrMCkwJ6Al\noCOGIWh0dHA6Ly9jcmwucGtpLmdvb2cvZ3NyMS9nc3IxLmNybDA7BgNVHSAENDAy\nMAgGBmeBDAECATAIBgZngQwBAgIwDQYLKwYBBAHWeQIFAwIwDQYLKwYBBAHWeQIF\nAwMwDQYJKoZIhvcNAQELBQADggEBADSkHrEoo9C0dhemMXoh6dFSPsjbdBZBiLg9\nNR3t5P+T4Vxfq7vqfM/b5A3Ri1fyJm9bvhdGaJQ3b2t6yMAYN/olUazsaL+yyEn9\nWprKASOshIArAoyZl+tJaox118fessmXn1hIVw41oeQa1v1vg4Fv74zPl6/AhSrw\n9U5pCZEt4Wi4wStz6dTZ/CLANx8LZh1J7QJVj2fhMtfTJr9w4z30Z209fOU0iOMy\n+qduBmpvvYuR7hZL6Dupszfnw0Skfths18dG9ZKb59UhvmaSGZRVbNQpsg3BZlvi\nd0lIKO2d1xozclOzgjXPYovJJIultzkMu34qQb9Sz/yilrbCgj8=\n-----END CERTIFICATE-----\n",
      issuerDn: "CN=GlobalSign Root CA, OU=Root CA, O=GlobalSign nv-sa, C=BE",
      subjectDn: "CN=GTS Root R1, O=Google Trust Services LLC, C=US",
      notBefore: "2020-06-19T00:00:42.000+00:00",
      notAfter: "2028-01-28T00:00:42.000+00:00",
      publicKeyAlgorithm: "RSA",
      signatureAlgorithm: "SHA256withRSA",
      keySize: 4096,
      keyUsage: ["digitalSignature", "keyCertSign", "cRLSign"],
      basicConstraints: "Subject Type=End Entity",
      meta: {
         discoverySource: "https://google.com:443",
         cipherSuite: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      },
      status: "expiring",
      fingerprint: "3ee0278df71fa3c125c4cd487f01d774694e6fc57e0cd94c24efd769133918e5",
      subjectAlternativeNames: {
         registeredID: [],
         ediPartyName: [],
         iPAddress: [],
         x400Address: [],
         rfc822Name: [],
         otherName: [],
         dNSName: [],
         directoryName: [],
         uniformResourceIdentifier: [],
      },
      certificateType: "X509",
      entity: {
         uuid: "",
         entityType: "HSM",
         name: "Hardware Security Module 1",
         description: "SRV1"
      },
      certificateGroup: {
         uuid: "",
         name: "test group 1",
         description: "test group 1"
      },
      owner: "Pradeep",
      complianceStatus: "nok",
      "nonCompliantRules": [
         {
            "connectorName": "COMP",
            "ruleName": "e_ca_common_name_missing",
            "ruleDescription": "CA Certificates common name MUST be included.",
            "status": "na"
         }
      ],

   },

   "*.google.com": {
      commonName: "*.google.com",
      serialNumber: "48258887386539256918542776146645400308",
      issuerCommonName: "GTS CA 1C3",
      certificateContent: "-----BEGIN CERTIFICATE-----\nMIINUDCCDDigAwIBAgIQJE5S2WtVH5YKAAAAAPK69DANBgkqhkiG9w0BAQsFADBG\nMQswCQYDVQQGEwJVUzEiMCAGA1UEChMZR29vZ2xlIFRydXN0IFNlcnZpY2VzIExM\nQzETMBEGA1UEAxMKR1RTIENBIDFDMzAeFw0yMTA3MTIwMTM1MzFaFw0yMTEwMDQw\nMTM1MzBaMBcxFTATBgNVBAMMDCouZ29vZ2xlLmNvbTBZMBMGByqGSM49AgEGCCqG\nSM49AwEHA0IABEgx1+KL1j32iFjzWTwiiRk8e0IxOdIIn1k1MsPrew5Db6vtpxK6\n6VqHHYn2AzqF/BPutyXRBZa0cIbuI12YXmCjggsyMIILLjAOBgNVHQ8BAf8EBAMC\nB4AwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQU\n3m4kxK5o7ZOH8S9Pt5tdJfozDdAwHwYDVR0jBBgwFoAUinR/r4XN7pXNPZzQ4kYU\n83E1HScwagYIKwYBBQUHAQEEXjBcMCcGCCsGAQUFBzABhhtodHRwOi8vb2NzcC5w\na2kuZ29vZy9ndHMxYzMwMQYIKwYBBQUHMAKGJWh0dHA6Ly9wa2kuZ29vZy9yZXBv\nL2NlcnRzL2d0czFjMy5kZXIwggjiBgNVHREEggjZMIII1YIMKi5nb29nbGUuY29t\nghYqLmFwcGVuZ2luZS5nb29nbGUuY29tggkqLmJkbi5kZXaCEiouY2xvdWQuZ29v\nZ2xlLmNvbYIYKi5jcm93ZHNvdXJjZS5nb29nbGUuY29tghgqLmRhdGFjb21wdXRl\nLmdvb2dsZS5jb22CCyouZ29vZ2xlLmNhggsqLmdvb2dsZS5jbIIOKi5nb29nbGUu\nY28uaW6CDiouZ29vZ2xlLmNvLmpwgg4qLmdvb2dsZS5jby51a4IPKi5nb29nbGUu\nY29tLmFygg8qLmdvb2dsZS5jb20uYXWCDyouZ29vZ2xlLmNvbS5icoIPKi5nb29n\nbGUuY29tLmNvgg8qLmdvb2dsZS5jb20ubXiCDyouZ29vZ2xlLmNvbS50coIPKi5n\nb29nbGUuY29tLnZuggsqLmdvb2dsZS5kZYILKi5nb29nbGUuZXOCCyouZ29vZ2xl\nLmZyggsqLmdvb2dsZS5odYILKi5nb29nbGUuaXSCCyouZ29vZ2xlLm5sggsqLmdv\nb2dsZS5wbIILKi5nb29nbGUucHSCEiouZ29vZ2xlYWRhcGlzLmNvbYIPKi5nb29n\nbGVhcGlzLmNughEqLmdvb2dsZXZpZGVvLmNvbYIMKi5nc3RhdGljLmNughAqLmdz\ndGF0aWMtY24uY29tghIqLmdzdGF0aWNjbmFwcHMuY26CD2dvb2dsZWNuYXBwcy5j\nboIRKi5nb29nbGVjbmFwcHMuY26CDGdrZWNuYXBwcy5jboIOKi5na2VjbmFwcHMu\nY26CEmdvb2dsZWRvd25sb2Fkcy5jboIUKi5nb29nbGVkb3dubG9hZHMuY26CEHJl\nY2FwdGNoYS5uZXQuY26CEioucmVjYXB0Y2hhLm5ldC5jboILd2lkZXZpbmUuY26C\nDSoud2lkZXZpbmUuY26CEWFtcHByb2plY3Qub3JnLmNughMqLmFtcHByb2plY3Qu\nb3JnLmNughFhbXBwcm9qZWN0Lm5ldC5jboITKi5hbXBwcm9qZWN0Lm5ldC5jboIX\nZ29vZ2xlLWFuYWx5dGljcy1jbi5jb22CGSouZ29vZ2xlLWFuYWx5dGljcy1jbi5j\nb22CF2dvb2dsZWFkc2VydmljZXMtY24uY29tghkqLmdvb2dsZWFkc2VydmljZXMt\nY24uY29tghFnb29nbGV2YWRzLWNuLmNvbYITKi5nb29nbGV2YWRzLWNuLmNvbYIR\nZ29vZ2xlYXBpcy1jbi5jb22CEyouZ29vZ2xlYXBpcy1jbi5jb22CFWdvb2dsZW9w\ndGltaXplLWNuLmNvbYIXKi5nb29nbGVvcHRpbWl6ZS1jbi5jb22CEmRvdWJsZWNs\naWNrLWNuLm5ldIIUKi5kb3VibGVjbGljay1jbi5uZXSCGCouZmxzLmRvdWJsZWNs\naWNrLWNuLm5ldIIWKi5nLmRvdWJsZWNsaWNrLWNuLm5ldIIRZGFydHNlYXJjaC1j\nbi5uZXSCEyouZGFydHNlYXJjaC1jbi5uZXSCHWdvb2dsZXRyYXZlbGFkc2Vydmlj\nZXMtY24uY29tgh8qLmdvb2dsZXRyYXZlbGFkc2VydmljZXMtY24uY29tghhnb29n\nbGV0YWdzZXJ2aWNlcy1jbi5jb22CGiouZ29vZ2xldGFnc2VydmljZXMtY24uY29t\nghdnb29nbGV0YWdtYW5hZ2VyLWNuLmNvbYIZKi5nb29nbGV0YWdtYW5hZ2VyLWNu\nLmNvbYIYZ29vZ2xlc3luZGljYXRpb24tY24uY29tghoqLmdvb2dsZXN5bmRpY2F0\naW9uLWNuLmNvbYIkKi5zYWZlZnJhbWUuZ29vZ2xlc3luZGljYXRpb24tY24uY29t\nghZhcHAtbWVhc3VyZW1lbnQtY24uY29tghgqLmFwcC1tZWFzdXJlbWVudC1jbi5j\nb22CC2d2dDEtY24uY29tgg0qLmd2dDEtY24uY29tggtndnQyLWNuLmNvbYINKi5n\ndnQyLWNuLmNvbYILMm1kbi1jbi5uZXSCDSouMm1kbi1jbi5uZXSCFGdvb2dsZWZs\naWdodHMtY24ubmV0ghYqLmdvb2dsZWZsaWdodHMtY24ubmV0ggxhZG1vYi1jbi5j\nb22CDiouYWRtb2ItY24uY29tgg0qLmdzdGF0aWMuY29tghQqLm1ldHJpYy5nc3Rh\ndGljLmNvbYIKKi5ndnQxLmNvbYIRKi5nY3BjZG4uZ3Z0MS5jb22CCiouZ3Z0Mi5j\nb22CDiouZ2NwLmd2dDIuY29tghAqLnVybC5nb29nbGUuY29tghYqLnlvdXR1YmUt\nbm9jb29raWUuY29tggsqLnl0aW1nLmNvbYILYW5kcm9pZC5jb22CDSouYW5kcm9p\nZC5jb22CEyouZmxhc2guYW5kcm9pZC5jb22CBGcuY26CBiouZy5jboIEZy5jb4IG\nKi5nLmNvggZnb28uZ2yCCnd3dy5nb28uZ2yCFGdvb2dsZS1hbmFseXRpY3MuY29t\nghYqLmdvb2dsZS1hbmFseXRpY3MuY29tggpnb29nbGUuY29tghJnb29nbGVjb21t\nZXJjZS5jb22CFCouZ29vZ2xlY29tbWVyY2UuY29tgghnZ3BodC5jboIKKi5nZ3Bo\ndC5jboIKdXJjaGluLmNvbYIMKi51cmNoaW4uY29tggh5b3V0dS5iZYILeW91dHVi\nZS5jb22CDSoueW91dHViZS5jb22CFHlvdXR1YmVlZHVjYXRpb24uY29tghYqLnlv\ndXR1YmVlZHVjYXRpb24uY29tgg95b3V0dWJla2lkcy5jb22CESoueW91dHViZWtp\nZHMuY29tggV5dC5iZYIHKi55dC5iZYIaYW5kcm9pZC5jbGllbnRzLmdvb2dsZS5j\nb22CG2RldmVsb3Blci5hbmRyb2lkLmdvb2dsZS5jboIcZGV2ZWxvcGVycy5hbmRy\nb2lkLmdvb2dsZS5jboIYc291cmNlLmFuZHJvaWQuZ29vZ2xlLmNuMCEGA1UdIAQa\nMBgwCAYGZ4EMAQIBMAwGCisGAQQB1nkCBQMwPAYDVR0fBDUwMzAxoC+gLYYraHR0\ncDovL2NybHMucGtpLmdvb2cvZ3RzMWMzL1FxRnhiaTlNNDhjLmNybDCCAQQGCisG\nAQQB1nkCBAIEgfUEgfIA8AB2AO7Ale6NcmQPkuPDuRvHEqNpagl7S2oaFDjmR7LL\n7cX5AAABepiR1l0AAAQDAEcwRQIhAP+YQ6W3WQUUmK/ha7sU5r5jK8v3LNuLk/yC\nargfAJ2sAiBE1dlyBfhwBfd5iD6CHXl4p0b4w68i7XVbcbqaOXwpyQB2AH0+8viP\n/4hVaCTCwMqeUol5K8UOeAl/LmqXaJl+IvDXAAABepiR1oYAAAQDAEcwRQIhAKnz\nVpmMgAaro9vda8Oo8oRF738pWDBGN0EfFROo48mDAiA2flJFE3dWN9GZN6PGlJLh\n3bqXb4x4hh+Vt180gzjJkTANBgkqhkiG9w0BAQsFAAOCAQEAwQuea1jqXzHIJRpJ\ntvzdpkZzhBSxIXO8u1qkGOykGhWxddFVQxxFgExpbw9E0BegVIhZCeqPmCi95QXH\nWGk4hkx/U8wkIltTEvY1YHwqbmbC9VzxDEi7a9ISQN3PYvuap3HGYrKHexMhd3S7\n8E4gFiiHg7KeKxFTAad1svYSQRk+mJ34LxBdvYjsAKqD9ofgJsprzqFBoL4htNEm\nXLU2VxxpmkIr73WRx8BP7AysDefE7OvmuAZcqzls8ervpOhfJdcnit8eYsomihiq\nONRyMkr9FfUFYbjFQcFohNa4fr2TtfMK8y0cgQBPA2mAP1Znb/5QREAaZB/eS4qn\nMr3kaQ==\n-----END CERTIFICATE-----\n",
      issuerDn: "CN=GTS CA 1C3, O=Google Trust Services LLC, C=US",
      subjectDn: "CN=*.google.com",
      notBefore: "2021-07-12T01:35:31.000+00:00",
      notAfter: "2021-10-04T01:35:30.000+00:00",
      publicKeyAlgorithm: "EC",
      signatureAlgorithm: "SHA256withRSA",
      keySize: 256,
      extendedKeyUsage: ["1.3.6.1.5.5.7.3.1"],
      keyUsage: ["digitalSignature"],
      basicConstraints: "Subject Type=CA",
      uuid: "629d952d-5bca-4bf5-8c45-444d21c671ee",
      meta: {
         discoverySource: "https://google.com:443",
         cipherSuite: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      },
      status: "revoked",
      fingerprint: "4e0a48c93eeba750b9616ab378486a0fc9b5ad82bf52cf7ec6498ef65b2d017e",
      certificateType: "X509",
      issuerSerialNumber: "123434456hg4hj4567b567v586v",
      subjectAlternativeNames: {
         registeredID: [],
         ediPartyName: [],
         iPAddress: [],
         x400Address: [],
         rfc822Name: [],
         otherName: [],
         dNSName: [
            "*.google.com",
            "*.appengine.google.com",
            "*.bdn.dev",
            "*.cloud.google.com",
            "*.crowdsource.google.com",
            "*.datacompute.google.com",
            "*.google.ca",
            "*.google.cl",
            "*.google.co.in",
            "*.google.co.jp",
            "*.google.co.uk",
            "*.google.com.ar",
            "*.google.com.au",
            "*.google.com.br",
            "*.google.com.co",
            "*.google.com.mx",
            "*.google.com.tr",
            "*.google.com.vn",
            "*.google.de",
            "*.google.es",
            "*.google.fr",
            "*.google.hu",
            "*.google.it",
            "*.google.nl",
            "*.google.pl",
            "*.google.pt",
            "*.googleadapis.com",
            "*.googleapis.cn",
            "*.googlevideo.com",
            "*.gstatic.cn",
            "*.gstatic-cn.com",
            "*.gstaticcnapps.cn",
            "googlecnapps.cn",
            "*.googlecnapps.cn",
            "gkecnapps.cn",
            "*.gkecnapps.cn",
            "googledownloads.cn",
            "*.googledownloads.cn",
            "recaptcha.net.cn",
            "*.recaptcha.net.cn",
            "widevine.cn",
            "*.widevine.cn",
            "ampproject.org.cn",
            "*.ampproject.org.cn",
            "ampproject.net.cn",
            "*.ampproject.net.cn",
            "google-analytics-cn.com",
            "*.google-analytics-cn.com",
            "googleadservices-cn.com",
            "*.googleadservices-cn.com",
            "googlevads-cn.com",
            "*.googlevads-cn.com",
            "googleapis-cn.com",
            "*.googleapis-cn.com",
            "googleoptimize-cn.com",
            "*.googleoptimize-cn.com",
            "doubleclick-cn.net",
            "*.doubleclick-cn.net",
            "*.fls.doubleclick-cn.net",
            "*.g.doubleclick-cn.net",
            "dartsearch-cn.net",
            "*.dartsearch-cn.net",
            "googletraveladservices-cn.com",
            "*.googletraveladservices-cn.com",
            "googletagservices-cn.com",
            "*.googletagservices-cn.com",
            "googletagmanager-cn.com",
            "*.googletagmanager-cn.com",
            "googlesyndication-cn.com",
            "*.googlesyndication-cn.com",
            "*.safeframe.googlesyndication-cn.com",
            "app-measurement-cn.com",
            "*.app-measurement-cn.com",
            "gvt1-cn.com",
            "*.gvt1-cn.com",
            "gvt2-cn.com",
            "*.gvt2-cn.com",
            "2mdn-cn.net",
            "*.2mdn-cn.net",
            "googleflights-cn.net",
            "*.googleflights-cn.net",
            "admob-cn.com",
            "*.admob-cn.com",
            "*.gstatic.com",
            "*.metric.gstatic.com",
            "*.gvt1.com",
            "*.gcpcdn.gvt1.com",
            "*.gvt2.com",
            "*.gcp.gvt2.com",
            "*.url.google.com",
            "*.youtube-nocookie.com",
            "*.ytimg.com",
            "android.com",
            "*.android.com",
            "*.flash.android.com",
            "g.cn",
            "*.g.cn",
            "g.co",
            "*.g.co",
            "goo.gl",
            "www.goo.gl",
            "google-analytics.com",
            "*.google-analytics.com",
            "google.com",
            "googlecommerce.com",
            "*.googlecommerce.com",
            "ggpht.cn",
            "*.ggpht.cn",
            "urchin.com",
            "*.urchin.com",
            "youtu.be",
            "youtube.com",
            "*.youtube.com",
            "youtubeeducation.com",
            "*.youtubeeducation.com",
            "youtubekids.com",
            "*.youtubekids.com",
            "yt.be",
            "*.yt.be",
            "android.clients.google.com",
            "developer.android.google.cn",
            "developers.android.google.cn",
            "source.android.google.cn",
         ],
         directoryName: [],
         uniformResourceIdentifier: []
      },
      entity: {
         uuid: "",
         entityType: "HSM",
         name: "Hardware Security Module 1",
         description: "SRV1"
      },
      certificateGroup: {
         uuid: "",
         name: "test group 1",
         description: "test group 1"
      },
      owner: "Pradeep",
      complianceStatus: "nok",
      "nonCompliantRules": [
         {
            "connectorName": "COMP",
            "ruleName": "e_ca_common_name_missing",
            "ruleDescription": "CA Certificates common name MUST be included.",
            "status": "na"
         },
         {
            "connectorName": "COMP",
            "ruleName": "e_ca_common_name_missing_1",
            "ruleDescription": "CA Certificates common name MUST be included.",
            "status": "na"
         },
         {
            "connectorName": "COMP",
            "ruleName": "e_ca_common_name_missing_2",
            "ruleDescription": "CA Certificates common name MUST be included.",
            "status": "na"
         },
         {
            "connectorName": "COMP",
            "ruleName": "e_ca_common_name_missing_3",
            "ruleDescription": "CA Certificates common name MUST be included.",
            "status": "na"
         },

      ],
   },

}
