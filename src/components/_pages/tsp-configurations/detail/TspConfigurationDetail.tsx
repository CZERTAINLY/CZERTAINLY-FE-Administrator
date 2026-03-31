import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';

import Breadcrumb from 'components/Breadcrumb';
import Container from 'components/Container';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';

import { actions, selectors } from 'ducks/tsp-configurations';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { PlatformEnum, Resource } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { createWidgetDetailHeaders } from 'utils/widget';

export const TspConfigurationDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { id } = useParams();

    const tspConfiguration = useSelector(selectors.tspConfiguration);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);
    const isDisabling = useSelector(selectors.isDisabling);
    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const isBusy = useMemo(
        () => isFetchingDetail || isDeleting || isEnabling || isDisabling,
        [isFetchingDetail, isDeleting, isEnabling, isDisabling],
    );

    const getFreshData = useCallback(() => {
        if (!id) return;
        dispatch(actions.getTspConfiguration({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const onEditClick = useCallback(() => {
        if (!tspConfiguration) return;
        navigate(`../${Resource.TspConfigurations.toLowerCase()}/edit/${tspConfiguration.uuid}`);
    }, [tspConfiguration, navigate]);

    const onEnableClick = useCallback(() => {
        if (!tspConfiguration) return;
        dispatch(actions.enableTspConfiguration({ uuid: tspConfiguration.uuid }));
    }, [tspConfiguration, dispatch]);

    const onDisableClick = useCallback(() => {
        if (!tspConfiguration) return;
        dispatch(actions.disableTspConfiguration({ uuid: tspConfiguration.uuid }));
    }, [tspConfiguration, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        if (!tspConfiguration) return;
        dispatch(actions.deleteTspConfiguration({ uuid: tspConfiguration.uuid }));
        setConfirmDelete(false);
    }, [tspConfiguration, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: onEditClick,
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
            {
                icon: 'check',
                disabled: tspConfiguration?.enabled ?? true,
                tooltip: 'Enable',
                onClick: onEnableClick,
            },
            {
                icon: 'times',
                disabled: !(tspConfiguration?.enabled ?? false),
                tooltip: 'Disable',
                onClick: onDisableClick,
            },
        ],
        [tspConfiguration, onEditClick, onEnableClick, onDisableClick],
    );

    const tableHeader: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(
        () =>
            !tspConfiguration
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', tspConfiguration.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', tspConfiguration.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', tspConfiguration.description || ''],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={tspConfiguration.enabled} />],
                      },
                      {
                          id: 'signingUrl',
                          columns: [
                              'TSP Service URL',
                              tspConfiguration.signingUrl ? (
                                  <a href={tspConfiguration.signingUrl} target="_blank" rel="noreferrer">
                                      {tspConfiguration.signingUrl}
                                  </a>
                              ) : (
                                  'N/A'
                              ),
                          ],
                      },
                  ],
        [tspConfiguration],
    );

    const signingProfileData: TableDataRow[] = useMemo(
        () =>
            !tspConfiguration?.defaultSigningProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', tspConfiguration.defaultSigningProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: [
                              'Name',
                              <Link
                                  to={`../../${Resource.SigningProfiles.toLowerCase()}/detail/${tspConfiguration.defaultSigningProfile.uuid}`}
                              >
                                  {tspConfiguration.defaultSigningProfile.name}
                              </Link>,
                          ],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={tspConfiguration.defaultSigningProfile.enabled} />],
                      },
                  ],
        [tspConfiguration],
    );

    const signingProfileTitle = useMemo(
        () => (signingProfileData.length > 0 ? 'Default Signing Profile' : 'Default Signing Profile not assigned'),
        [signingProfileData],
    );

    return (
        <div>
            <Breadcrumb
                items={[
                    {
                        label: `${getEnumLabel(resourceEnum, Resource.TspConfigurations)} Inventory`,
                        href: `/${Resource.TspConfigurations.toLowerCase()}`,
                    },
                    { label: tspConfiguration?.name || 'TSP Configuration Details', href: '' },
                ]}
            />

            <Widget widgetLockName={LockWidgetNameEnum.TspConfigurationDetails} busy={isBusy} noBorder>
                <Container>
                    <Container className="md:grid grid-cols-2 items-start">
                        <Widget title="TSP Configuration Details" widgetButtons={buttons} titleSize="large" refreshAction={getFreshData}>
                            <CustomTable headers={tableHeader} data={detailData} />
                        </Widget>

                        {tspConfiguration && (
                            <CustomAttributeWidget
                                resource={Resource.TspConfigurations}
                                resourceUuid={tspConfiguration.uuid}
                                attributes={tspConfiguration.customAttributes}
                            />
                        )}
                    </Container>

                    <Widget title={signingProfileTitle} titleSize="large">
                        {signingProfileData.length > 0 && <CustomTable headers={tableHeader} data={signingProfileData} />}
                    </Widget>
                </Container>
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete TSP Configuration"
                body="You are about to delete this TSP Configuration. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage.length > 0}
                caption="Delete TSP Configuration"
                body={
                    <>
                        Failed to delete the TSP Configuration. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(actions.clearDeleteErrorMessages())}
                buttons={[
                    {
                        color: 'secondary',
                        variant: 'outline',
                        onClick: () => dispatch(actions.clearDeleteErrorMessages()),
                        body: 'Close',
                    },
                ]}
            />
        </div>
    );
};
