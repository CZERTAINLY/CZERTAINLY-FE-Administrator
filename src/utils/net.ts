import { AjaxResponse } from "rxjs/ajax";

export function extractError<T>(err: AjaxResponse<T> | Error, headline: string): string {
   if (!err) return headline;

   if (err instanceof Error) return `${headline}: ${err.message}`;
   if (err instanceof Event) return `${headline}: Network connection failure`;

   return `${headline}. ${err.status}`;
}
