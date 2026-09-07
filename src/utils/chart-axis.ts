/**
 * The number of ticks recharts aims for on a value axis. Its automatic domain is only divided into
 * whole-number steps once the domain spans at least this many of them.
 */
export const AXIS_TICK_COUNT = 5;

/**
 * The domain a count axis should span, given the counts plotted on it.
 *
 * Counts are whole numbers, so the axis over them must not be divided into fractions: formatting
 * fractional ticks as integers collapses them into duplicate labels, turning a maximum of two into
 * `0 1 1 2 2`. Recharts divides a wide enough automatic domain into whole numbers on its own, so
 * only the small maxima need their top pinned — which also keeps the plot filling the widget
 * instead of trailing along the bottom of a rounded-up ceiling.
 */
export const countAxisDomain = (values: readonly number[]): [number, number | 'auto'] => {
    const max = Math.ceil(Math.max(0, ...values));

    return max < AXIS_TICK_COUNT ? [0, Math.max(1, max)] : [0, 'auto'];
};
