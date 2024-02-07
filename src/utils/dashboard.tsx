import { ColorOptions } from 'components/_pages/dashboard/DashboardItem/DonutChart';
import { useMemo } from 'react';
import {
    CertificateEventHistoryDtoStatusEnum,
    CertificateState,
    CertificateValidationStatus,
    ComplianceRuleStatus,
    ComplianceStatus,
} from 'types/openapi';
import { DashboardDict } from 'types/statisticsDashboard';
import { getCertificateStatusColor, useGetStatusText } from './certificate';

type Status =
    | CertificateState
    | CertificateValidationStatus
    | CertificateEventHistoryDtoStatusEnum
    | ComplianceStatus
    | ComplianceRuleStatus;

export function useGetLabels(data: DashboardDict) {
    const getStatusText = useGetStatusText();

    const labels = useMemo(() => {
        let result: string[] = [];

        for (let i of Object.entries(data)) {
            if (getStatusText(i[0] as Status) === 'Unknown') {
                const splitValue = i[0].split('=');
                result.push(splitValue[splitValue.length - 1]);
            } else {
                result.push(getStatusText(i[0] as Status));
            }
        }

        return result;
    }, [data, getStatusText]);

    return labels;
}
export function getDefaultColors() {
    return ['#1473b5', '#3fb24d', '#2c7c35', '#438fc3', '#73b514'];
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
