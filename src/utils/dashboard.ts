import { ColorOptions } from "components/_pages/dashboard/DashboardItem/DonutChart";
import { CertificateStatus } from "types/openapi";
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

function updateColorObjectByStatus(status: string, colorObject: ColorOptions): ColorOptions {
    let color = "";

    switch (status) {
        case CertificateStatus.Valid:
            color = "#1ab394";
            break;
        case CertificateStatus.Expired:
            color = "#FF6347";
            break;
        case CertificateStatus.Revoked:
            color = "#343a40";
            break;
        case CertificateStatus.Expiring:
            color = "#f3c363";
            break;
        case CertificateStatus.Invalid:
            color = "#800000";
            break;
        case CertificateStatus.New:
            color = "#3754a5";
            break;
        case CertificateStatus.Unknown:
            color = "#6c757d";
            break;
        case CertificateStatus.Rejected:
            color = "#eb3349";
            break;
        default:
            break;
    }

    if (color) {
        colorObject.colors.push(color);
    }

    return colorObject;
}

function updateColorObjectByCompliance(compliance: string, colorObject: ColorOptions): ColorOptions {
    let color = "";

    switch (compliance) {
        case "Not Compliant":
            color = "red";
            break;
        case "Compliant":
            color = "green";
            break;
        case "Not Checked":
            color = "#D1D1D1";
            break;
        default:
            break;
    }

    if (color) {
        colorObject.colors.push(color);
    }

    return colorObject;
}

export function getCertificateDonutChartColorsByStatus(certificateStatByStatus?: { [key: string]: number }) {
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

    const updatedColorObject = arrayOfStatuses.reduce((acc, { status }) => updateColorObjectByStatus(status, acc), colorsObject);

    return updatedColorObject;
}

export function getCertificateDonutChartColorsByCompliance(certificateStatByComplianceStatus?: { [key: string]: number }) {
    const colorsObject: ColorOptions = {
        colors: [],
    };

    if (!certificateStatByComplianceStatus) {
        return colorsObject;
    }

    const arrayOfStatuses = Object.entries(certificateStatByComplianceStatus).map(([status, value]) => ({ status, value }));

    if (arrayOfStatuses.length === 0) {
        return colorsObject;
    }
    console.log("arrayOfStatuses", arrayOfStatuses);
    const updatedColorObject = arrayOfStatuses.reduce((acc, { status }) => updateColorObjectByCompliance(status, acc), colorsObject);

    return updatedColorObject;
}
