import Spinner from 'components/Spinner';
import { selectors as enumSelectors } from 'ducks/enums';
import { actions as certificatesActions, selectors as certificatesSelectors } from 'ducks/certificates';
import { EntityType } from 'ducks/filters';
import { actions, selectors } from 'ducks/statisticsDashboard';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterConditionOperator, FilterFieldSource } from 'types/openapi';
import {
    getCertificateDonutChartColors,
    getCertificateDonutChartColorsByDaysOfExpiration,
    getDonutChartColorsByRandomNumberOfOptions,
} from 'utils/dashboard';
import { getDateInString } from 'utils/dateUtil';
import CountBadge from './DashboardItem/CountBadge';
import DonutChart from './DashboardItem/DonutChart';
import Switch from 'components/Switch';

function Dashboard() {
    const dashboard = useSelector(selectors.statisticsDashboard);
    const isFetching = useSelector(selectors.isFetching);
    const platformEnums = useSelector(enumSelectors.platformEnums);
    const isIncludeArchived = useSelector(certificatesSelectors.isIncludeArchived);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.getDashboard());
    }, [dispatch, isIncludeArchived]);

    const certificatesStateColorOptions = useMemo(() => {
        return getCertificateDonutChartColors(dashboard?.certificateStatByState);
    }, [dashboard?.certificateStatByState]);

    const certificateComplianceColorOptions = useMemo(() => {
        return getCertificateDonutChartColors(dashboard?.certificateStatByComplianceStatus);
    }, [dashboard?.certificateStatByComplianceStatus]);

    const certificateValidationStatusColorOptions = useMemo(() => {
        return getCertificateDonutChartColors(dashboard?.certificateStatByValidationStatus);
    }, [dashboard?.certificateStatByValidationStatus]);

    const certificateByExpirationDaysColorOptions = useMemo(() => {
        return getCertificateDonutChartColorsByDaysOfExpiration(dashboard?.certificateStatByExpiry);
    }, [dashboard?.certificateStatByExpiry]);

    function isEmpty(obj?: object) {
        return typeof obj === 'object' && Object.keys(obj).length === 0;
    }

    return (
        <div>
            <div className="flex flex-row gap-4 md:gap-8 mb-4 md:mb-8">
                <div className="flex-1">
                    <CountBadge
                        data={dashboard?.totalCertificates}
                        title="Certificates"
                        link="../certificates"
                        extraComponent={
                            <Switch
                                label="Include archived"
                                id="archived-switch"
                                checked={isIncludeArchived}
                                onChange={() => dispatch(certificatesActions.setIncludeArchived(!isIncludeArchived))}
                            />
                        }
                    />
                </div>
                <div className="flex-1">
                    <CountBadge data={dashboard?.totalGroups} title="Groups" link="../groups" />
                </div>
                <div className="flex-1">
                    <CountBadge data={dashboard?.totalDiscoveries} title="Discoveries" link="../discoveries" />
                </div>
                <div className="flex-1">
                    <CountBadge data={dashboard?.totalRaProfiles} title="RA Profiles" link="../raprofiles" />
                </div>
            </div>

            <div className="flex flex-row flex-wrap gap-4 md:gap-8">
                {!isEmpty(dashboard?.certificateStatByState) && (
                    <DonutChart
                        colorOptions={certificatesStateColorOptions}
                        title={'Certificates by State'}
                        data={dashboard?.certificateStatByState}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) => {
                            const certificateStateEnum = platformEnums?.CertificateState;
                            const certificateStateList = Object.keys(certificateStateEnum).map((key) => certificateStateEnum[key]);
                            const selectedCertificateState = certificateStateList.find((status) => status.label === labels[index]);
                            return [
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Equals,
                                    fieldIdentifier: 'CERTIFICATE_STATE',
                                    value: selectedCertificateState?.code ? [selectedCertificateState?.code] : [''],
                                },
                            ];
                        }}
                        redirect="../certificates"
                    />
                )}
                {!isEmpty(dashboard?.certificateStatByValidationStatus) && (
                    <DonutChart
                        colorOptions={certificateValidationStatusColorOptions}
                        title={'Certificates by Validation'}
                        data={dashboard?.certificateStatByValidationStatus}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) => {
                            const certificateValidationStatusEnum = platformEnums?.CertificateValidationStatus;
                            const certificateValidationStatusList = Object.keys(certificateValidationStatusEnum).map(
                                (key) => certificateValidationStatusEnum[key],
                            );
                            const selectedCertificateValidationStatus = certificateValidationStatusList.find(
                                (status) => status.label === labels[index],
                            );
                            return [
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Equals,
                                    fieldIdentifier: 'CERTIFICATE_VALIDATION_STATUS',
                                    value: selectedCertificateValidationStatus?.code ? [selectedCertificateValidationStatus?.code] : [''],
                                },
                            ];
                        }}
                        redirect="../certificates"
                    />
                )}
                {!isEmpty(dashboard?.certificateStatByComplianceStatus) && (
                    <DonutChart
                        title={'Certificates by Compliance'}
                        data={dashboard?.certificateStatByComplianceStatus}
                        colorOptions={certificateComplianceColorOptions}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) => {
                            const complianceStatusEnum = platformEnums?.ComplianceStatus;
                            const complianceStatusList = Object.keys(complianceStatusEnum).map((key) => complianceStatusEnum[key]);
                            const selectedComplianceStatus = complianceStatusList.find((status) => status.label === labels[index]);
                            return [
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Equals,
                                    fieldIdentifier: 'COMPLIANCE_STATUS',
                                    value: selectedComplianceStatus?.code ? [selectedComplianceStatus?.code] : [''],
                                },
                            ];
                        }}
                        redirect="../certificates"
                    />
                )}
                {!isEmpty(dashboard?.certificateStatByType) && (
                    <DonutChart
                        title={'Certificates by Type'}
                        data={dashboard?.certificateStatByType}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(_index, _labels) => []}
                        redirect="../certificates"
                    />
                )}
                {!isEmpty(dashboard?.certificateStatByExpiry) && (
                    <DonutChart
                        colorOptions={certificateByExpirationDaysColorOptions}
                        title={'Certificates by Expiration in Days'}
                        data={dashboard?.certificateStatByExpiry}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) => {
                            if (labels[index] === 'More') {
                                return [
                                    {
                                        fieldSource: FilterFieldSource.Property,
                                        condition: FilterConditionOperator.Greater,
                                        fieldIdentifier: 'NOT_AFTER',
                                        value: JSON.parse(JSON.stringify(getDateInString(90))),
                                    },
                                ];
                            }
                            if (labels[index] === 'Expired') {
                                return [
                                    {
                                        fieldSource: FilterFieldSource.Property,
                                        condition: FilterConditionOperator.Lesser,
                                        fieldIdentifier: 'NOT_AFTER',
                                        value: JSON.parse(JSON.stringify(getDateInString(0))),
                                    },
                                ];
                            }
                            if (labels[index] === 'Not Issued') {
                                return [
                                    {
                                        fieldSource: FilterFieldSource.Property,
                                        condition: FilterConditionOperator.Empty,
                                        fieldIdentifier: 'NOT_AFTER',
                                    },
                                ];
                            }
                            if (labels[index] === '60' || labels[index] === '90') {
                                return [
                                    {
                                        fieldSource: FilterFieldSource.Property,
                                        condition: FilterConditionOperator.Greater,
                                        fieldIdentifier: 'NOT_AFTER',
                                        value: JSON.parse(JSON.stringify(getDateInString(+labels[index] - 30))),
                                    },
                                    {
                                        fieldSource: FilterFieldSource.Property,
                                        condition: FilterConditionOperator.Lesser,
                                        fieldIdentifier: 'NOT_AFTER',
                                        value: JSON.parse(JSON.stringify(getDateInString(+labels[index]))),
                                    },
                                ];
                            }
                            return [
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Greater,
                                    fieldIdentifier: 'NOT_AFTER',
                                    value: JSON.parse(JSON.stringify(getDateInString(+labels[index] - 10))),
                                },
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Lesser,
                                    fieldIdentifier: 'NOT_AFTER',
                                    value: JSON.parse(JSON.stringify(getDateInString(+labels[index]))),
                                },
                            ];
                        }}
                        redirect="../certificates"
                    />
                )}
                {!isEmpty(dashboard?.certificateStatByKeySize) && (
                    <DonutChart
                        title={'Certificates by Key Size'}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                            Object.keys(dashboard?.certificateStatByKeySize ?? {}).length,
                        )}
                        data={dashboard?.certificateStatByKeySize}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) => [
                            {
                                fieldSource: FilterFieldSource.Property,
                                condition: FilterConditionOperator.Equals,
                                fieldIdentifier: 'KEY_SIZE',
                                value: JSON.parse(JSON.stringify(labels[index])),
                            },
                        ]}
                        redirect="../certificates"
                    />
                )}
                {!isEmpty(dashboard?.raProfileStatByCertificateCount) && (
                    <DonutChart
                        title={'Certificates by RA Profile'}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                            Object.keys(dashboard?.raProfileStatByCertificateCount ?? {}).length,
                        )}
                        data={dashboard?.raProfileStatByCertificateCount}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) =>
                            labels[index] === 'Unknown' || labels[index] === 'Unassigned'
                                ? [
                                      {
                                          fieldSource: FilterFieldSource.Property,
                                          condition: FilterConditionOperator.Empty,
                                          fieldIdentifier: 'RA_PROFILE_NAME',
                                          value: JSON.parse(JSON.stringify('')),
                                      },
                                  ]
                                : [
                                      {
                                          fieldSource: FilterFieldSource.Property,
                                          condition: FilterConditionOperator.Equals,
                                          fieldIdentifier: 'RA_PROFILE_NAME',
                                          value: JSON.parse(JSON.stringify(labels[index])),
                                      },
                                  ]
                        }
                        redirect="../certificates"
                    />
                )}
                {!isEmpty(dashboard?.groupStatByCertificateCount) && (
                    <DonutChart
                        title={'Certificates by Group'}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                            Object.keys(dashboard?.groupStatByCertificateCount ?? {}).length,
                        )}
                        data={dashboard?.groupStatByCertificateCount}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) =>
                            labels[index] === 'Unassigned'
                                ? [
                                      {
                                          fieldSource: FilterFieldSource.Property,
                                          condition: FilterConditionOperator.Empty,
                                          fieldIdentifier: 'GROUP_NAME',
                                          value: JSON.parse(JSON.stringify('')),
                                      },
                                  ]
                                : [
                                      {
                                          fieldSource: FilterFieldSource.Property,
                                          condition: FilterConditionOperator.Equals,
                                          fieldIdentifier: 'GROUP_NAME',
                                          value: JSON.parse(JSON.stringify(labels[index])),
                                      },
                                  ]
                        }
                        redirect="../certificates"
                    />
                )}
                {!isEmpty(dashboard?.certificateStatBySubjectType) && (
                    <DonutChart
                        title={'Certificates by Subject type'}
                        data={dashboard?.certificateStatBySubjectType}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) => {
                            const certificateSubjectTypeEnum = platformEnums?.CertificateSubjectType;
                            const certificateSubjectTypeList = Object.keys(certificateSubjectTypeEnum).map(
                                (key) => certificateSubjectTypeEnum[key],
                            );
                            const selectedCertificateSubjectType = certificateSubjectTypeList.find(
                                (status) => status.label === labels[index],
                            );
                            return [
                                {
                                    fieldSource: FilterFieldSource.Property,
                                    condition: FilterConditionOperator.Equals,
                                    fieldIdentifier: 'SUBJECT_TYPE',
                                    value: selectedCertificateSubjectType?.code ? [selectedCertificateSubjectType?.code] : [''],
                                },
                            ];
                        }}
                        redirect="../certificates"
                    />
                )}
            </div>

            <Spinner active={isFetching || dashboard === null} />
        </div>
    );
}

export default Dashboard;
