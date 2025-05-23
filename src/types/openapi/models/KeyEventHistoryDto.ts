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
 * @interface KeyEventHistoryDto
 */
export interface KeyEventHistoryDto {
    /**
     * UUID of the event
     * @type {string}
     * @memberof KeyEventHistoryDto
     */
    uuid: string;
    /**
     * UUID of the Key
     * @type {string}
     * @memberof KeyEventHistoryDto
     */
    keyUuid: string;
    /**
     * Event creation time
     * @type {string}
     * @memberof KeyEventHistoryDto
     */
    created: string;
    /**
     * Created By
     * @type {string}
     * @memberof KeyEventHistoryDto
     */
    createdBy: string;
    /**
     * Event type
     * @type {string}
     * @memberof KeyEventHistoryDto
     */
    event: KeyEventHistoryDtoEventEnum;
    /**
     * Event result
     * @type {string}
     * @memberof KeyEventHistoryDto
     */
    status: KeyEventHistoryDtoStatusEnum;
    /**
     * Event message
     * @type {string}
     * @memberof KeyEventHistoryDto
     */
    message: string;
    /**
     * Additional information for the event
     * @type {{ [key: string]: object; }}
     * @memberof KeyEventHistoryDto
     */
    additionalInformation?: { [key: string]: object; };
}

/**
 * @export
 * @enum {string}
 */
export enum KeyEventHistoryDtoEventEnum {
    CreateKey = 'Create Key',
    CompromisedKey = 'Compromised Key',
    DestroyKey = 'Destroy Key',
    UpdateKeyUsages = 'Update Key Usages',
    SignData = 'Sign Data',
    VerifyData = 'Verify Data',
    EncryptData = 'Encrypt Data',
    DecryptData = 'Decrypt Data',
    EnableKey = 'Enable Key',
    DisableKey = 'Disable Key'
}
/**
 * @export
 * @enum {string}
 */
export enum KeyEventHistoryDtoStatusEnum {
    Success = 'SUCCESS',
    Failed = 'FAILED'
}

