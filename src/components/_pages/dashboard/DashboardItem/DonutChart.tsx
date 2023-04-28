import Widget from "components/Widget";
import { EntityType, actions } from "ducks/filters";
import ReactApexChart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchFilterModel } from "types/certificate";
import { DashboardDict } from "types/statisticsDashboard";
import { getLabels, getValues } from "utils/dashboard";

interface Props {
    title: string;
    data?: DashboardDict;
    entity: EntityType;
    redirect: string;
    onSetFilter: (index: number, labels: string[]) => SearchFilterModel[];
}

function DonutChart({ title, data = {}, entity, redirect, onSetFilter: onLegendClick }: Props) {
    const labels = getLabels(data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const options: ApexCharts.ApexOptions = {
        labels,
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

    return (
        <Widget title={<p style={{ fontWeight: 700 }}>{title}</p>}>
            <ReactApexChart options={options} series={getValues(data)} type="donut" height="100%" width="100%" />
        </Widget>
    );
}

export default DonutChart;
