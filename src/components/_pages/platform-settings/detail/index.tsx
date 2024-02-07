import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import TabLayout from 'components/Layout/TabLayout';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/settings';
import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Container } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function PlatformSettingsDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const platformSettings = useSelector(selectors.platformSettings);
    const isFetchingPlatform = useSelector(selectors.isFetchingPlatform);

    const health = useSelector(utilsActuatorSelectors.health);

    const getFreshData = useCallback(() => {
        dispatch(utilsActuatorActions.health());
        if (!platformSettings) {
            dispatch(actions.getPlatformSettings());
        }
    }, [dispatch, platformSettings]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    useEffect(() => {
        if (!platformSettings) {
            dispatch(actions.getPlatformSettings());
        }
    }, [dispatch, platformSettings]);

    const onEditClick = useCallback(() => {
        navigate(`./edit`);
    }, [navigate]);

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
        ],
        [onEditClick],
    );

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'setting',
                content: 'Setting',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const data: TableDataRow[] = useMemo(
        () =>
            !platformSettings
                ? []
                : [
                      {
                          id: 'utilsUrl',
                          columns: [
                              'Utils Service URL',
                              (
                                  <>
                                      {platformSettings.utils.utilsServiceUrl}&nbsp;
                                      {health ? (
                                          <i className="fa fa-check-circle" style={{ color: 'green' }} aria-hidden="true" />
                                      ) : (
                                          <i className="fa fa-exclamation-circle" style={{ color: 'red' }} aria-hidden="true" />
                                      )}
                                  </>
                              ) ?? 'n/a',
                          ],
                      },
                  ],
        [platformSettings, health],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Platform Settings"
                busy={isFetchingPlatform}
                widgetLockName={LockWidgetNameEnum.PlatformSettings}
                widgetButtons={buttons}
                titleSize="large"
                refreshAction={getFreshData}
            >
                <TabLayout
                    tabs={[
                        {
                            title: 'Utils',
                            content: (
                                <div style={{ paddingTop: '1.5em', paddingBottom: '1.5em' }}>
                                    <CustomTable headers={headers} data={data} />
                                </div>
                            ),
                        },
                    ]}
                />
            </Widget>
        </Container>
    );
}
