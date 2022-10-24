import DistributionPointName from "./DistributionPointName";
import ReasonFlags from "./ReasonFlags";
import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
// IssuingDistPointSyntax ::= SEQUENCE {
//     -- If onlyContainsUserPublicKeyCerts and onlyContainsCACerts are both FALSE,
//     -- the CRL covers both certificate types
//     distributionPoint               [0]  DistributionPointName OPTIONAL,
//     onlyContainsUserPublicKeyCerts  [1]  BOOLEAN DEFAULT FALSE,
//     onlyContainsCACerts             [2]  BOOLEAN DEFAULT FALSE,
//     onlySomeReasons                 [3]  ReasonFlags OPTIONAL,
//     indirectCRL                     [4]  BOOLEAN DEFAULT FALSE,
//     ...
//   }

export default
class IssuingDistPointSyntax {
    // eslint-disable-next-line max-params
    constructor (
        readonly distributionPoint? : DistributionPointName,
        readonly onlyContainsUserPublicKeyCerts: boolean = false,
        readonly onlyContainsCACerts: boolean = false,
        readonly onlySomeReasons? : ReasonFlags,
        readonly indirectCRL: boolean = false
    ) {}

    public static fromElement (value: DERElement): IssuingDistPointSyntax {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on IssuingDistPointSyntax");
        case -2: throw new errors.X509Error("Invalid construction on IssuingDistPointSyntax");
        case -3: throw new errors.X509Error("Invalid tag number on IssuingDistPointSyntax");
        default: throw new errors.X509Error("Undefined error when validating IssuingDistPointSyntax tag");
        }

        let distributionPoint: DistributionPointName | undefined;
        let onlyContainsUserPublicKeyCerts: boolean | undefined;
        let onlyContainsCACerts: boolean | undefined;
        let onlySomeReasons: ReasonFlags | undefined;
        let indirectCRL: boolean | undefined;

        const issuingDistPointSyntaxElements: DERElement[] = value.sequence;
        let lastEncounteredTagNumber: number;
        issuingDistPointSyntaxElements.forEach((element) => {
            if (!lastEncounteredTagNumber) {
                lastEncounteredTagNumber = element.tagNumber;
            } else if (element.tagNumber <= lastEncounteredTagNumber) {
                throw new errors.X509Error("Elements out of order in IssuingDistPointSyntax.");
            }

            if (element.tagClass === ASN1TagClass.context) {
                switch (element.tagNumber) {
                case (0): { // distributionPoint
                    distributionPoint = element;
                    break;
                }
                case (1): { // onlyContainsUserPublicKeyCerts
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error(
                            "Invalid construction for IssuingDistPointSyntax.onlyContainsUserPublicKeyCerts.",
                        );
                    }
                    onlyContainsUserPublicKeyCerts = element.boolean;
                    break;
                }
                case (2): { // onlyContainsCACerts
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error(
                            "Invalid construction for IssuingDistPointSyntax.onlyContainsCACerts.",
                        );
                    }
                    onlyContainsCACerts = element.boolean;
                    break;
                }
                case (3): { // onlySomeReasons
                    if (element.construction !== ASN1Construction.constructed) {
                        throw new errors.X509Error(
                            "Invalid construction for IssuingDistPointSyntax.onlySomeReasons.",
                        );
                    }
                    onlySomeReasons = ReasonFlags.fromElement(element);
                    break;
                }
                case (4): { // indirectCRL
                    if (element.construction !== ASN1Construction.primitive) {
                        throw new errors.X509Error(
                            "Invalid construction for IssuingDistPointSyntax.indirectCRL.",
                        );
                    }
                    indirectCRL = element.boolean;
                    break;
                }
                default: break;
                }
            }

            lastEncounteredTagNumber = element.tagNumber;
        });

        return new IssuingDistPointSyntax(
            distributionPoint,
            onlyContainsUserPublicKeyCerts,
            onlyContainsCACerts,
            onlySomeReasons,
            indirectCRL
        );
    }

    public toElement (): DERElement {
        const issuingDistPointSyntaxElements: DERElement[] = [];

        if (this.distributionPoint) {
            issuingDistPointSyntaxElements.push(this.distributionPoint);
        }

        if (this.onlyContainsUserPublicKeyCerts) {
            const onlyContainsUserPublicKeyCertsElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                ASN1UniversalType.boolean
            );
            onlyContainsUserPublicKeyCertsElement.boolean = this.onlyContainsUserPublicKeyCerts;
            issuingDistPointSyntaxElements.push(onlyContainsUserPublicKeyCertsElement);
        }

        if (this.onlyContainsCACerts) {
            const onlyContainsCACertsElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                ASN1UniversalType.boolean
            );
            onlyContainsCACertsElement.boolean = this.onlyContainsUserPublicKeyCerts;
            issuingDistPointSyntaxElements.push(onlyContainsCACertsElement);
        }

        if (this.onlySomeReasons) {
            issuingDistPointSyntaxElements.push(this.onlySomeReasons.toElement());
        }

        if (this.indirectCRL) {
            const indirectCRLElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.primitive,
                ASN1UniversalType.boolean
            );
            indirectCRLElement.boolean = this.onlyContainsUserPublicKeyCerts;
            issuingDistPointSyntaxElements.push(indirectCRLElement);
        }

        const issuingDistPointSyntaxElement: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        issuingDistPointSyntaxElement.sequence = issuingDistPointSyntaxElements;
        return issuingDistPointSyntaxElement;
    }

    public static fromBytes (value: Uint8Array): IssuingDistPointSyntax {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return IssuingDistPointSyntax.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
