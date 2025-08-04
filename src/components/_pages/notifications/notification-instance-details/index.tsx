import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from 'ducks/customAttributes';
import { actions as notificationsActions, selectors as notificationsSelectors } from 'ducks/notifications';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';
import { Container, Label } from 'reactstrap';
import { getEditAndDeleteWidgetButtons, createWidgetDetailHeaders } from 'utils/widget';

const NotificationInstanceDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const notificationInstance = useSelector(notificationsSelectors.notificationInstanceDetail);
    const mappingAttributes = useSelector(notificationsSelectors.mappingAttributes);

    const navigate = useNavigate();

    const customAttributes = useSelector(customAttributesSelectors.customAttributes);
    const isFetchingNotificationInstanceDetail = useSelector(notificationsSelectors.isFetchingNotificationInstanceDetail);
    const isDeleting = useSelector(notificationsSelectors.isDeleting);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(() => isFetchingNotificationInstanceDetail || isDeleting, [isFetchingNotificationInstanceDetail, isDeleting]);

    const onDeleteConfirmed = useCallback(() => {
        if (!notificationInstance) return;
        dispatch(notificationsActions.clearDeleteErrorMessages());
        dispatch(notificationsActions.deleteNotificationInstance({ uuid: notificationInstance.uuid }));
        setConfirmDelete(false);
    }, [dispatch, notificationInstance]);

    const clearNotificationInstanceDetail = useCallback(() => {
        dispatch(notificationsActions.clearNotificationInstanceDetail());
    }, [dispatch]);

    useEffect(() => {
        clearNotificationInstanceDetail();
        return clearNotificationInstanceDetail;
    }, [clearNotificationInstanceDetail]);

    const getFreshNotificationInstanceDetail = useCallback(() => {
        if (!id) return;
        dispatch(notificationsActions.getNotificationInstance({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshNotificationInstanceDetail();
    }, [getFreshNotificationInstanceDetail]);

    useEffect(() => {
        if (!notificationInstance) return;
        dispatch(
            notificationsActions.listMappingAttributes({
                kind: notificationInstance.kind,
                connectorUuid: notificationInstance.connectorUuid,
            }),
        );
        dispatch(customAttributesActions.listCustomAttributes({}));
    }, [dispatch, notificationInstance]);

    const onEditClick = useCallback(() => {
        if (!id) return;
        navigate(`../../../notificationinstances/edit/${id}`);
    }, [navigate, id]);

    const buttons: WidgetButtonProps[] = useMemo(() => getEditAndDeleteWidgetButtons(onEditClick, setConfirmDelete), [onEditClick]);

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(
        () =>
            !notificationInstance
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', notificationInstance.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', notificationInstance.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', notificationInstance.description || ''],
                      },
                      {
                          id: 'kind',
                          columns: ['Kind', notificationInstance.kind || ''],
                      },
                      {
                          id: 'notificationProviderUuid',
                          columns: ['Notification Provider Uuid', notificationInstance.connectorUuid],
                      },
                      {
                          id: 'notificationProviderName',
                          columns: [
                              'Notification Provider Name',
                              <Link to={`../../../connectors/detail/${notificationInstance.connectorUuid}`}>
                                  {notificationInstance.connectorName}
                              </Link>,
                          ],
                      },
                  ],
        [notificationInstance],
    );

    const getMappingAttributesContentType = useCallback(
        (attributeUuid: string) => {
            const mappingAttribute = mappingAttributes?.find((mappingAttribute) => mappingAttribute.uuid === attributeUuid);
            return mappingAttribute?.contentType || '';
        },
        [mappingAttributes],
    );

    const getCustomAttributeName = useCallback(
        (attributeUuid: string) => {
            const customAttribute = customAttributes?.find((customAttribute) => customAttribute.uuid === attributeUuid);
            return customAttribute?.name || '';
        },
        [customAttributes],
    );

    const attributeHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'attributeName',
                content: 'Attribute Name',
                sort: 'asc',
                sortable: true,
                width: 'auto',
            },
            {
                id: 'customAttributeName',
                content: 'Custom Attribute Name',
                sortable: true,
                width: 'auto',
            },
            {
                id: 'contentType',
                content: 'Content Type',
                width: 'auto',
                align: 'center',
            },
        ],
        [],
    );

    const rolesTableData: TableDataRow[] = useMemo(
        () =>
            notificationInstance?.attributeMappings
                ? notificationInstance?.attributeMappings.map((attribute) => {
                      return {
                          id: attribute.mappingAttributeUuid,
                          columns: [
                              attribute.mappingAttributeName,
                              <Link to={`../../../customattributes/detail/${attribute.customAttributeUuid}`}>
                                  {getCustomAttributeName(attribute.customAttributeUuid)}
                              </Link>,
                              getMappingAttributesContentType(attribute.mappingAttributeUuid),
                          ],
                      };
                  })
                : [],
        [notificationInstance, getMappingAttributesContentType, getCustomAttributeName],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                widgetButtons={buttons}
                refreshAction={getFreshNotificationInstanceDetail}
                title="Notification Instance Details"
                titleSize="larger"
                busy={isBusy}
            >
                <br />

                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            {notificationInstance?.attributes?.length ? (
                <Widget title="Attributes" busy={isFetchingNotificationInstanceDetail} titleSize="larger">
                    <br />
                    <Label>Notification Instance Attributes</Label>

                    <AttributeViewer attributes={notificationInstance.attributes} viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE} />
                </Widget>
            ) : (
                <></>
            )}
            {notificationInstance?.attributeMappings?.length ? (
                <Widget title="Attribute Mappings" busy={isFetchingNotificationInstanceDetail} titleSize="larger">
                    <br />
                    <Label>Notification Instance Attribute Mappings</Label>

                    <CustomTable headers={attributeHeaders} data={rolesTableData} />
                </Widget>
            ) : (
                <></>
            )}
            <Dialog
                isOpen={confirmDelete}
                caption={`Delete a Notification Instance`}
                body={`You are about to delete a Notification Instance. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
};

export default NotificationInstanceDetails;
