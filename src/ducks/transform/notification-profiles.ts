import {
    NotificationProfileDetailDto,
    NotificationProfileDetailModel,
    NotificationProfileDto,
    NotificationProfileModel,
    NotificationProfileRequestDto,
    NotificationProfileRequestModel,
    NotificationProfileUpdateRequestDto,
    NotificationProfileUpdateRequestModel,
} from 'types/notification-profiles';

export function transformNotificationProfileDtoToModel(notificationProfileDto: NotificationProfileDto): NotificationProfileModel {
    return {
        ...notificationProfileDto,
    };
}
export function transformNotificationProfileRequestModelToDto(
    notificationProfileRequestModel: NotificationProfileRequestModel,
): NotificationProfileRequestDto {
    return {
        ...notificationProfileRequestModel,
    };
}

export function transformNotificationProfileDetailDtoToModel(
    notificationProfileDetailDto: NotificationProfileDetailDto,
): NotificationProfileDetailModel {
    return {
        ...notificationProfileDetailDto,
    };
}

export function transformNotificationProfileUpdateRequestDtoToModel(
    notificationProfileUpdateRequestDto: NotificationProfileUpdateRequestDto,
): NotificationProfileUpdateRequestModel {
    return {
        ...notificationProfileUpdateRequestDto,
    };
}
