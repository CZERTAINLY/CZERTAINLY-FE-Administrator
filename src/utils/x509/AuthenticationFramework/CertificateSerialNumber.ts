// CertificateSerialNumber ::= INTEGER

// This must be a Uint8Array, because it is conventional for certificates
// to use serial numbers far in excess of that which native numeric types
// can handle with integral precision.
type CertificateSerialNumber = Uint8Array;
export default CertificateSerialNumber;
