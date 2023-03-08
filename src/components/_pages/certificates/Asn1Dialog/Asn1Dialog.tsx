import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { transformParseCertificateResponseDtoToAsn1String } from "../../../../ducks/transform/utilsCertificate";
import { actions as utilsCertificateActions, selectors as utilsCertificateSelectors } from "../../../../ducks/utilsCertificate";
import { ParseCertificateRequestDtoParseTypeEnum } from "../../../../types/openapi/utils";
import Dialog from "../../../Dialog";
import Widget from "../../../Widget";

interface Props {
    certificateContent: string;
}

export default function Asn1Dialog({certificateContent}: Props) {
    const dispatch = useDispatch();
    const parsedCertificate = useSelector(utilsCertificateSelectors.parsedCertificate);
    const [asn1, setAsn1] = useState<string | undefined>(undefined);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (certificateContent) {
            dispatch(utilsCertificateActions.reset());
            dispatch(utilsCertificateActions.parseCertificate({certificate: certificateContent, parseType: ParseCertificateRequestDtoParseTypeEnum.Asn1}));
        }
    }, [dispatch, certificateContent]);

    useEffect(() => {
        if (parsedCertificate) {
            setAsn1(transformParseCertificateResponseDtoToAsn1String(parsedCertificate));
        }
    }, [parsedCertificate]);

    return asn1 ? <>
        <Widget><Button color={"primary"} onClick={() => setIsOpen(true)}>Show ASN.1 Data</Button></Widget>
        <Dialog
            isOpen={isOpen}
            size={"lg"}
            caption="ASN.1 Data"
            body={asn1}
            toggle={() => setIsOpen(false)}
            buttons={[{color: "primary", onClick: () => setIsOpen(false), body: "Close"}]}
        />
    </> : <></>
}