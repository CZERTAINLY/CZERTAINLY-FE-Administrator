import { Col, Container, Row } from 'reactstrap';

import Spinner from 'components/Spinner';
import { selectors as enumSelectors } from 'ducks/enums';
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

function Dashboard() {
    const dashboard = useSelector(selectors.statisticsDashboard);
    const isFetching = useSelector(selectors.isFetching);
    const platformEnums = useSelector(enumSelectors.platformEnums);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.getDashboard());
    }, [dispatch]);

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

    return (
        <Container className="themed-container" fluid={true}>
            <Row>
                <Col>
                    <CountBadge data={dashboard?.totalCertificates} title="Certificates" link="../certificates" />
                </Col>

                <Col>
                    <CountBadge data={dashboard?.totalGroups} title="Groups" link="../groups" />
                </Col>

                <Col>
                    <CountBadge data={dashboard?.totalDiscoveries} title="Discoveries" link="../discoveries" />
                </Col>

                <Col>
                    <CountBadge data={dashboard?.totalRaProfiles} title="RA Profiles" link="../raprofiles" />
                </Col>
            </Row>

            <Row xs="1" sm="1" md="2" lg="2" xl="3">
                <Col>
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
                </Col>

                <Col>
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
                </Col>

                <Col>
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
                </Col>

                <Col>
                    <DonutChart
                        title={'Certificates by Type'}
                        data={dashboard?.certificateStatByType}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(_index, _labels) => []}
                        redirect="../certificates"
                    />
                </Col>

                <Col>
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
                </Col>

                <Col>
                    <DonutChart
                        title={'Certificates by Key Size'}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                            Object.keys(dashboard?.certificateStatByKeySize || {}).length,
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
                </Col>

                <Col>
                    <DonutChart
                        title={'Certificates by RA Profile'}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                            Object.keys(dashboard?.raProfileStatByCertificateCount || {}).length,
                        )}
                        data={dashboard?.raProfileStatByCertificateCount}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(index, labels) =>
                            labels[index] === 'Unknown'
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
                </Col>

                <Col>
                    <DonutChart
                        title={'Certificates by Group'}
                        colorOptions={getDonutChartColorsByRandomNumberOfOptions(
                            Object.keys(dashboard?.groupStatByCertificateCount || {}).length,
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
                </Col>

                <Col>
                    <DonutChart
                        title={'Certificates by Constraints'}
                        data={dashboard?.certificateStatByBasicConstraints}
                        entity={EntityType.CERTIFICATE}
                        onSetFilter={(_index, _labels) => []}
                        redirect="../certificates"
                    />
                </Col>
            </Row>

            <Spinner active={isFetching || dashboard === null} />
        </Container>
    );
}

export default Dashboard;
