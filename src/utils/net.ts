import { Observable, from } from "rxjs";
import { HttpErrorResponse, StringMap } from "ts-rest-client";

export function createNewResource(
  url: string,
  body: any,
  headers?: any
): Observable<string | null> {
  return from(doFetch(url, body, headers));
}

async function doFetch(
  url: string,
  body: any,
  headers?: any
): Promise<string | null> {
  let errorResponse = null;

  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
      method: "POST",
    });

    if (response.ok) {
      return response.headers.get("location");
    }

    const responseHeaders = {} as StringMap;
    if (response.headers) {
      response.headers.forEach((value, key) => (responseHeaders[key] = value));
    }
    const error = await getResponseBody(response);
    errorResponse = new HttpErrorResponse({
      headers: responseHeaders,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error,
    });
  } catch (err) {
    let error: Event;

    if (err instanceof Event) {
      error = err;
    } else {
      error = new ErrorEvent("error", { error: err });
    }

    throw new HttpErrorResponse({
      error,
      url,
    });
  }

  throw errorResponse;
}

function getResponseBody(response: Response): Promise<any> {
  const contentType = response.headers.get("Content-Type");

  if (response.status === 204) {
    return Promise.resolve(null);
  }

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export function extractError(err: HttpErrorResponse, headline: string): string {
  const errorBody = err.error;
  if (err.status === 422) {
    return `${headline} ${errorBody.join(", ")}`;
  }
  if (!errorBody) {
    return headline;
  }

  if (errorBody instanceof Event) {
    return `${headline}: Network connection failure`;
  }

  return errorBody.message ? `${headline}: ${errorBody.message}` : headline;
}
