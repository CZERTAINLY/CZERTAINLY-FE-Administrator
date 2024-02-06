import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import { AuthorityInstanceDto, AuthorityInstanceRequestDto, AuthorityInstanceUpdateRequestDto } from './openapi';

export type AuthorityRequestDto = AuthorityInstanceRequestDto;
export type AuthorityRequestModel = Omit<AuthorityRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type AuthorityUpdateRequestDto = AuthorityInstanceUpdateRequestDto;
export type AuthorityUpdateRequestModel = Omit<AuthorityUpdateRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type AuthorityResponseDto = AuthorityInstanceDto;
export type AuthorityResponseModel = Omit<AuthorityResponseDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};
