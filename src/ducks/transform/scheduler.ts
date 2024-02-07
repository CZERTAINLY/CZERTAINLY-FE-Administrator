import {
    PaginationDto,
    PaginationModel,
    SchedulerJobDetailDto,
    SchedulerJobDetailModel,
    SchedulerJobDto,
    SchedulerJobHistoryDto,
    SchedulerJobHistoryModel,
    SchedulerJobModel,
} from 'types/scheduler';

export function transformSchedulerJobDtoToModel(schedulerJob: SchedulerJobDto): SchedulerJobModel {
    return { ...schedulerJob };
}

export function transformSchedulerJobHistoryDtoToModel(history: SchedulerJobHistoryDto): SchedulerJobHistoryModel {
    return { ...history };
}

export function transformSchedulerJobDetailDtoToModel(schedulerJob: SchedulerJobDetailDto): SchedulerJobDetailModel {
    return { ...schedulerJob };
}

export function transformPaginationModelToDto(pagination: PaginationModel): PaginationDto {
    return { ...pagination };
}
