import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import React, { useCallback, useMemo } from 'react';
import { JwkModel } from 'types/auth-settings';

type Props = {
    jwkSetKeys?: JwkModel[];
};

const JwkSetKeysTable = ({ jwkSetKeys }: Props) => {
    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'kid',
                content: 'Key ID',
            },
            {
                id: 'type',
                content: 'Key Type',
            },
            {
                id: 'algorithm',
                content: 'Algorithm',
            },
        ],
        [],
    );
    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'kid',
                content: 'Property',
            },
            {
                id: 'algorithm',
                content: 'Value',
            },
        ],
        [],
    );

    const createDetailDataForTable = useCallback((jwkKeySet: JwkModel): TableDataRow[] => {
        return [
            {
                id: 'kid',
                columns: ['Key ID', jwkKeySet.kid],
            },
            {
                id: 'type',
                columns: ['Key Type', jwkKeySet.keyType ?? ''],
            },
            {
                id: 'use',
                columns: ['Key Use', jwkKeySet.use ?? ''],
            },
            {
                id: 'algorithm',
                columns: ['Algorithm', jwkKeySet.algorithm ?? ''],
            },
            {
                id: 'value',
                columns: [
                    'Base64 Encoded Value',
                    <span
                        key="value"
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            wordBreak: 'break-all',
                        }}
                    >
                        {jwkKeySet.publicKey}
                    </span>,
                ],
            },
        ];
    }, []);

    const data: TableDataRow[] = useMemo(
        () =>
            !jwkSetKeys
                ? []
                : jwkSetKeys.map(
                      (key) =>
                          ({
                              id: key.kid,
                              columns: [key.kid, key.keyType, key.algorithm],
                              detailColumns: [
                                  <></>,
                                  <CustomTable
                                      key="details"
                                      hasHeader={false}
                                      headers={detailHeaders}
                                      data={createDetailDataForTable(key)}
                                  />,
                              ],
                          }) as TableDataRow,
                  ),
        [jwkSetKeys, createDetailDataForTable, detailHeaders],
    );
    return <CustomTable hasDetails={true} headers={headers} data={data} />;
};

export default JwkSetKeysTable;
