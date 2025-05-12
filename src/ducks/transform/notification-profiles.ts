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

export function transformNotificationProfileDtoToModel(notificationProfile: NotificationProfileDto): NotificationProfileModel {
    return {
        ...notificationProfile,
    };
}
export function transformNotificationProfileRequestModelToDto(
    notificationProfile: NotificationProfileRequestModel,
): NotificationProfileRequestDto {
    return {
        ...notificationProfile,
    };
}

export function transformNotificationProfileDetailDtoToModel(
    notificationProfile: NotificationProfileDetailDto,
): NotificationProfileDetailModel {
    return {
        ...notificationProfile,
    };
}

export function transformNotificationProfileUpdateRequestDtoToModel(
    notificationProfile: NotificationProfileUpdateRequestDto,
): NotificationProfileUpdateRequestModel {
    return {
        ...notificationProfile,
    };
}
