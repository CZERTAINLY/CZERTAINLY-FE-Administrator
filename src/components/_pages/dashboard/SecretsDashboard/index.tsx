import Spinner from 'components/Spinner';
import { selectors as enumSelectors } from 'ducks/enums';
import { actions, selectors } from 'ducks/statisticsDashboard';
import { EntityType } from 'ducks/filters';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterConditionOperator, FilterFieldSource } from 'types/openapi';
import { getDonutChartColorsByRandomNumberOfOptions, getCertificateDonutChartColors } from 'utils/dashboard';
import CountBadge from '../DashboardItem/CountBadge';
import DonutChart from '../DashboardItem/DonutChart';

function SecretsDashboard() {
    const dashboard = useSelector(selectors.statisticsDashboard);
    const isFetching = useSelector(selectors.isFetching);
    const platformEnums = useSelector(enumSelectors.platformEnums);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.getDashboard());
    }, [dispatch]);

    const secretStateColorOptions = useMemo(() => {
        return getCertificateDonutChartColors(dashboard?.secretStatByState);
    }, [dashboard?.secretStatByState]);

    const secretComplianceColorOptions = useMemo(() => {
        return getCertificateDonutChartColors(dashboard?.secretStatByComplianceStatus);
    }, [dashboard?.secretStatByComplianceStatus]);

    function isEmpty(obj?: object) {
        return typeof obj === 'object' && Object.keys(obj).length === 0;
    }

    return (
        <div>
            <div className="flex flex-row gap-4 md:gap-8 mb-4 md:mb-8 flex-wrap" data-testid="secrets-dashboard-counts">
                <div className="flex-1">
                    <CountBadge data={dashboard?.totalSecrets} title="Secrets" link="../secrets" />
                </div>
                <div className="flex-1">
                    <CountBadge data={dashboard?.totalVaultInstances} title="Vaults" link="../vaults" />
                </div>
                <div className="flex-1">
                    <CountBadge data={dashboard?.totalVaultProfiles} title="Vault Profiles" link="../vaultprofiles" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8" data-testid="secrets-dashboard-charts">
                {!isEmpty(dashboard?.secretStatByState) && (
                    <DonutChart
                        colorOptions={secretStateColorOptions}
                        title={'Secrets by State'}
                        data={dashboard?.secretStatByState}
                        entity={EntityType.SECRET}
                        onSetFilter={(index, labels) => {
                            const secretStateEnum = platformEnums?.SecretState;
                            const secretStateList = Object.keys(secretStateEnum).map((key) => secretStateEnum[key]);
                            const selectedSecretState = secretStateList.find((status) => status.label === labels[index]);
                            return [
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Equals,
                                    fieldIdentifier: 'SECRET_STATE',
                                    value: selectedSecretState?.code ? [selectedSecretState.code] : [''],
                                },
                            ];
                        }}
                        redirect="../secrets"
                    />
                )}
                {!isEmpty(dashboard?.secretStatByType) && (
                    <DonutChart
                        title={'Secrets by Type'}
                        data={dashboard?.secretStatByType}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(Object.keys(dashboard?.secretStatByType ?? {}).length)}
                        entity={EntityType.SECRET}
                        onSetFilter={(index, labels) => {
                            const secretTypeEnum = platformEnums?.SecretType;
                            const secretTypeList = Object.keys(secretTypeEnum).map((key) => secretTypeEnum[key]);
                            const selectedSecretType = secretTypeList.find((type) => type.label === labels[index]);
                            return [
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Equals,
                                    fieldIdentifier: 'SECRET_TYPE',
                                    value: selectedSecretType?.code ? [selectedSecretType.code] : [''],
                                },
                            ];
                        }}
                        redirect="../secrets"
                    />
                )}
                {!isEmpty(dashboard?.secretStatByComplianceStatus) && (
                    <DonutChart
                        title={'Secrets by Compliance'}
                        data={dashboard?.secretStatByComplianceStatus}
                        colorOptions={secretComplianceColorOptions}
                        entity={EntityType.SECRET}
                        onSetFilter={(index, labels) => {
                            const complianceStatusEnum = platformEnums?.ComplianceStatus;
                            const complianceStatusList = Object.keys(complianceStatusEnum).map((key) => complianceStatusEnum[key]);
                            const selectedComplianceStatus = complianceStatusList.find((status) => status.label === labels[index]);
                            return [
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Equals,
                                    fieldIdentifier: 'SECRET_COMPLIANCE_STATUS',
                                    value: selectedComplianceStatus?.code ? [selectedComplianceStatus.code] : [''],
                                },
                            ];
                        }}
                        redirect="../secrets"
                    />
                )}
                {!isEmpty(dashboard?.secretStatByVaultProfile) && (
                    <DonutChart
                        title={'Secrets by Vault Profile'}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                            Object.keys(dashboard?.secretStatByVaultProfile ?? {}).length,
                        )}
                        data={dashboard?.secretStatByVaultProfile}
                        entity={EntityType.SECRET}
                        onSetFilter={(index, labels) =>
                            labels[index] === 'Unknown' || labels[index] === 'Unassigned'
                                ? [
                                      {
                                          fieldSource: FilterFieldSource.Property,
                                          condition: FilterConditionOperator.Empty,
                                          fieldIdentifier: 'SECRET_SOURCE_VAULT_PROFILE',
                                          value: [''],
                                      },
                                  ]
                                : [
                                      {
                                          fieldSource: FilterFieldSource.Property,
                                          condition: FilterConditionOperator.Equals,
                                          fieldIdentifier: 'SECRET_SOURCE_VAULT_PROFILE',
                                          value: [labels[index]],
                                      },
                                  ]
                        }
                        redirect="../secrets"
                    />
                )}
                {!isEmpty(dashboard?.secretStatByGroup) && (
                    <DonutChart
                        title={'Secrets by Group'}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(Object.keys(dashboard?.secretStatByGroup ?? {}).length)}
                        data={dashboard?.secretStatByGroup}
                        entity={EntityType.SECRET}
                        onSetFilter={(index, labels) =>
                            labels[index] === 'Unassigned'
                                ? [
                                      {
                                          fieldSource: FilterFieldSource.Property,
                                          condition: FilterConditionOperator.Empty,
                                          fieldIdentifier: 'GROUP_NAME',
                                          value: [''],
                                      },
                                  ]
                                : [
                                      {
                                          fieldSource: FilterFieldSource.Property,
                                          condition: FilterConditionOperator.Equals,
                                          fieldIdentifier: 'GROUP_NAME',
                                          value: [labels[index]],
                                      },
                                  ]
                        }
                        redirect="../secrets"
                    />
                )}
            </div>

            <Spinner active={isFetching || dashboard === null} />
        </div>
    );
}

export default SecretsDashboard;
