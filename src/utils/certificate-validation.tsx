export function renderValidationFrequencyLabel(days: string | number | undefined) {
    if (days === undefined) return '';
    return Number(days) === 1 ? <span>Everyday</span> : <span>Every {days} days</span>;
}
export function renderExpiringThresholdLabel(days: string | number | undefined) {
    if (days === undefined) return '';
    return (
        <span>
            {days} day{Number(days) > 1 ? 's' : ''}
        </span>
    );
}
