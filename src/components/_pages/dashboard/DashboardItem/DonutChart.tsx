import Widget from "components/Widget";
import { EntityType, actions } from "ducks/filters";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchFilterModel } from "types/certificate";
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
} from "types/openapi";
import { DashboardDict } from "types/statisticsDashboard";
import { useGetStatusText } from "utils/certificate";
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
    const getStatusText = useGetStatusText();

    const [enumsLabel, setEnumsLabel] = useState<string[]>([]);

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
