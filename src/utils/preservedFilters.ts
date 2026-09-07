/**
 * When a list page should put a deep link's filters back. They apply once and then never again, or a
 * restore that stayed armed would undo every later clearing of the filters.
 *
 * "Applied" includes "was already applied": a link that populated the current filters itself leaves
 * nothing to do, but the restore is finished all the same.
 */
export type PreservedFilterRestore =
    | 'restore'
    /** Nothing to apply, but the restore is done: the filters are already the ones the link asked for. */
    | 'settled'
    /** Not a deep-link arrival, so the restore stays armed. */
    | 'inapplicable';

export const preservedFilterRestore = ({
    withPreservedFilters,
    preservedCount,
    currentCount,
}: {
    /** A picker mounted inside a dialog does not honour deep-link filters. */
    withPreservedFilters: boolean;
    preservedCount: number;
    currentCount: number;
}): PreservedFilterRestore => {
    if (!withPreservedFilters || preservedCount === 0) {
        return 'inapplicable';
    }

    return currentCount === 0 ? 'restore' : 'settled';
};
