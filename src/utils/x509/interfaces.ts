import { DERElement } from "../asn1";

interface Enbyteable {
    toBytes (): Uint8Array;
}

export
interface Debyteable {
    fromBytes (value: Uint8Array): void;
}

export
interface Byteable extends Enbyteable,Debyteable {
}

export
interface Enelementable {
    toElement (): DERElement;
}

export
interface Deelementable {
    fromElement (value: DERElement): void;
}

export
interface Elementable extends Enelementable,Deelementable {

}
