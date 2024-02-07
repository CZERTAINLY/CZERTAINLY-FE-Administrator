import { Pkcs10RequestBasicData, RequestData } from './openapi/utils';

export const isPkcs10RequestBasicData = (requestData: RequestData): requestData is Pkcs10RequestBasicData => {
    return (requestData as Pkcs10RequestBasicData).subject !== undefined;
};
