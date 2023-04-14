import { AjaxError } from "rxjs/ajax";

export function extractError(err: Error, headline: string): string {
    if (!err) return headline;

    if (err instanceof AjaxError) return `${headline}: ${err.status}: ${err.response?.message ?? err.response ?? err.message}`;
    if (err instanceof Event) return `${headline}: Network connection failure`;

    return `${headline}. ${err.message}`;
}
