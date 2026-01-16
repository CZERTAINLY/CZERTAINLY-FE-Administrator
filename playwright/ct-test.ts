import { test as base, expect } from '@playwright/experimental-ct-react';
import { addCoverageReport } from 'monocart-reporter';

export const test = base.extend<{ autoCoverage: void }>({
    autoCoverage: [
        async ({ page }, use, testInfo) => {
            const isChromium = testInfo.project.name === 'chromium' || testInfo.project.name.toLowerCase().includes('chromium');

            if (isChromium) {
                await Promise.all([
                    page.coverage.startJSCoverage({ resetOnNavigation: false }),
                    page.coverage.startCSSCoverage({ resetOnNavigation: false }),
                ]);
            }

            await use();

            if (isChromium) {
                const [js, css] = await Promise.all([page.coverage.stopJSCoverage(), page.coverage.stopCSSCoverage()]);

                const coverageList = [...js, ...css];

                await addCoverageReport(coverageList, testInfo);
            }
        },
        { auto: true, scope: 'test' },
    ],
});

export { expect };
