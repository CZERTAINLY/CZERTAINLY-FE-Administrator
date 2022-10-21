import { StringMap } from './NamedValues';

/**
 * Holds information about a failed HTTP request.
 * If the request failed on server side, error is to be filled with the response body.
 * If the request failed on client side, error is to be filled with an Event object describing what happened.
 */
export class HttpErrorResponse implements Error {

   readonly error: any | null;
   readonly headers: StringMap;
   readonly message: string;
   readonly name = 'HttpErrorResponse';
   readonly stack?: string | undefined;
   readonly status: number;
   readonly statusText: string;
   readonly url?: string;

   constructor(init: { error?: any; headers?: StringMap; status?: number; statusText?: string; url?: string; }) {

      const data = init || {};

      this.status = data.status || 0;
      this.headers = data.headers || {};
      this.statusText = data.statusText || '';
      this.url = data.url;

      if (this.status >= 200 && this.status <= 300) {
         this.message = `Http failure during parsing for ${this.url || '(unknown url)'}`;
      } else {
         this.message = `Http failure response for ${this.url || '(unknown url)'}: ${this.status} ${this.statusText}`;
      }

      this.error = data.error || null;

   }

}
