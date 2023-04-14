import Widget from "components/Widget";
import ReactApexChart from "react-apexcharts";
import { DashboardDict } from "types/statisticsDashboard";
import { getDefaultColors, getLabels, getValues } from "utils/dashboard";

interface Props {
    data?: DashboardDict;
}

function CertificateByGroupChart({ data }: Props) {
    const getOptions = (data: DashboardDict): any => {
        let value = {
            labels: getLabels(data),
            colors: getDefaultColors(),
            theme: {
                mode: "light",
                //palette: "palette10",
                monochrome: {
                    enabled: false,
                    color: "#e31e25",
                    shadeTo: "light",
                    shadeIntensity: 0.8,
                },
            },
            fill: {
                type: "gradient",
            },
            dataLabels: {
                formatter: function (val: any, opts: any) {
                    return opts.w.config.series[opts.seriesIndex];
                },
            },
            legend: {
                width: 150,
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
                export: {
                    csv: {
                        filename: undefined,
                        columnDelimiter: ",",
                        headerCategory: "category",
                        headerValue: "value",
                    },
                    svg: {
                        filename: undefined,
                    },
                    png: {
                        filename: undefined,
                    },
                },
            },
        };

        return value;
    };

    return (
        <Widget title={<p style={{ fontWeight: 700 }}>Certificate By Group</p>}>
            <ReactApexChart
                options={getOptions(data || {})}
                series={getValues(data || {})}
                type="donut"
                //height="100%"
                //width="100%"
            />
        </Widget>
    );
}

export default CertificateByGroupChart;
