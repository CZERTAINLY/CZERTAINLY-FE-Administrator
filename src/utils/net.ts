import { AjaxError } from "rxjs/ajax";
import { ErrorCodeMessageMap, ErrorMessageObjectModel, LockTypeEnum } from "types/widget-locks";

export function extractError(err: Error, headline: string): string {
    if (!err) return headline;

    if (err instanceof AjaxError) return `${headline}: ${err.status}: ${err.response?.message ?? err.response ?? err.message}`;
    if (err instanceof Event) return `${headline}: Network connection failure`;

    return `${headline}. ${err.message}`;
}

function getLockEnumFromStatus(status: number): LockTypeEnum {
    if (status === 422) return LockTypeEnum.PERMISSION;
    else if (status > 400 && status < 500) return LockTypeEnum.CLIENT;
    else if (status === 503) return LockTypeEnum.SERVICE_ERROR;
    else if (status > 500 && status < 600) return LockTypeEnum.SERVER_ERROR;
    return LockTypeEnum.GENERIC;
}

export function getErrorMessageObject(error: AjaxError): ErrorMessageObjectModel {
    if (error?.response?.message && error.response.code) {
        const errorMessage = ErrorCodeMessageMap[error.response.code as keyof typeof ErrorCodeMessageMap] || "Something went wrong";
        return {
            errorMessage,
            errorDetails: error.response.message,
            lockType: getLockEnumFromStatus(error.status),
        };
    }

    if (error.status === 422)
        return {
            errorMessage: "Validation Error",
            errorDetails: "There problem in validating the request",
            lockType: getLockEnumFromStatus(error.status),
        };
    else if (error.status > 400 && error.status < 500)
        return {
            errorMessage: "Client Error",
            errorDetails: "There was some problem at the client side",
            lockType: getLockEnumFromStatus(error.status),
        };
    else if (error.status === 503)
        return {
            errorMessage: "Service unavailable",
            errorDetails: "There was some issue with the service",
            lockType: getLockEnumFromStatus(error.status),
        };
    else if (error.status > 500 && error.status < 600)
        return {
            errorMessage: "Server Error",
            errorDetails: "There was some issue with the server",
            lockType: getLockEnumFromStatus(error.status),
        };
    return {
        errorMessage: "Something went wrong",
        errorDetails: "There was some issue please try again later",
        lockType: LockTypeEnum.GENERIC,
    };
}
