import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';

import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from 'ducks/utilsActuator';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsPlatformModel } from 'types/settings';
import { CheckCircle, AlertCircle } from 'lucide-react';

type Props = {
    platformSettings?: SettingsPlatformModel;
};

const UtilsSettings = ({ platformSettings }: Props) => {
    const dispatch = useDispatch();

    const health = useSelector(utilsActuatorSelectors.health);

    useEffect(() => {
        dispatch(utilsActuatorActions.health());
    }, [dispatch, platformSettings]);

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
                              platformSettings.utils?.utilsServiceUrl ? (
                                  <>
                                      {platformSettings.utils.utilsServiceUrl}&nbsp;
                                      {health ? (
                                          <CheckCircle size={16} style={{ color: 'green' }} aria-hidden="true" />
                                      ) : (
                                          <AlertCircle size={16} style={{ color: 'red' }} aria-hidden="true" />
                                      )}
                                  </>
                              ) : (
                                  'n/a'
                              ),
                          ],
                      },
                  ],
        [platformSettings, health],
    );

    return (
        <div style={{ paddingTop: '1.5em', paddingBottom: '1.5em' }}>
            <CustomTable headers={headers} data={data} />
        </div>
    );
};

export default UtilsSettings;
