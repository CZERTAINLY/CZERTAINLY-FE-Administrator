export function renderValidationFrequencyLabel(days: string | number | undefined) {
    return days === undefined ? (
        ''
    ) : +days === 1 ? (
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
    return days === undefined ? (
        ''
    ) : (
        <div>
            {days}{' '}
            <span className="text-muted">
                ({days} day{+days > 1 ? 's' : ''})
            </span>
        </div>
    );
}
