import { EnumItemDto as EnumItemDtoOpenApi } from './openapi';

export type EnumItemDto = EnumItemDtoOpenApi;
export type EnumItemModel = EnumItemDto;

export type PlatformEnumDto = { [key: string]: { [key: string]: EnumItemDto } };
export type PlatformEnumModel = { [key: string]: { [key: string]: EnumItemModel } };
