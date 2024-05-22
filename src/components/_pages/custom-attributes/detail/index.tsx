import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/customAttributes';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Badge, Container } from 'reactstrap';
import { AttributeContentType, PlatformEnum } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { getAttributeContent } from 'utils/attributes/attributes';
import cx from 'classnames';
import { actions as alertActions } from 'ducks/alerts';
import styles from './customAttribute.module.scss';
import { BaseAttributeContentModel } from 'types/attributes';

export default function CustomAttributeDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const customAttribute = useSelector(selectors.customAttribute);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isEnabling = useSelector(selectors.isEnabling);
    const isDisabling = useSelector(selectors.isDisabling);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const attributeContentTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AttributeContentType));

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const getFreshCustomAttribute = useCallback(() => {
        if (!id) return;
        dispatch(actions.getCustomAttribute(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (!customAttribute || id !== customAttribute.uuid) {
            getFreshCustomAttribute();
        }
    }, [getFreshCustomAttribute, id, customAttribute]);

    const onEditClick = useCallback(() => {
        navigate(`../../edit/${customAttribute?.uuid}`, { relative: 'path' });
    }, [customAttribute, navigate]);

    const onDeleteConfirmed = useCallback(() => {
        if (!customAttribute) return;
        dispatch(actions.deleteCustomAttribute(customAttribute.uuid));
        setConfirmDelete(false);
    }, [customAttribute, dispatch]);

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
            {
                icon: customAttribute?.enabled ? 'times' : 'check',
                disabled: !customAttribute || isEnabling || isDisabling,
                tooltip: customAttribute?.enabled ? 'Disable' : 'Enable',
                onClick: () =>
                    customAttribute?.enabled
                        ? dispatch(actions.disableCustomAttribute(customAttribute?.uuid))
                        : customAttribute
                          ? dispatch(actions.enableCustomAttribute(customAttribute?.uuid))
                          : {},
            },
        ],
        [onEditClick, customAttribute, dispatch, isDisabling, isEnabling],
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

    const getBadge = (property: boolean | undefined, label: string) =>
        property ? (
            <Badge style={{ margin: '1px' }} color="success">
                {label}
            </Badge>
        ) : (
            <></>
        );

    const onContentCopyClick = useCallback(() => {
        if (!customAttribute) return;
        let textToCopy = '';

        console.log('customAttribute.content', customAttribute.content);
        if (!customAttribute?.content?.length) return;
        if (customAttribute.content.length > 1) textToCopy = customAttribute.content?.map((content) => content.data).join(', ');
        if (customAttribute.content.length === 1) textToCopy = customAttribute.content[0].data.toString();

        navigator.clipboard
            .writeText(textToCopy)
            .then(() => dispatch?.(alertActions.success?.('Custom Attribute content was copied to clipboard')))
            .catch(() => dispatch?.(alertActions.error?.('Failed to Custom Attribute content to clipboard')));
    }, [customAttribute, dispatch]);

    const detailData: TableDataRow[] = useMemo(
        () =>
            !customAttribute
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', customAttribute.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', customAttribute.name],
                      },
                      {
                          id: 'label',
                          columns: ['Label', customAttribute.label],
                      },
                      {
                          id: 'description',
                          columns: ['Description', customAttribute.description],
                      },
                      {
                          id: 'group',
                          columns: ['Group', customAttribute.group ?? ''],
                      },
                      {
                          id: 'resources',
                          columns: [
                              'Resources',
                              customAttribute.resources?.map((r, i) => (
                                  <Badge key={i} style={{ margin: '1px' }} color="secondary">
                                      {getEnumLabel(resourceEnum, r)}
                                  </Badge>
                              )) ?? '',
                          ],
                      },
                      {
                          id: 'contentType',
                          columns: ['Content Type', getEnumLabel(attributeContentTypeEnum, customAttribute.contentType)],
                      },
                      {
                          id: 'content',
                          columns: [
                              'Content',
                              <>
                                  {getAttributeContent(customAttribute.contentType, customAttribute.content)}
                                  {customAttribute?.content?.length ? (
                                      <i className={cx('fa fa-copy', styles.copyCustomContentButton)} onClick={onContentCopyClick} />
                                  ) : (
                                      <> </>
                                  )}
                              </>,
                          ],
                      },
                      {
                          id: 'properties',
                          columns: [
                              'Properties',
                              <>
                                  <StatusBadge style={{ margin: '1px' }} enabled={customAttribute.enabled} />
                                  {getBadge(customAttribute.visible, 'Visible')}
                                  {getBadge(customAttribute.required, 'Required')}
                                  {getBadge(customAttribute.readOnly, 'Read Only')}
                                  {getBadge(customAttribute.list, 'List')}
                                  {getBadge(customAttribute.multiSelect, 'Multi Select')}
                              </>,
                          ],
                      },
                  ],
        [customAttribute, attributeContentTypeEnum, resourceEnum, onContentCopyClick],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Custom Attribute Details"
                busy={isFetchingDetail || isEnabling || isDisabling}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshCustomAttribute}
                widgetLockName={LockWidgetNameEnum.CustomAttributeDetails}
            >
                <CustomTable headers={detailHeaders} data={detailData} />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Custom Attribute"
                body="You are about to delete an Custom Attribute. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
