import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import {
    AddTokenProfileRequestDto,
    BulkTokenProfileKeyUsageRequestDto,
    EditTokenProfileRequestDto,
    TokenProfileDetailDto,
    TokenProfileDto,
    TokenProfileKeyUsageRequestDto,
} from './openapi';

export type TokenProfileAddRequestDto = AddTokenProfileRequestDto;
export type TokenProfileAddRequestModel = Omit<TokenProfileAddRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type TokenProfileEditRequestDto = EditTokenProfileRequestDto;
export type TokenProfileEditRequestModel = Omit<TokenProfileEditRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes?: Array<AttributeRequestModel>;
};

export type TokenProfileResponseDto = TokenProfileDto;
export type TokenProfileResponseModel = TokenProfileResponseDto;

export type TokenProfileDetailResponseDto = TokenProfileDetailDto;
export type TokenProfileDetailResponseModel = Omit<TokenProfileDetailResponseDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
};

export type TokenProfileKeyUsageUpdateRequestDto = TokenProfileKeyUsageRequestDto;
export type TokenProfileKeyUsageUpdateRequestModel = TokenProfileKeyUsageUpdateRequestDto;

export type TokenProfileKeyUsageBulkUpdateRequestDto = BulkTokenProfileKeyUsageRequestDto;
export type TokenProfileKeyUsageBulkUpdateRequestModel = TokenProfileKeyUsageBulkUpdateRequestDto;
