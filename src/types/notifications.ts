import { AttributeMappingModel, AttributeRequestModel, AttributeResponseModel } from './attributes';
import { NotificationDto as NotificationDtoOpenApi, NotificationInstanceDto, NotificationInstanceRequestDto } from './openapi';

export type NotificationDto = NotificationDtoOpenApi;
export type NotificationModel = NotificationDto;

export type InstanceNotificationDto = NotificationInstanceDto;
export type NotificationInstanceModel = Omit<InstanceNotificationDto, 'attributes' | 'attributeMappings'> & {
    attributes: Array<AttributeResponseModel>;
    attributeMappings?: Array<AttributeMappingModel>;
};

export type InstanceNotificationRequestDto = NotificationInstanceRequestDto;
export type NotificationInstanceRequestModel = Omit<InstanceNotificationRequestDto, 'attributes' | 'attributeMappings'> & {
    attributes: Array<AttributeRequestModel>;
    attributeMappings?: Array<AttributeMappingModel>;
};
