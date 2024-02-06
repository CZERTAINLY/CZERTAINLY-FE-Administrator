import { StatisticsDashboardDto, StatisticsDashboardModel } from 'types/statisticsDashboard';

export function transformStatisticsDashboardDtoToModel(dashboardDto: StatisticsDashboardDto): StatisticsDashboardModel {
    return { ...dashboardDto };
}
