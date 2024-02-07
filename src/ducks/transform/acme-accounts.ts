import {
    AcmeAccountListResponseDto,
    AcmeAccountListResponseModel,
    AcmeAccountResponseDto,
    AcmeAccountResponseModel,
} from 'types/acme-accounts';

export function transformAcmeAccountResponseDtoToModel(acme: AcmeAccountResponseDto): AcmeAccountResponseModel {
    return { ...acme };
}

export function transformAcmeAccountListResponseDtoToModel(acme: AcmeAccountListResponseDto): AcmeAccountListResponseModel {
    return { ...acme };
}
