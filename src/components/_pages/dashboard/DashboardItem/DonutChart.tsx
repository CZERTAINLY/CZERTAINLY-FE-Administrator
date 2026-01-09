import Widget from 'components/Widget';
import { EntityType, actions } from 'ducks/filters';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import SimpleBar from 'simplebar-react';
import { SearchFilterModel } from 'types/certificate';
import { DashboardDict } from 'types/statisticsDashboard';
import { getValues, useGetLabels, getDefaultColors } from 'utils/dashboard';

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
                show: false,
            },
        },
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
            },
        },
        tooltip: {
            enabled: true,
            custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                const label = w.globals.labels[seriesIndex];
                const value = series[seriesIndex];
                const color = w.globals.colors[seriesIndex];

                return `
                    <div class="py-1 px-2 bg-[var(--tooltip-background-color)] text-xs font-medium text-white shadow-2xs dark:bg-neutral-700 border-[var(--tooltip-background-color)]">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full" style="background-color: ${color}"></div>
                            <span>${label}: ${value}</span>
                        </div>
                    </div>
                `;
            },
            style: {
                fontSize: '14px',
                fontFamily: 'inherit',
            },
            theme: 'light',
            cssClass: 'apexcharts-custom-tooltip',
        },
        markers: {
            size: 4,
            hover: {
                sizeOffset: 0,
            },
        },
        states: {
            active: {
                filter: {
                    type: 'none',
                },
            },
        },
    };

    if (colorOptions) {
        options.colors = colorOptions.colors;
    }

    const values = getValues(data);
    const chartLabels = useGetLabels(data);
    const chartColors = colorOptions?.colors || getDefaultColors();

    return (
        <Widget title={title} titleBoldness="bold" className="flex-1">
            <div className="flex align-center justify-center h-full">
                <div className="flex-shrink-0 pr-[30px]">
                    <ReactApexChart options={options} series={values} type="donut" height={110} width={110} />
                </div>
                <SimpleBar forceVisible="y" style={{ height: '130px', width: 'calc(100% - 140px)' }}>
                    <div className="flex-1 flex justify-end">
                        <div className="space-y-1.5 h-full max-w-[140px] overflow-y-auto">
                            {chartLabels.map((label, index) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => {
                                        dispatch(actions.setCurrentFilters({ entity, currentFilters: onLegendClick(index, chartLabels) }));
                                        navigate(redirect);
                                    }}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: chartColors[index] || '#6B7280' }}
                                    />
                                    <span className="text-md text-one-row-ellipsis">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </SimpleBar>
            </div>
        </Widget>
    );
}

export default DonutChart;
