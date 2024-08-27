import {
    AttributeDescriptorModel,
    AttributeRequestModel,
    BaseAttributeContentModel,
    CodeBlockAttributeContentModel,
    isCustomAttributeModel,
    isDataAttributeModel,
} from 'types/attributes';
import { AttributeContentType, CodeBlockAttributeContent, FileAttributeContentData, SecretAttributeContent } from 'types/openapi';
import { utf8ToBase64 } from 'utils/common-utils';
import { getFormattedDateTime } from 'utils/dateUtil';
import CodeBlock from '../../components/Attributes/CodeBlock';

export const attributeFieldNameTransform: { [name: string]: string } = {
    name: 'Name',
    credentialProvider: 'Credential Provider',
    authorityProvider: 'Authority Provider',
    discoveryProvider: 'Discovery Provider',
    legacyAuthorityProvider: 'Legacy Authority Provider',
    complianceProvider: 'Compliance Provider',
    entityProvider: 'Entity Provider',
    cryptographyProvider: 'Cryptography Provider',
    notificationProvider: 'Notification Provider',
};

export const getAttributeContent = (contentType: AttributeContentType, content: BaseAttributeContentModel[] | undefined) => {
    if (!content) return 'Not set';

    if (contentType === AttributeContentType.Codeblock && content.length > 0) {
        return <CodeBlock content={content[0] as CodeBlockAttributeContentModel} />;
    }

    const mapping = (content: BaseAttributeContentModel): string | JSX.Element | undefined => {
        switch (contentType) {
            case AttributeContentType.Boolean:
                return content.data ? 'true' : 'false';
            case AttributeContentType.Credential:
            case AttributeContentType.Object:
            case AttributeContentType.File:
                return content.reference;
            case AttributeContentType.Time:
                return content.data.toString();
            case AttributeContentType.Date:
                return content.data.toString();
            case AttributeContentType.Datetime:
                return getFormattedDateTime(content.data.toString());
            case AttributeContentType.Float:
            case AttributeContentType.Integer:
            case AttributeContentType.String:
            case AttributeContentType.Text:
                return content.data.toString();
            case AttributeContentType.Secret:
                return '*****';
        }
        return undefined;
    };

    const isFileAttributeContentData = (data: any): data is FileAttributeContentData => {
        return typeof data === 'object' && data !== null && 'fileName' in data && 'mimeType' in data;
    };

    const checkFileNameAndMimeType = (content: BaseAttributeContentModel): string | undefined => {
        if (isFileAttributeContentData(content.data)) {
            return `${content.data.fileName} (${content.data.mimeType})`;
        } else {
            return 'Unknown data type';
        }
    };

    return content.map((content) => mapping(content) ?? checkFileNameAndMimeType(content)).join(', ');
};

const getAttributeFormValue = (contentType: AttributeContentType, item: any) => {
    if (contentType === AttributeContentType.Datetime) {
        const returnVal = item?.value?.data
            ? { data: new Date(item.value.data).toISOString() }
            : typeof item === 'string'
              ? { data: new Date(item).toISOString() }
              : new Date(item).toISOString();
        return returnVal;
    }
    if (contentType === AttributeContentType.Date) {
        console.log('inside date =>item', item);
        const returnVal = item?.value?.data
            ? { data: new Date(item.value.data).toISOString().slice(0, 10) }
            : typeof item === 'string'
              ? { data: new Date(item).toISOString().slice(0, 10) }
              : new Date(item).toISOString().slice(0, 10);

        return returnVal;
    }
    if (contentType === AttributeContentType.Codeblock) {
        return { data: { code: utf8ToBase64(item.code), language: item.language } } as CodeBlockAttributeContent;
    }

    if (contentType === AttributeContentType.Secret) {
        return {
            data: {
                secret: item,
            },
        } as SecretAttributeContent;
    }

    return item.value ?? { data: item };
};

export function collectFormAttributes(
    id: string,
    descriptors: AttributeDescriptorModel[] | undefined,
    values: Record<string, any>,
): AttributeRequestModel[] {
    if (!descriptors || !values[`__attributes__${id}__`]) return [];

    const attributes = values[`__attributes__${id}__`];

    const attrs: AttributeRequestModel[] = [];

    for (const attribute in attributes) {
        if (!attributes.hasOwnProperty(attribute)) continue;

        const info = attribute.split(':');

        const attributeName = info[0];

        const descriptor = descriptors?.find((d) => d.name === attributeName);

        if (!descriptor) continue;
        if (attributes[attribute] === undefined || attributes[attribute] === null) continue;

        let content: any;

        if (isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
            if (Array.isArray(attributes[attribute])) {
                content = attributes[attribute].map((i: any) => getAttributeFormValue(descriptor.contentType, i));
            } else {
                content = getAttributeFormValue(descriptor.contentType, attributes[attribute]);
            }

            if (typeof content.data !== 'undefined' || Array.isArray(content)) {
                const attr: AttributeRequestModel = {
                    name: attributeName,
                    content: Array.isArray(content) ? content : [content],
                    contentType: descriptor.contentType,
                    uuid: descriptor.uuid,
                };

                attrs.push(attr);
            }
        }
    }
    return attrs;
}
