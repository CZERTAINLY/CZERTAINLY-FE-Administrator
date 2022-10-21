import { Observable } from "rxjs";

import { NamedValues } from "./NamedValues";
import { HttpRequestOptions } from "./HttpRequestOptions";
import { HttpErrorResponse } from "./HttpErrorResponse";

export { HttpRequestOptions };
export { NamedValues };
export { HttpErrorResponse };

export interface FetchHttpService {

   request(options: HttpRequestOptions): Observable<any>;
   getResponseBody(response: Response): Promise<any>;

}