import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions, selectors } from 'ducks/oids';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { LockWidgetNameEnum } from 'types/user-interface';
import { OidCategory, PlatformEnum, Resource } from 'types/openapi';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { getEditAndDeleteWidgetButtons, createWidgetDetailHeaders, createTableDataRow } from 'utils/widget';
import Container from 'components/Container';
import Breadcrumb from 'components/Breadcrumb';

export default function CustomOIDDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const oid = useSelector(selectors.oid);

    const isFetching = useSelector(selectors.isFetching);
    const isDeleting = useSelector(selectors.isDeleting);
    const oidCategoryEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.OidCategory));
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetching || isDeleting, [isFetching, isDeleting]);

    const showAdditionalProperties = useMemo(() => {
        if (!oid) return false;
        return oid.category === OidCategory.RdnAttributeType;
    }, [oid]);

    const getFreshOIDDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.resetState());
        dispatch(actions.getOID({ oid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshOIDDetails();
    }, [getFreshOIDDetails, id]);

    const onEditClick = useCallback(() => {
        if (!oid) return;
        navigate(`../../edit/${oid.oid}`, { relative: 'path' });
    }, [oid, navigate]);

    const onDeleteConfirmed = useCallback(() => {
        if (!oid) return;

        dispatch(actions.deleteOID({ oid: oid.oid }));
        setConfirmDelete(false);
    }, [oid, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(() => getEditAndDeleteWidgetButtons(onEditClick, setConfirmDelete), [onEditClick]);

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(
        () =>
            !oid
                ? []
                : [
                      createTableDataRow('OID', oid.oid),
                      createTableDataRow('Display Name', oid.displayName),
                      createTableDataRow('Description', oid.description),
                      createTableDataRow('Category', oidCategoryEnum[oid.category as OidCategory]?.label),
                  ],
        [oid, oidCategoryEnum],
    );

    const additionalPropertiesData: TableDataRow[] = useMemo<TableDataRow[]>(
        () =>
            !oid
                ? []
                : [
                      createTableDataRow('Code', oid.additionalProperties?.code),
                      createTableDataRow('Alternative Codes', oid.additionalProperties?.altCodes?.join(', ')),
                  ],
        [oid],
    );
    return (
        <div>
            <Breadcrumb
                items={[
                    { label: `${getEnumLabel(resourceEnum, Resource.Oids)} Inventory`, href: '/custom-oids' },
                    { label: oid?.oid || 'OID Details', href: '' },
                ]}
            />
            <Container>
                <Widget
                    title="OID Details"
                    busy={isBusy}
                    widgetButtons={buttons}
                    titleSize="large"
                    refreshAction={getFreshOIDDetails}
                    widgetLockName={LockWidgetNameEnum.EntityDetails}
                >
                    <br />

                    <CustomTable headers={detailHeaders} data={detailData} />
                </Widget>
                {showAdditionalProperties && (
                    <Widget title="Additional Properties" titleSize="large">
                        <br />
                        <CustomTable headers={detailHeaders} data={additionalPropertiesData} />
                    </Widget>
                )}
                <Dialog
                    isOpen={confirmDelete}
                    caption="Delete Custom OID"
                    body="You are about to delete Custom OID. Is this what you want to do?"
                    toggle={() => setConfirmDelete(false)}
                    buttons={[
                        { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                        { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    ]}
                />
            </Container>
        </div>
    );
}
