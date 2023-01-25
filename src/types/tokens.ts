import { 
    TokenInstanceDetailDto,
    TokenInstanceDto, 
    TokenInstanceRequestDto, 
    UpdateTokenInstanceRequest 
} from "./openapi";
import { 
    AttributeRequestModel, 
    AttributeResponseModel 
} from "./attributes";

export type TokenRequestDto = TokenInstanceRequestDto;
export type TokenRequestModel = Omit<TokenRequestDto, "attributes | customAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes: Array<AttributeRequestModel> };

export type TokenResponseDto = TokenInstanceDto;
export type TokenResponseModel = TokenResponseDto;

export type TokenDetailResponseDto = TokenInstanceDetailDto;
export type TokenDetailResponseModel = Omit<TokenDetailResponseDto, "attributes | customAttributes"> & { attributes: Array<AttributeResponseModel>, customAttributes?: Array<AttributeResponseModel> };
