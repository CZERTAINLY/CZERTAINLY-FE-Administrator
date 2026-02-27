import { test, expect } from '../../../../playwright/ct-test';
import AttributeViewerMountHarness from './AttributeViewerMountHarness';
import { AttributeContentType, Resource } from 'types/openapi';
import type { AttributeResponseModel } from 'types/attributes';
import type { MetadataModel } from 'types/locations';
import { ATTRIBUTE_VIEWER_TYPE } from './index';

test.describe('AttributeViewer', () => {
    test('renders Resource attribute content as link', async ({ mount, page }) => {
        const resourceAttribute: AttributeResponseModel = {
            uuid: 'attr-1',
            name: 'resAttr',
            label: 'Resource Attr',
            version: 'v1' as any,
            contentType: AttributeContentType.Resource,
            content: [
                {
                    data: {
                        uuid: '1234',
                        name: 'Conn One',
                        resource: Resource.Connectors,
                    },
                } as any,
            ],
        } as any;

        await mount(<AttributeViewerMountHarness attributes={[resourceAttribute]} />);

        const link = page.getByRole('link', { name: 'Conn One' });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', '/connectors/detail/1234');
    });

    test('METADATA viewer uses connectorName and sourceObjectType columns', async ({ mount, page }) => {
        const resourceAttribute: AttributeResponseModel = {
            uuid: 'attr-1',
            name: 'resAttr',
            label: 'Resource Attr',
            version: 'v1' as any,
            contentType: AttributeContentType.Resource,
            content: [
                {
                    data: {
                        uuid: '1234',
                        name: 'Conn One',
                        resource: Resource.Connectors,
                    },
                } as any,
            ],
        } as any;

        const metadata: MetadataModel = {
            connectorUuid: 'conn-uuid',
            connectorName: 'My Connector',
            sourceObjectType: Resource.Connectors,
            items: [resourceAttribute as any],
        } as any;

        await mount(
            <AttributeViewerMountHarness
                viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA}
                metadata={[metadata]}
                attributes={[]}
                descriptors={[]}
            />,
        );

        await expect(page.getByText('My Connector')).toBeVisible();
        await expect(page.getByText('Connectors')).toBeVisible();
    });

    test('ATTRIBUTE_EDIT viewer handles undefined attributes gracefully', async ({ mount, page }) => {
        await mount(
            <AttributeViewerMountHarness
                viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE_EDIT}
                // attributes intentionally undefined to cover guard path in getAttributesEditTableData
                attributes={undefined as any}
                descriptors={[]}
            />,
        );

        await expect(page.getByText('Name')).toBeVisible();
        await expect(page.getByText('Content Type')).toBeVisible();
    });
});
