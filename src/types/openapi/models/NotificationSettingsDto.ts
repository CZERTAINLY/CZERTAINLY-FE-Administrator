// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.14.2-SNAPSHOT
 * Contact: info@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * @export
 * @interface NotificationSettingsDto
 */
export interface NotificationSettingsDto {
    /**
     * Map of notification instances where key is notification type enum
     * @type {{ [key: string]: string; }}
     * @memberof NotificationSettingsDto
     */
    notificationsMapping: { [key: string]: string; };
}
