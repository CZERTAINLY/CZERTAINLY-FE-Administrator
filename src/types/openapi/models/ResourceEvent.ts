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
 * 
 * @export
 * @enum {string}
 */
export enum ResourceEvent {
    CertificateStatusChanged = 'certificate_status_changed',
    CertificateActionPerformed = 'certificate_action_performed',
    CertificateDiscovered = 'certificate_discovered',
    CertificateExpiring = 'certificate_expiring',
    DiscoveryFinished = 'discovery_finished',
    ApprovalRequested = 'approval_requested',
    ApprovalClosed = 'approval_closed',
    ScheduledJobFinished = 'scheduled_job_finished'
}

