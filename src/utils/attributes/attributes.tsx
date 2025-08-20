import {
    AttributeDescriptorModel,
    AttributeRequestModel,
    AttributeResponseModel,
    BaseAttributeContentModel,
    CodeBlockAttributeContentDataModel,
    CodeBlockAttributeContentModel,
    CustomAttributeModel,
    DataAttributeModel,
    isCustomAttributeModel,
    isDataAttributeModel,
} from 'types/attributes';
import { AttributeContentType, CodeBlockAttributeContent, FileAttributeContentData, SecretAttributeContent } from 'types/openapi';
import { base64ToUtf8, utf8ToBase64 } from 'utils/common-utils';
import { getFormattedDate, getFormattedDateTime } from 'utils/dateUtil';
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
export const getAttributeCopyValue = (contentType: AttributeContentType, content: BaseAttributeContentModel[] | undefined) => {
    if (!content) return undefined;

    const mapping = (content: BaseAttributeContentModel): string | undefined => {
        switch (contentType) {
            case AttributeContentType.Codeblock:
                if (typeof content.data === 'object' && 'code' in content.data) return base64ToUtf8(content.data.code);
                return content.data.toString();
            case AttributeContentType.Credential:
                if (typeof content.data === 'object' && 'name' in content.data) return content.data.name;
                return content.data.toString();
            case AttributeContentType.File:
                if (typeof content.data === 'object' && 'content' in content.data) return base64ToUtf8(content.data.content);
                return content.data.toString();
            case AttributeContentType.Object:
                return JSON.stringify(content.data);
            case AttributeContentType.Boolean:
                return content.data ? 'true' : 'false';
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
                return undefined;
        }
    };
    return content.map(mapping).join(', ');
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
    const deletedAttributes = values[`deletedAttributes_${id}`] || [];

    const attrs: AttributeRequestModel[] = [];

    for (const attribute in attributes) {
        if (!attributes.hasOwnProperty(attribute)) continue;

        const info = attribute.split(':');

        const attributeName = info[0];

        // Skip if this attribute was deleted
        if (deletedAttributes.includes(attributeName)) {
            continue;
        }

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

type InputItem = {
    formAttributeName: string;
    formAttributeValue: any;
};

export function transformAttributes(data: InputItem[]): Record<string, any> {
    const result: Record<string, any> = {};

    data.forEach(({ formAttributeName, formAttributeValue }) => {
        // split by the last dot
        const lastDotIndex = formAttributeName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            // no dot found, just assign
            result[formAttributeName] = formAttributeValue;
        } else {
            const parentKey = formAttributeName.slice(0, lastDotIndex);
            const childKey = formAttributeName.slice(lastDotIndex + 1);

            if (!result[parentKey]) {
                result[parentKey] = {};
            }
            result[parentKey][childKey] = formAttributeValue;
        }
    });

    return result;
}

/**
 * Maps the attribute content to a selection option with a label and a value
 */
export const mapAttributeContentToOptionValue = (
    content: BaseAttributeContentModel,
    descriptor: DataAttributeModel | CustomAttributeModel,
) => {
    const nonReferenceLabel =
        descriptor.contentType === AttributeContentType.Date
            ? getFormattedDate(content?.data as unknown as string)?.toString()
            : descriptor.contentType === AttributeContentType.Datetime
              ? getFormattedDateTime(content?.data as unknown as string)?.toString()
              : (content?.data as unknown as string)?.toString();
    return {
        label: content.reference ? content.reference : nonReferenceLabel,
        value: content,
    };
};

export const testAttributeSetFunction = (
    descriptor: DataAttributeModel | CustomAttributeModel,
    attribute: AttributeResponseModel | undefined,
    formAttributeName: string,
    setDefaultOnRequiredValuesOnly: boolean,
    forceDefaultDescriptorValue: boolean,
) => {
    let formAttributeValue = undefined;

    const appliedContent = forceDefaultDescriptorValue ? descriptor?.content : attribute?.content;

    function setMultiSelectListAttributeValue() {
        if (Array.isArray(appliedContent)) {
            formAttributeValue = appliedContent.map((content) => mapAttributeContentToOptionValue(content, descriptor));
        } else {
            formAttributeValue = undefined;
        }
    }

    function setSelectListAttributeValue() {
        if (appliedContent) {
            formAttributeValue = mapAttributeContentToOptionValue(appliedContent[0], descriptor);
        } else {
            formAttributeValue = undefined;
        }
    }

    function setBooleanAttributeValue() {
        if (appliedContent?.[0]?.data !== undefined) {
            formAttributeValue = appliedContent[0].data;
        } else if (descriptor.properties.required) {
            // set value to false, if attribute is required, has no value, and no default value are provided
            // otherwise allow the value to be undefined
            formAttributeValue = descriptor.content?.[0]?.data ?? false;
        } else {
            formAttributeValue = descriptor.content?.[0]?.data;
        }
    }

    if (descriptor.properties?.list && descriptor.properties?.multiSelect) {
        setMultiSelectListAttributeValue();
    } else if (descriptor.properties?.list) {
        setSelectListAttributeValue();
    } else if (appliedContent) {
        formAttributeValue = appliedContent[0].reference ?? appliedContent[0].data;
    } else if (descriptor.content && descriptor.content.length > 0 && (!setDefaultOnRequiredValuesOnly || descriptor.properties.required)) {
        // This acts as a fallback for the case when the attribute has no value, but has a default value in the descriptor
        formAttributeValue = descriptor.content[0].reference ?? descriptor.content[0].data;
    }

    if (descriptor.contentType === AttributeContentType.Codeblock && formAttributeValue !== undefined) {
        if ((formAttributeValue as CodeBlockAttributeContentDataModel).code !== undefined) {
            formAttributeValue = {
                code: base64ToUtf8((formAttributeValue as CodeBlockAttributeContentDataModel).code),
                language: (formAttributeValue as CodeBlockAttributeContentDataModel).language,
            };
        } else {
            formAttributeValue = {
                language: (formAttributeValue as CodeBlockAttributeContentDataModel).language,
            };
        }
    }
    if (descriptor.contentType === AttributeContentType.Boolean) {
        setBooleanAttributeValue();
    }

    return {
        formAttributeName,
        formAttributeValue,
    };
};
