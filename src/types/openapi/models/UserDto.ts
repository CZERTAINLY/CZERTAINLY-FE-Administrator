// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.9.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * List of Users with the role
 * @export
 * @interface UserDto
 */
export interface UserDto {
    /**
     * UUID of the User
     * @type {string}
     * @memberof UserDto
     */
    uuid: string;
    /**
     * Username of the user
     * @type {string}
     * @memberof UserDto
     */
    username: string;
    /**
     * First name of the user
     * @type {string}
     * @memberof UserDto
     */
    firstName?: string;
    /**
     * Last name of the user
     * @type {string}
     * @memberof UserDto
     */
    lastName?: string;
    /**
     * Email of the user
     * @type {string}
     * @memberof UserDto
     */
    email?: string;
    /**
     * Description of the user
     * @type {string}
     * @memberof UserDto
     */
    description?: string;
    /**
     * Group name of the user
     * @type {string}
     * @memberof UserDto
     */
    groupName?: string;
    /**
     * Group UUID of the user
     * @type {string}
     * @memberof UserDto
     */
    groupUuid?: string;
    /**
     * Status of the user. True = Enabled, False = Disabled
     * @type {boolean}
     * @memberof UserDto
     */
    enabled: boolean;
    /**
     * Is System user. True = Yes, False = No
     * @type {boolean}
     * @memberof UserDto
     */
    systemUser: boolean;
}
