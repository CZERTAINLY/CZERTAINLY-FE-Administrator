import Widget from 'components/Widget';
import { EntityType, actions } from 'ducks/filters';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
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
            type: 'solid',
        },
        dataLabels: {
            enabled: false,
            formatter: function (val: any, opts: any) {
                return opts.w.config.series[opts.seriesIndex];
            },
        },
        chart: {
            width: 100,
            height: 100,
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: -40,
                tools: {
                    download:
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>',
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
        legend: {
            show: true,
            fontSize: '16px',
            fontWeight: 500,
            // labels: {
            //   colors: '#e5e7eb',   // tailwind slate-200-ish
            // },
            markers: {
                size: 4,
                offsetX: -10,
            },
        },
        tooltip: {
            marker: {
                show: true,
            },
        },
    };

    if (colorOptions) {
        options.colors = colorOptions.colors;
    }

    return (
        <Widget title={title} titleBoldness="bold" className="flex-1 w-1/2 lg:w-1/3 xl:w-1/4">
            <ReactApexChart options={options} series={getValues(data)} type="donut" height="100%" width="100%" />
        </Widget>
    );
}

export default DonutChart;
