export function renderValidationFrequencyLabel(days: string | number | undefined) {
    if (days === undefined) return '';
    return Number(days) === 1 ? (
        <div>
            {days} <span className="text-muted">(Everyday)</span>
        </div>
    ) : (
        <div>
            {days} <span className="text-muted">(Every {days} days)</span>
        </div>
    );
}
export function renderExpiringThresholdLabel(days: string | number | undefined) {
    if (days === undefined) return '';
    return (
        <div>
            {days}{' '}
            <span className="text-muted">
                ({days} day{Number(days) > 1 ? 's' : ''})
            </span>
        </div>
    );
}
