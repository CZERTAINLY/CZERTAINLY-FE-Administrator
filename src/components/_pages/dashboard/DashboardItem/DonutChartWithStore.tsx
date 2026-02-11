import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { createMockStore } from 'utils/test-helpers';
import DonutChart from './DonutChart';
import { slice as enumsSlice } from 'ducks/enums';
import { PlatformEnum } from 'types/openapi';
import { CertificateState } from 'types/openapi';

const certificateStateLabels: Record<string, { label: string }> = {
    [CertificateState.Issued]: { label: 'Issued' },
    [CertificateState.Revoked]: { label: 'Revoked' },
};

const preloadedState = {
    [enumsSlice.name]: {
        platformEnums: {
            [PlatformEnum.CertificateState]: certificateStateLabels,
            [PlatformEnum.CertificateValidationStatus]: {},
            [PlatformEnum.ComplianceStatus]: {},
            [PlatformEnum.ComplianceRuleStatus]: {},
            [PlatformEnum.CertificateSubjectType]: {},
        },
    },
};

export type DonutChartWithStoreProps = React.ComponentProps<typeof DonutChart>;

export default function DonutChartWithStore(props: DonutChartWithStoreProps) {
    const store = createMockStore(preloadedState as any);
    return (
        <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
                <DonutChart {...props} />
            </MemoryRouter>
        </Provider>
    );
}
