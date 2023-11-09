import { ColorOptions } from "components/_pages/dashboard/DashboardItem/DonutChart";
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
} from "types/openapi";
import { DashboardDict } from "types/statisticsDashboard";
import { getCertificateStatusColor } from "./certificate";

type Status =
    | CertificateState
    | CertificateValidationStatus
    | CertificateEventHistoryDtoStatusEnum
    | ComplianceStatus
    | ComplianceRuleStatus;

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

function updateColorObject(status: Status, colorObject: ColorOptions): ColorOptions {
    const color = getCertificateStatusColor(status);

    if (color) {
        colorObject.colors.push(color);
    }
    return colorObject;
}

export function getCertificateDonutChartColors(certificateStatByStatus?: { [key: string]: number }) {
    const colorsObject: ColorOptions = {
        colors: [],
    };

    if (!certificateStatByStatus) {
        return colorsObject;
    }

    const arrayOfStatuses = Object.entries(certificateStatByStatus).map(([status, value]) => ({ status, value }));

    if (arrayOfStatuses.length === 0) {
        return colorsObject;
    }

    const updatedColorObject = arrayOfStatuses.reduce((acc, { status }) => updateColorObject(status as Status, acc), colorsObject);

    return updatedColorObject;
}
