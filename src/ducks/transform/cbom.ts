import {
    CbomDetailDto,
    CbomDto,
    CbomUploadRequestDto,
    PaginationResponseDtoCbomDto,
    SearchFieldDataByGroupDto,
    SearchRequestDto,
} from 'types/openapi';

export function transformCbomDtoToModel(cbom: CbomDto): CbomDto {
    return { ...cbom };
}

export function transformCbomDetailDtoToModel(cbomDetail: CbomDetailDto): CbomDetailDto {
    return { ...cbomDetail };
}

export function transformCbomUploadRequestModelToDto(model: CbomUploadRequestDto): CbomUploadRequestDto {
    return { ...model };
}

export function transformSearchRequestModelToDto(search: SearchRequestDto): SearchRequestDto {
    return { ...search };
}

export function transformSearchableFieldsDtoToModel(fields: Array<SearchFieldDataByGroupDto>): Array<SearchFieldDataByGroupDto> {
    return fields.map((f) => ({ ...f }));
}

export function transformPaginationResponseDtoToModel(resp: PaginationResponseDtoCbomDto): PaginationResponseDtoCbomDto {
    return { ...resp };
}
