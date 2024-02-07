import { AttributeRequestModel, AttributeResponseModel } from './attributes';
import { MetadataModel } from './locations';
import {
    TokenInstanceDetailDto,
    TokenInstanceDto,
    TokenInstanceRequestDto,
    TokenInstanceStatusComponent,
    TokenInstanceStatusDetailDto,
} from './openapi';

export type TokenRequestDto = TokenInstanceRequestDto;
export type TokenRequestModel = Omit<TokenRequestDto, 'attributes | customAttributes'> & {
    attributes: Array<AttributeRequestModel>;
    customAttributes: Array<AttributeRequestModel>;
};

export type TokenResponseDto = TokenInstanceDto;
export type TokenResponseModel = TokenResponseDto;

export type TokenInstanceStatusResponseDto = TokenInstanceStatusDetailDto;
export type TokenInstanceStatusResponseModel = TokenInstanceStatusResponseDto;

export type TokenInstanceStatusComponentResponseDto = { [key: string]: TokenInstanceStatusComponent };
export type TokenInstanceStatusComponentResponseModel = TokenInstanceStatusComponentResponseDto;

export type TokenDetailResponseDto = TokenInstanceDetailDto;
export type TokenDetailResponseModel = Omit<TokenDetailResponseDto, 'attributes | customAttributes | metadata'> & {
    attributes: Array<AttributeResponseModel>;
    customAttributes?: Array<AttributeResponseModel>;
    metadata?: Array<MetadataModel>;
};
