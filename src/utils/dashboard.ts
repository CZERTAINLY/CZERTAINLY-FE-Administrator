import { DashboardDict } from "types/statisticsDashboard";

export function getLabels(data: DashboardDict) {
    let labels: string[] = [];

    for (let i of Object.entries(data)) {
        const splitValue = i[0].split("=");
        labels.push(splitValue[splitValue.length - 1]);
    }

    return labels;
}

export function getDefaultColors() {
    return ["#1473b5", "#3fb24d", "#2c7c35", "#438fc3", "#73b514"];
}

export function getValues(data: DashboardDict) {
    let values: number[] = [];

    for (let i of Object.entries(data)) {
        values.push(i[1]);
    }

    return values;
}
