import Widget from 'components/Widget';
import { EntityType, actions } from 'ducks/filters';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SearchFilterModel } from 'types/certificate';
import { DashboardDict } from 'types/statisticsDashboard';
import { getValues, useGetLabels } from 'utils/dashboard';

export interface ColorOptions {
    colors: string[];
}

interface Props {
    title: string;
    data?: DashboardDict;
    entity: EntityType;
    redirect: string;
    onSetFilter: (index: number, labels: string[]) => SearchFilterModel[];
    colorOptions?: ColorOptions;
}

function DonutChart({ title, colorOptions, data = {}, entity, redirect, onSetFilter: onLegendClick }: Props) {
    const labels = useGetLabels(data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const options: ApexCharts.ApexOptions = {
        labels: labels,
        fill: {
            type: 'gradient',
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
