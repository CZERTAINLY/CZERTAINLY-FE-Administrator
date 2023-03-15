import Spinner from "components/Spinner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { transformParseCertificateResponseDtoToAsn1String } from "../../../../ducks/transform/utilsCertificate";
import { actions as utilsCertificateActions, selectors as utilsCertificateSelectors } from "../../../../ducks/utilsCertificate";
import { ParseCertificateRequestDtoParseTypeEnum } from "../../../../types/openapi/utils";
import Dialog from "../../../Dialog";

interface Props {
    certificateContent: string;
}

export default function Asn1Dialog({ certificateContent }: Props) {
    const dispatch = useDispatch();
    const parsedCertificate = useSelector(utilsCertificateSelectors.parsedCertificate);
    const isFetchingDetail = useSelector(utilsCertificateSelectors.isFetchingDetail);
    const [asn1, setAsn1] = useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(utilsCertificateActions.reset());
    }, [dispatch]);
    
    useEffect(() => {
        if (parsedCertificate) {
            setAsn1(transformParseCertificateResponseDtoToAsn1String(parsedCertificate));
        }
    }, [parsedCertificate]);

    return <>
        <Spinner active={isFetchingDetail} />
        <Button
            className="btn btn-link p-0"
            disabled={isFetchingDetail}
            size="sm"
            color="primary"
            onClick={() => {
                if (certificateContent) {
                    dispatch(utilsCertificateActions.parseCertificate({ certificate: certificateContent, parseType: ParseCertificateRequestDtoParseTypeEnum.Asn1 }));
                }
            }}
            title="Show ASN.1 Structure"
        >Show</Button>
        <Dialog
            isOpen={!!asn1}
            size={"lg"}
            caption="ASN.1 Structure"
            body={<pre>{asn1}</pre>}
            toggle={() => setAsn1(undefined)}
            buttons={[{ color: "primary", onClick: () => setAsn1(undefined), body: "Close" }]}
        />
    </>
}