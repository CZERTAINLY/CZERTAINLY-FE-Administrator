import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
import { actions, selectors } from '../../../../ducks/globalMetadata';
import CustomTable, { TableDataRow, TableHeader } from '../../../CustomTable';
import Dialog from '../../../Dialog';
import Spinner from '../../../Spinner';

type Props = {
    show: boolean;
    setShow: (value: boolean) => void;
};

export default function ConnectorMetadataDialog({ show, setShow }: Props) {
    const dispatch = useDispatch();
    const connectorList = useSelector(selectors.connectorList);
    const connectorMetadata = useSelector(selectors.connectorMetadata);
    const isFetchingConnectorMetadata = useSelector(selectors.isFetchingConnectorMetadata);

    const [connectorUuid, setConnectorUuid] = useState<string | undefined>(undefined);
    const attributeContentTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AttributeContentType));

    useEffect(() => {
        if (show) {
            dispatch(actions.getConnectorList());
        }
    }, [dispatch, show]);

    useEffect(() => {
        if (connectorList && connectorList.length > 0) {
            setConnectorUuid(connectorList[0].uuid);
        } else {
            setConnectorUuid(undefined);
        }
    }, [dispatch, connectorList]);

    useEffect(() => {
        if (connectorUuid) {
            dispatch(actions.getConnectorMetadata(connectorUuid));
        }
    }, [dispatch, connectorUuid]);

    const connectorMetadataTableHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                sortable: true,
                sort: 'asc',
                width: '20%',
            },
            {
                id: 'contentType',
                content: 'Content Type',
                sortable: true,
                width: '20%',
            },
            {
                id: 'promote',
                content: 'Promote',
                width: '20%',
            },
        ],
        [],
    );

    const connectorMetadataTableData: TableDataRow[] = useMemo(() => {
        if (connectorUuid && connectorMetadata) {
            return connectorMetadata.map((metadata) => ({
                id: metadata.uuid,
                columns: [
                    metadata.name,
                    getEnumLabel(attributeContentTypeEnum, metadata.contentType),
                    <Button
                        key={metadata.uuid}
                        color={'primary'}
                        onClick={() => dispatch(actions.promoteConnectorMetadata({ uuid: metadata.uuid, connectorUuid: connectorUuid }))}
                    >
                        <i className={'fa fa-arrow-circle-up'} />
                        &nbsp;Promote
                    </Button>,
                ],
            }));
        } else {
            return [];
        }
    }, [connectorMetadata, dispatch, connectorUuid, attributeContentTypeEnum]);

    return (
        <Dialog
            isOpen={show}
            caption={`Promote Metadata`}
            size="lg"
            body={
                <>
                    <FormGroup>
                        <Label for="connector">Connector</Label>
                        <Input
                            type="select"
                            id="connector"
                            placeholder="Connector"
                            value={connectorUuid}
                            onChange={(e) => setConnectorUuid(e.target.value)}
                        >
                            {connectorList?.map((connector) => (
                                <option key={connector.uuid} value={connector.uuid}>
                                    {connector.name}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                    {connectorMetadataTableData.length > 0 ? (
                        <CustomTable headers={connectorMetadataTableHeaders} data={connectorMetadataTableData} />
                    ) : (
                        <i>No metadata found for this connector.</i>
                    )}
                    <Spinner active={isFetchingConnectorMetadata} />
                </>
            }
            toggle={() => setShow(false)}
            buttons={[{ color: 'secondary', onClick: () => setShow(false), body: 'Cancel' }]}
        />
    );
}
