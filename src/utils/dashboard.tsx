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

const colorMapByDaysOfExpiration: { [key: string]: string } = {
    '10': '#632828',
    '20': '#9c0012',
    '30': '#f37d63',
    '60': '#7fa2c1',
    '90': '#008ffb',
    More: '#1ab394',
    Expired: '#eb3349',
};

export function getCertificateDonutChartColorsByDaysOfExpiration(certificateStatByExpirationDays?: {
    [key: string]: number;
}): ColorOptions | undefined {
    if (!certificateStatByExpirationDays) {
        return undefined;
    }

    const getColorByDaysOfExpiration = (certificateStatByExpirationDay: string) => {
        return colorMapByDaysOfExpiration[certificateStatByExpirationDay];
    };

    return { colors: Object.keys(certificateStatByExpirationDays).map((key) => getColorByDaysOfExpiration(key)) };
}

const baseColors = ['#5d80f9', '#00a0e3', '#2b2a29', '#eb3349', '#1ab394', '#f3c363', '#6c757d', '#3754a5', '#3fb24d', '#1473b5'];

function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function getDonutChartColorsByRandomNumberOfOptions(numberOfOptions: number): ColorOptions {
    const colors = [...baseColors];
    const saturation = 70;
    const lightness = 50;

    const additionalColorsNeeded = numberOfOptions - baseColors.length;
    if (additionalColorsNeeded > 0) {
        const hueStep = 360 / additionalColorsNeeded;
        for (let i = 0; i < additionalColorsNeeded; i++) {
            const hue = (i * hueStep) % 360; // evenly spaced hues for additional colors
            colors.push(hslToHex(hue, saturation, lightness));
        }
    }

    return { colors: colors.slice(0, numberOfOptions) };
}
