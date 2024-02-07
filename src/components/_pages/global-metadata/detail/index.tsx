import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/globalMetadata';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { Badge, Container } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function GlobalMetadataDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const globalMetadata = useSelector(selectors.globalMetadata);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const attributeContentTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AttributeContentType));

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const getFreshGlobalMetadata = useCallback(() => {
        if (!id) return;
        dispatch(actions.getGlobalMetadata(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (!id) return;
        if (!globalMetadata || id !== globalMetadata.uuid) {
            dispatch(actions.getGlobalMetadata(id));
        }
    }, [dispatch, globalMetadata, id]);

    const onEditClick = useCallback(() => {
        navigate(`../../edit/${globalMetadata?.uuid}`, { relative: 'path' });
    }, [globalMetadata, navigate]);

    const onDeleteConfirmed = useCallback(() => {
        if (!globalMetadata) return;
        dispatch(actions.deleteGlobalMetadata(globalMetadata.uuid));
        setConfirmDelete(false);
    }, [globalMetadata, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditClick();
                },
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
        ],
        [onEditClick],
    );

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !globalMetadata
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', globalMetadata.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', globalMetadata.name],
                      },
                      {
                          id: 'label',
                          columns: ['Label', globalMetadata.label],
                      },
                      {
                          id: 'description',
                          columns: ['Description', globalMetadata.description],
                      },
                      {
                          id: 'contentType',
                          columns: ['Content Type', getEnumLabel(attributeContentTypeEnum, globalMetadata.contentType)],
                      },
                      {
                          id: 'group',
                          columns: ['Group', globalMetadata.group ?? ''],
                      },
                      {
                          id: 'visible',
                          columns: [
                              'Visible',
                              globalMetadata.visible ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,
                          ],
                      },
                  ],
        [globalMetadata, attributeContentTypeEnum],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Global Metadata Details"
                busy={isFetchingDetail}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshGlobalMetadata}
                widgetLockName={LockWidgetNameEnum.GlobalMetadataDetails}
            >
                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Global Metadata"
                body="You are about to delete a Global Metadata. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
