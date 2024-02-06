import {
    CryptographicKeyRandomDataRequestDto,
    CryptographicKeyRandomDataRequestModel,
    CryptographicKeyRandomDataResponseDto,
    CryptographicKeyRandomDataResponseModel,
    CryptographicKeySignDataRequestDto,
    CryptographicKeySignDataRequestModel,
    CryptographicKeySignResponseDto,
    CryptographicKeySignResponseModel,
    CryptographicKeyVerifyDataRequestDto,
    CryptographicKeyVerifyDataRequestModel,
    CryptographicKeyVerifyResponseDto,
    CryptographicKeyVerifyResponseModel,
} from 'types/cryptographic-operations';

export function transformCryptographicKeySignDataResponseDtoToModel(
    keyResponse: CryptographicKeySignResponseDto,
): CryptographicKeySignResponseModel {
    return {
        ...keyResponse,
    };
}

export function transformCryptographicKeyVerifyDataResponseDtoToModel(
    keyResponse: CryptographicKeyVerifyResponseDto,
): CryptographicKeyVerifyResponseModel {
    return {
        ...keyResponse,
    };
}

export function transformCryptographicKeyRandomDataResponseDtoToModel(
    keyResponse: CryptographicKeyRandomDataResponseDto,
): CryptographicKeyRandomDataResponseModel {
    return {
        ...keyResponse,
    };
}

export function transformCryptographicKeyRandomDataRequestModelToDto(
    randomDataRequest: CryptographicKeyRandomDataRequestModel,
): CryptographicKeyRandomDataRequestDto {
    return {
        ...randomDataRequest,
    };
}

export function transformCryptographicKeySignRequestModelToDto(
    signRequest: CryptographicKeySignDataRequestModel,
): CryptographicKeySignDataRequestDto {
    return {
        ...signRequest,
    };
}

export function transformCryptographicKeyVerifyRequestModelToDto(
    verifyRequest: CryptographicKeyVerifyDataRequestModel,
): CryptographicKeyVerifyDataRequestDto {
    return {
        ...verifyRequest,
    };
}
