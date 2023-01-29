import { AttributeRequestModel, AttributeResponseModel } from "./attributes";
import { CertificateGroupResponseModel } from "./certificateGroups";
import { MetadataModel } from "./locations";
import { 
    BulkKeyUsageRequestDto, 
    EditKeyRequestDto, 
    KeyDetailDto, 
    KeyDto, 
    KeyEventHistoryDto, 
    KeyFormat, 
    KeyItemDto, 
    KeyRequestDto, 
    UpdateKeyUsageRequestDto,
} from "./openapi";

export type CryptographicKeyAddRequestDto = KeyRequestDto;
export type CryptographicKeyAddRequestModel = Omit<CryptographicKeyAddRequestDto, "attributes | customAttributes"> & { attributes: Array<AttributeRequestModel>, customAttributes?: Array<AttributeRequestModel> };

export type CryptographicKeyEditRequestDto = EditKeyRequestDto;
export type CryptographicKeyEditRequestModel = Omit<CryptographicKeyEditRequestDto, "customAttributes"> & { customAttributes?: Array<AttributeRequestModel> };

export type CryptographicKeyResponseDto = KeyDto;
export type CryptographicKeyResponseModel = CryptographicKeyResponseDto;

export type CryptographicKeyDetailResponseDto = KeyDetailDto;
export type CryptographicKeyDetailResponseModel = Omit<CryptographicKeyDetailResponseDto, "attributes | customAttributes | group"> & { attributes: Array<AttributeResponseModel>, customAttributes?: Array<AttributeResponseModel>, group?: CertificateGroupResponseModel};

export type CryptographicKeyItemResponseDto = KeyItemDto;
export type CryptographicKeyItemResponseModel = Omit<CryptographicKeyItemResponseDto, "metadata | format"> & { metadata?: Array<MetadataModel>, format?: KeyFormat};

export type CryptographicKeyKeyUsageUpdateRequestDto = UpdateKeyUsageRequestDto;
export type CryptographicKeyKeyUsageUpdateRequestModel = CryptographicKeyKeyUsageUpdateRequestDto;

export type CryptographicKeyKeyUsageBulkUpdateRequestDto = BulkKeyUsageRequestDto;
export type CryptographicKeyKeyUsageBulkUpdateRequestModel = CryptographicKeyKeyUsageBulkUpdateRequestDto;

export type CryptographicKeyHistoryDto = KeyEventHistoryDto;
export type CryptographicKeyHistoryModel = CryptographicKeyHistoryDto;