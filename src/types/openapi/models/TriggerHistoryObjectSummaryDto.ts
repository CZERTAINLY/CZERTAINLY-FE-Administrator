// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.12.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    TriggerHistoryObjectTriggerSummaryDto,
} from './';

/**
 * List of history of objects that triggers has been evaluated on.
 * @export
 * @interface TriggerHistoryObjectSummaryDto
 */
export interface TriggerHistoryObjectSummaryDto {
    /**
     * UUID of the object that the trigger has been evaluated on.
     * @type {string}
     * @memberof TriggerHistoryObjectSummaryDto
     */
    objectUuid?: string;
    /**
     * Reference UUID of the object that the trigger has been evaluated on.
     * @type {string}
     * @memberof TriggerHistoryObjectSummaryDto
     */
    referenceObjectUuid?: string;
    /**
     * Was matched at least by one trigger.
     * @type {boolean}
     * @memberof TriggerHistoryObjectSummaryDto
     */
    matched: boolean;
    /**
     * Was matched by ignore trigger.
     * @type {boolean}
     * @memberof TriggerHistoryObjectSummaryDto
     */
    ignored: boolean;
    /**
     * List of records for each trigger that has been evaluated.
     * @type {Array<TriggerHistoryObjectTriggerSummaryDto>}
     * @memberof TriggerHistoryObjectSummaryDto
     */
    triggers: Array<TriggerHistoryObjectTriggerSummaryDto>;
}
