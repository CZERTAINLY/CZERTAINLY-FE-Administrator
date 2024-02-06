import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import { CredentialDto, CredentialRequestDto, CredentialUpdateRequestDto } from './openapi';

export type CredentialResponseDto = CredentialDto;
export type CredentialResponseModel = Omit<CredentialResponseDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type CredentialCreateRequestDto = CredentialRequestDto;
export type CredentialCreateRequestModel = Omit<CredentialCreateRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type CredentialEditRequestDto = CredentialUpdateRequestDto;
export type CredentialEditRequestModel = Omit<CredentialEditRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};
