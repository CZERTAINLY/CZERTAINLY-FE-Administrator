import { AjaxError } from "rxjs/ajax";
import { ErrorMessageObjectModel, LockTypeEnum } from "types/widget-locks";

export function getErrorMessageObject(error: AjaxError): ErrorMessageObjectModel {
    if (error.status === 422)
        return {
            errorMessage: "Validation Error",
            errorDetails: "There problem in validating the request",
            lockType: LockTypeEnum.PERMISSION,
        };
    else if (error.status > 400 && error.status < 500)
        return {
            errorMessage: "Client Error",
            errorDetails: "There was some problem at the client side",
            lockType: LockTypeEnum.CLIENT,
        };
    else if (error.status === 503)
        return {
            errorMessage: "Service unavailable",
            errorDetails: "There was some issue with the service",
            lockType: LockTypeEnum.SERVICE_ERROR,
        };
    else if (error.status > 500 && error.status < 600)
        return {
            errorMessage: "Server Error",
            errorDetails: "There was some issue with the server",
            lockType: LockTypeEnum.SERVER_ERROR,
        };
    return {
        errorMessage: "Something went wrong",
        errorDetails: "There was some issue please try again later",
        lockType: LockTypeEnum.GENERIC,
    };
}
