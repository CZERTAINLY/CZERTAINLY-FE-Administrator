import { Observable } from "rxjs";
import { HttpRequestOptions, HttpErrorResponse, NamedValues } from "ts-rest-client";

export { HttpRequestOptions };
export { NamedValues };
export { HttpErrorResponse };

export interface FetchHttpService {

   request(options: HttpRequestOptions): Observable<any>;
   getResponseBody(response: Response): Promise<any>;

}
