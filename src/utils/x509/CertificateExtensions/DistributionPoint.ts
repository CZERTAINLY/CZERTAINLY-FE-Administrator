import { DERElement, ASN1TagClass, ASN1Construction, ASN1UniversalType } from "asn1-ts";
import * as errors from "../errors";
import ReasonFlags from "./ReasonFlags";
import DistributionPointName from "./DistributionPointName";
import GeneralNames from "./GeneralNames";

//   DistributionPoint ::= SEQUENCE {
//     distributionPoint  [0]  DistributionPointName OPTIONAL,
//     reasons            [1]  ReasonFlags OPTIONAL,
//     cRLIssuer          [2]  GeneralNames OPTIONAL,
//     ...
//   }

//   DistributionPointName ::= CHOICE {
//     fullName                 [0]  GeneralNames,
//     nameRelativeToCRLIssuer  [1]  RelativeDistinguishedName,
//     ...
//   }

export default
class DistributionPoint {
    constructor (
        readonly distributionPoint? : DistributionPointName,
        readonly reasons? : ReasonFlags,
        readonly cRLIssuer? : GeneralNames
    ) {}

    public static fromElement (value: DERElement): DistributionPoint {
        switch (value.validateTag(
            [ ASN1TagClass.universal ],
            [ ASN1Construction.constructed ],
            [ ASN1UniversalType.sequence ]
        )) {
        case 0: break;
        case -1: throw new errors.X509Error("Invalid tag class on DistributionPoint");
        case -2: throw new errors.X509Error("Invalid construction on DistributionPoint");
        case -3: throw new errors.X509Error("Invalid tag number on DistributionPoint");
        default: throw new errors.X509Error("Undefined error when validating DistributionPoint tag");
        }

        const distributionPointElements: DERElement[] = value.sequence;

        let distributionPoint: DistributionPointName | undefined;
        let reasons: ReasonFlags | undefined;
        let cRLIssuer: GeneralNames | undefined;

        distributionPointElements.forEach((element) => {
            switch (element.tagNumber) {
            case (0): { // distributionPoint
                distributionPoint = element;
                break;
            }
            case (1): { // reasons
                if (element.construction !== ASN1Construction.primitive) {
                    throw new errors.X509Error("DistributionPoint.reasons may not be constructed.");
                }
                reasons = ReasonFlags.fromElement(element);
                break;
            }
            case (2): { // cRLIssuer
                cRLIssuer = element.sequence;
                break;
            }
            default: break;
            }
        });

        return new DistributionPoint(
            distributionPoint,
            reasons,
            cRLIssuer
        );
    }

    public toElement (): DERElement {
        const distributionPointElements: DERElement[] = [];

        if (this.distributionPoint) {
            distributionPointElements.push(this.distributionPoint);
        }

        if (this.reasons) {
            distributionPointElements.push(this.reasons.toElement());
        }

        if (this.cRLIssuer) {
            const crlIssuerElement: DERElement = new DERElement(
                ASN1TagClass.context,
                ASN1Construction.constructed,
                2
            );
            crlIssuerElement.sequence = this.cRLIssuer;
            distributionPointElements.push(crlIssuerElement);
        }

        const ret: DERElement = new DERElement(
            ASN1TagClass.universal,
            ASN1Construction.constructed,
            ASN1UniversalType.sequence
        );
        ret.sequence = distributionPointElements;
        return ret;
    }

    public static fromBytes (value: Uint8Array): DistributionPoint {
        const el: DERElement = new DERElement();
        el.fromBytes(value);
        return DistributionPoint.fromElement(el);
    }

    public toBytes (): Uint8Array {
        return this.toElement().toBytes();
    }
}
