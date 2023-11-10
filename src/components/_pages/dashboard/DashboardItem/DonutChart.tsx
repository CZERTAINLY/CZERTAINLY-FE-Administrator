import Widget from "components/Widget";
import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
import { EntityType, actions } from "ducks/filters";
import { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchFilterModel } from "types/certificate";
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
    PlatformEnum,
} from "types/openapi";
import { DashboardDict } from "types/statisticsDashboard";
import { capitalize } from "utils/common-utils";
import { getLabels, getValues } from "utils/dashboard";

export interface ColorOptions {
    colors: string[];
}

type Status =
    | CertificateState
    | CertificateValidationStatus
    | CertificateEventHistoryDtoStatusEnum
    | ComplianceStatus
    | ComplianceRuleStatus;
interface Props {
    title: string;
    data?: DashboardDict;
    entity: EntityType;
    redirect: string;
    onSetFilter: (index: number, labels: string[]) => SearchFilterModel[];
    colorOptions?: ColorOptions;
}

function DonutChart({ title, colorOptions, data = {}, entity, redirect, onSetFilter: onLegendClick }: Props) {
    const labels = getLabels(data);

    const [enumsLabel, setEnumsLabel] = useState<string[]>([]);

    const certificateStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateState));
    const certificateValidationStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateValidationStatus));
    const complianceStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceStatus));
    const complianceRuleStatusEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ComplianceRuleStatus));

    const getStatusText = useCallback(
        (
            status:
                | CertificateState
                | CertificateValidationStatus
                | CertificateEventHistoryDtoStatusEnum
                | ComplianceStatus
                | ComplianceRuleStatus,
        ) => {
            switch (status) {
                case CertificateValidationStatus.Valid:
                    return getEnumLabel(certificateStatusEnum, CertificateValidationStatus.Valid);
                case CertificateValidationStatus.Invalid:
                    return getEnumLabel(certificateStatusEnum, CertificateValidationStatus.Invalid);
                case CertificateValidationStatus.Expiring:
                    return getEnumLabel(certificateStatusEnum, CertificateValidationStatus.Expiring);
                case CertificateValidationStatus.Expired:
                    return getEnumLabel(certificateStatusEnum, CertificateValidationStatus.Expired);
                case CertificateValidationStatus.Revoked:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Revoked);
                case CertificateValidationStatus.NotChecked:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.NotChecked);
                case CertificateValidationStatus.Inactive:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Inactive);
                case CertificateValidationStatus.Failed:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateValidationStatus.Failed);

                case CertificateState.Revoked:
                    return getEnumLabel(certificateStatusEnum, status);
                case CertificateState.Archived:
                    return getEnumLabel(certificateStatusEnum, CertificateState.Archived);
                case CertificateState.Requested:
                    return getEnumLabel(certificateStatusEnum, CertificateState.Requested);
                case CertificateState.Rejected:
                    return getEnumLabel(certificateStatusEnum, CertificateState.Rejected);
                case CertificateState.Issued:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateState.Issued);
                case CertificateState.PendingIssue:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateState.PendingIssue);
                case CertificateState.PendingRevoke:
                    return getEnumLabel(certificateValidationStatusEnum, CertificateState.PendingRevoke);

                case CertificateEventHistoryDtoStatusEnum.Success:
                    return "Success";
                case CertificateEventHistoryDtoStatusEnum.Failed:
                    return "Failed";

                case ComplianceStatus.Ok:
                    return getEnumLabel(complianceStatusEnum, ComplianceStatus.Ok);
                case ComplianceStatus.Nok:
                    return getEnumLabel(complianceStatusEnum, ComplianceStatus.Nok);
                case ComplianceStatus.Na:
                    return getEnumLabel(complianceStatusEnum, ComplianceStatus.Na);
                case ComplianceRuleStatus.Ok:
                    return getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Ok);
                case ComplianceRuleStatus.Nok:
                    return getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Nok);
                case ComplianceRuleStatus.Na:
                    return getEnumLabel(complianceRuleStatusEnum, ComplianceRuleStatus.Na);

                default:
                    return "NOT_APPLICABLE";
            }
        },
        [certificateStatusEnum, certificateValidationStatusEnum, complianceStatusEnum, complianceRuleStatusEnum],
    );

    useEffect(() => {
        let enumsLabel = [];
        enumsLabel = labels.map((labels) => {
            let enumLabel = getStatusText(labels as Status) !== "NOT_APPLICABLE" ? getStatusText(labels as Status) : labels;
            return capitalize(enumLabel);
        });
        setEnumsLabel(enumsLabel);
    }, [labels]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const options: ApexCharts.ApexOptions = {
        labels: enumsLabel,
        fill: {
            type: "gradient",
        },
        dataLabels: {
            formatter: function (val: any, opts: any) {
                return opts.w.config.series[opts.seriesIndex];
            },
        },
        chart: {
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: -40,
                tools: {
                    download: true,
                },
            },
            events: {
                legendClick(_chart: any, index: any, _options: any) {
                    dispatch(
                        actions.setCurrentFilters({ entity, currentFilters: index !== undefined ? onLegendClick(index, labels) : [] }),
                    );
                    navigate(redirect);
                },
            },
        },
    };

    if (colorOptions) {
        options.colors = colorOptions.colors;
    }

    return (
        <Widget title={title} titleBoldness="bold">
            <ReactApexChart options={options} series={getValues(data)} type="donut" height="100%" width="100%" />
        </Widget>
    );
}

export default DonutChart;
