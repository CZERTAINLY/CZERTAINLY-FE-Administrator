import { NotificationInstanceModel, NotificationInstanceRequestModel, NotificationModel } from 'types/notifications';
import { NotificationDto, NotificationInstanceDto, NotificationInstanceRequestDto } from 'types/openapi';
import {
    transformAttributeMappingDtoToModel,
    transformAttributeMappingModelToDto,
    transformAttributeRequestModelToDto,
    transformAttributeResponseDtoToModel,
} from './attributes';

export function transformNotificationDtoToModel(notification: NotificationDto): NotificationModel {
    return { ...notification };
}

export function transformNotificationInstanceDtoToModel(notificationInstance: NotificationInstanceDto): NotificationInstanceModel {
    return {
        ...notificationInstance,
        attributes: notificationInstance?.attributes?.map(transformAttributeResponseDtoToModel),
        attributeMappings: notificationInstance.attributeMappings?.map(transformAttributeMappingDtoToModel),
    };
}

export function transformNotificationInstanceModelToDto(
    notificationInstance: NotificationInstanceRequestModel,
): NotificationInstanceRequestDto {
    return {
        ...notificationInstance,
        attributes: notificationInstance?.attributes?.map(transformAttributeRequestModelToDto),
        attributeMappings: notificationInstance.attributeMappings?.map(transformAttributeMappingModelToDto),
    };
}
