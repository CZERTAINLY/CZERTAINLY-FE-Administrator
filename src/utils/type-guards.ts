import {
    ContentSigningWorkflowDto,
    ManagedSigningSchemeInterface,
    ManagedSigningType,
    RawSigningWorkflowDto,
    SigningScheme,
    SigningSchemeInterface,
    SigningWorkflowType,
    StaticKeyManagedSigningDto,
    TimestampingWorkflowDto,
    WorkflowInterface,
} from 'types/openapi';

// ─── Workflow Type Guards ──────────────────────────────────────────────────

export function isTimestampingWorkflow(wf: WorkflowInterface): wf is TimestampingWorkflowDto {
    return wf.type === SigningWorkflowType.Timestamping;
}

export function isContentSigningWorkflow(wf: WorkflowInterface): wf is ContentSigningWorkflowDto {
    return wf.type === SigningWorkflowType.ContentSigning;
}

export function isRawSigningWorkflow(wf: WorkflowInterface): wf is RawSigningWorkflowDto {
    return wf.type === SigningWorkflowType.RawSigning;
}

// ─── Signing Scheme Type Guards ──────────────────────────────────────────────

export function isStaticKeyManagedSigning(sc: SigningSchemeInterface): sc is StaticKeyManagedSigningDto {
    return (
        sc.signingScheme === SigningScheme.Managed &&
        (sc as ManagedSigningSchemeInterface).managedSigningType === ManagedSigningType.StaticKey
    );
}
