import { 
    TokenInstanceDetailDto,
    TokenInstanceDto, 
    TokenInstanceRequestDto, 
    TokenInstanceStatus, 
    TokenInstanceStatusComponent, 
    TokenInstanceStatusDetailDto
} from "./openapi";
import { 
    AttributeRequestModel, 
    AttributeResponseModel 
} from "./attributes";
import { MetadataModel } from "./locations";

export type TokenRequestDto = TokenInstanceRequestDto;
export type TokenRequestModel = Omit<TokenRequestDto, "attributes | customAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes: Array<AttributeRequestModel> };

export type TokenResponseDto = TokenInstanceDto;
export type TokenResponseModel = TokenResponseDto;

export type TokenInstanceStatusResponseDto = TokenInstanceStatusDetailDto;
export type TokenInstanceStatusResponseModel = TokenInstanceStatusResponseDto;

export type TokenInstanceStatusComponentResponseDto = { [key: string]: TokenInstanceStatusComponent; };
export type TokenInstanceStatusComponentResponseModel = TokenInstanceStatusComponentResponseDto;

export type TokenDetailResponseDto = TokenInstanceDetailDto;
export type TokenDetailResponseModel = Omit<TokenDetailResponseDto, "attributes | customAttributes | status | metadata"> & { attributes: Array<AttributeResponseModel>, customAttributes?: Array<AttributeResponseModel>, status?: TokenInstanceStatusResponseModel, metadata?: Array<MetadataModel> };
