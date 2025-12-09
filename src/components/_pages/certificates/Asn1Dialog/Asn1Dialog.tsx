import Spinner from 'components/Spinner';
import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'components/Button';
import { transformParseCertificateResponseDtoToAsn1String } from '../../../../ducks/transform/utilsCertificate';
import { actions as utilsCertificateActions, selectors as utilsCertificateSelectors } from '../../../../ducks/utilsCertificate';
import {
    actions as utilsCertificateRequestActions,
    selectors as utilsCertificateRequestSelectors,
} from '../../../../ducks/utilsCertificateRequest';

import { transformParseRequestResponseDtoToCertificateResponseDetailModelToAsn1String } from 'ducks/transform/utilsCertificateRequest';
import { ParseCertificateRequestDtoParseTypeEnum, ParseRequestRequestDtoParseTypeEnum } from '../../../../types/openapi/utils';
import Dialog from '../../../Dialog';

interface Props {
    content: string;
    isCSR?: boolean;
}

export default function Asn1Dialog({ content, isCSR }: Props) {
    const dispatch = useDispatch();
    const parsedCertificate = useSelector(utilsCertificateSelectors.parsedCertificate);
    const parsedCertificateRequest = useSelector(utilsCertificateRequestSelectors.parsedCertificateRequest);
    const isFetchingCSRDetails = useSelector(utilsCertificateRequestSelectors.isFetchingDetail);
    const isFetchingDetail = useSelector(utilsCertificateSelectors.isFetchingDetail);
    const [asn1, setAsn1] = useState<string | undefined>(undefined);

    const health = useSelector(utilsActuatorSelectors.health);

    const resetParsedData = useCallback(() => {
        dispatch(utilsCertificateActions.reset());
        dispatch(utilsCertificateRequestActions.reset());
    }, [dispatch]);

    useEffect(() => {
        resetParsedData();
    }, [resetParsedData]);

    useEffect(() => {
        if (!health) {
            dispatch(utilsActuatorActions.health());
        }
    }, [dispatch, health]);

    useEffect(() => {
        if (parsedCertificate && !isCSR) {
            setAsn1(transformParseCertificateResponseDtoToAsn1String(parsedCertificate));
        }
    }, [parsedCertificate, isCSR]);

    useEffect(() => {
        if (parsedCertificateRequest && isCSR) {
            setAsn1(transformParseRequestResponseDtoToCertificateResponseDetailModelToAsn1String(parsedCertificateRequest));
        }
    }, [parsedCertificateRequest, isCSR]);

    const onClose = useCallback(() => {
        resetParsedData();
        setAsn1(undefined);
    }, [resetParsedData]);

    return (
        <>
            <Spinner active={isFetchingDetail || isFetchingCSRDetails} />
            <Button
                variant="transparent"
                disabled={!health || isFetchingDetail || isFetchingCSRDetails}
                onClick={() => {
                    if (content && health) {
                        if (!isCSR) {
                            dispatch(
                                utilsCertificateActions.parseCertificate({
                                    certificate: content,
                                    parseType: ParseCertificateRequestDtoParseTypeEnum.Asn1,
                                }),
                            );
                        } else {
                            dispatch(
                                utilsCertificateRequestActions.parseCertificateRequest({
                                    content,
                                    requestParseType: ParseRequestRequestDtoParseTypeEnum.Asn1,
                                }),
                            );
                        }
                    }
                }}
                title="Show ASN.1 Structure"
                className="text-[var(--primary-blue-color)] !p-0 hover:bg-transparent"
            >
                Show
            </Button>
            <Dialog
                isOpen={!!asn1}
                size="xl"
                caption="ASN.1 Structure"
                body={<pre className="text-sm overflow-x-auto text-[var(--dark-gray-color)]">{asn1}</pre>}
                toggle={onClose}
                buttons={[{ color: 'secondary', variant: 'outline', onClick: onClose, body: 'Close' }]}
            />
        </>
    );
}
