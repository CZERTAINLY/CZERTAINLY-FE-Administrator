import { NotificationModel } from "types/notifications";
import { NotificationDto } from "types/openapi";

export function transformNotificationDtoToModel(notification: NotificationDto): NotificationModel {
    return { ...notification };
}
