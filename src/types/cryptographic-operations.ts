import { AttributeRequestModel } from './attributes';
import {
    RandomDataRequestDto,
    RandomDataResponseDto,
    SignatureRequestData,
    SignatureResponseData,
    SignDataRequestDto,
    SignDataResponseDto,
    VerifyDataRequestDto,
    VerifyDataResponseDto,
} from './openapi';

export type CryptographicKeySignDataRequestDto = SignDataRequestDto;
export type CryptographicKeySignDataRequestModel = Omit<CryptographicKeySignDataRequestDto, 'data'> & {
    data: Array<SignatureRequestData>;
};

export type CryptographicKeySignatureRequestDataDto = SignatureRequestData;
export type CryptographicKeySignatureRequestDataModel = CryptographicKeySignatureRequestDataDto;

export type CryptographicKeySignResponseDto = SignDataResponseDto;
export type CryptographicKeySignResponseModel = CryptographicKeySignResponseDto;

export type CryptographicKeySignResponseDataDto = SignatureResponseData;
export type CryptographicKeySignResponseDataModel = CryptographicKeySignResponseDataDto;

export type CryptographicKeyVerifyDataRequestDto = VerifyDataRequestDto;
export type CryptographicKeyVerifyDataRequestModel = Omit<CryptographicKeyVerifyDataRequestDto, 'data'> & {
    data: Array<SignatureRequestData>;
};

export type CryptographicKeyVerifyResponseDto = VerifyDataResponseDto;
export type CryptographicKeyVerifyResponseModel = CryptographicKeyVerifyResponseDto;

export type CryptographicKeyVerificationResponseDataDto = SignatureResponseData;
export type CryptographicKeyVerificationResponseDataModel = CryptographicKeyVerificationResponseDataDto;

export type CryptographicKeyRandomDataRequestDto = RandomDataRequestDto;
export type CryptographicKeyRandomDataRequestModel = Omit<CryptographicKeyRandomDataRequestDto, 'attributes'> & {
    attributes?: Array<AttributeRequestModel>;
};

export type CryptographicKeyRandomDataResponseDto = RandomDataResponseDto;
export type CryptographicKeyRandomDataResponseModel = CryptographicKeyRandomDataResponseDto;
