import {
    AttributeCallback,
    AttributeCallbackMapping,
    AttributeMappingDto,
    AttributeType,
    BaseAttributeConstraint,
    BaseAttributeContentDto as BaseAttributeContent,
    BaseAttributeDto,
    BooleanAttributeContent,
    CodeBlockAttributeContent,
    CodeBlockAttributeContentData,
    CredentialAttributeContent,
    CredentialAttributeContentData,
    CustomAttribute,
    CustomAttributeProperties,
    DataAttribute,
    DataAttributeProperties,
    DateAttributeContent,
    DateTimeAttributeConstraint,
    DateTimeAttributeConstraintData,
    DateTimeAttributeContent,
    FileAttributeContent,
    FileAttributeContentData,
    FloatAttributeContent,
    GroupAttribute,
    InfoAttribute,
    InfoAttributeProperties,
    IntegerAttributeContent,
    MetadataAttribute,
    MetadataAttributeProperties,
    ObjectAttributeContent,
    RangeAttributeConstraint,
    RangeAttributeConstraintData,
    RegexpAttributeConstraint,
    RequestAttributeDto,
    ResponseAttributeDto,
    SecretAttributeContent,
    SecretAttributeContentData,
    StringAttributeContent,
    TextAttributeContent,
    TimeAttributeContent,
} from './openapi';

export type BooleanAttributeContentDto = BooleanAttributeContent;
export type BooleanAttributeContentModel = BooleanAttributeContentDto;

export type CredentialAttributeContentDataDto = CredentialAttributeContentData;
export type CredentialAttributeContentDataModel = Omit<CredentialAttributeContentDataDto, 'attributes'> & {
    attributes: Array<DataAttributeModel>;
};

export type CredentialAttributeContentDto = CredentialAttributeContent;
export type CredentialAttributeContentModel = Omit<CredentialAttributeContentDto, 'data'> & { data: CredentialAttributeContentDataModel };

export type DateAttributeContentDto = DateAttributeContent;
export type DateAttributeContentModel = DateAttributeContentDto;

export type DateTimeAttributeContentDto = DateTimeAttributeContent;
export type DateTimeAttributeContentModel = DateTimeAttributeContentDto;

export type FileAttributeContentDataDto = FileAttributeContentData;
export type FileAttributeContentDataModel = FileAttributeContentDataDto;

export type FileAttributeContentDto = FileAttributeContent;
export type FileAttributeContentModel = Omit<FileAttributeContentDto, 'data'> & { data: FileAttributeContentDataModel };

export type CodeBlockAttributeContentDataDto = CodeBlockAttributeContentData;
export type CodeBlockAttributeContentDataModel = CodeBlockAttributeContentDataDto;

export type CodeBlockAttributeContentDto = CodeBlockAttributeContent;
export type CodeBlockAttributeContentModel = Omit<CodeBlockAttributeContentDto, 'data'> & { data: CodeBlockAttributeContentDataModel };

export type FloatAttributeContentDto = FloatAttributeContent;
export type FloatAttributeContentModel = FloatAttributeContentDto;

export type IntegerAttributeContentDto = IntegerAttributeContent;
export type IntegerAttributeContentModel = IntegerAttributeContentDto;

export type ObjectAttributeContentDto = ObjectAttributeContent;
export type ObjectAttributeContentModel = ObjectAttributeContentDto;

export type SecretAttributeContentDataDto = SecretAttributeContentData;
export type SecretAttributeContentDataModel = SecretAttributeContentDataDto;

export type SecretAttributeContentDto = SecretAttributeContent;
export type SecretAttributeContentModel = Omit<SecretAttributeContentDto, 'data'> & { data: SecretAttributeContentDataModel };

export type StringAttributeContentDto = StringAttributeContent;
export type StringAttributeContentModel = StringAttributeContentDto;

export type TextAttributeContentDto = TextAttributeContent;
export type TextAttributeContentModel = TextAttributeContentDto;

export type TimeAttributeContentDto = TimeAttributeContent;
export type TimeAttributeContentModel = TimeAttributeContentDto;

export type BaseAttributeContentDto = BaseAttributeContent;
export type BaseAttributeContentModel =
    | BooleanAttributeContentModel
    | CredentialAttributeContentModel
    | DateAttributeContentModel
    | DateTimeAttributeContentModel
    | FileAttributeContentModel
    | FloatAttributeContentModel
    | IntegerAttributeContentModel
    | ObjectAttributeContentModel
    | SecretAttributeContentModel
    | StringAttributeContentModel
    | TextAttributeContentModel
    | TimeAttributeContentModel
    | CodeBlockAttributeContentModel;

export type AttributeRequestDto = RequestAttributeDto;
export type AttributeRequestModel = Omit<AttributeRequestDto, 'content'> & { content: Array<BaseAttributeContentModel> };

export type MappingAttributeDto = AttributeMappingDto;
export type AttributeMappingModel = MappingAttributeDto;

export type AttributeResponseDto = ResponseAttributeDto;
export type AttributeResponseModel = Omit<AttributeResponseDto, 'content'> & { content?: Array<BaseAttributeContentModel> };

export type DataAttributePropertiesDto = DataAttributeProperties;
export type DataAttributePropertiesModel = DataAttributePropertiesDto;

export type DateTimeAttributeConstraintDataDto = DateTimeAttributeConstraintData;
export type DateTimeAttributeConstraintDataModel = DateTimeAttributeConstraintDataDto;

export type DateTimeAttributeConstraintDto = DateTimeAttributeConstraint;
export type DateTimeAttributeConstraintModel = Omit<DateTimeAttributeConstraintDto, 'data'> & {
    data?: DateTimeAttributeConstraintDataModel;
};

export type RangeAttributeConstraintDataDto = RangeAttributeConstraintData;
export type RangeAttributeConstraintDataModel = RangeAttributeConstraintDataDto;

export type RangeAttributeConstraintDto = RangeAttributeConstraint;
export type RangeAttributeConstraintModel = Omit<RangeAttributeConstraintDto, 'data'> & { data?: RangeAttributeConstraintDataModel };

export type RegexpAttributeConstraintDto = RegexpAttributeConstraint;
export type RegexpAttributeConstraintModel = RegexpAttributeConstraintDto;

export type BaseAttributeConstraintDto = BaseAttributeConstraint;
export type BaseAttributeConstraintModel =
    | DateTimeAttributeConstraintModel
    | RangeAttributeConstraintModel
    | RegexpAttributeConstraintModel;

export type AttributeCallbackMappingDto = AttributeCallbackMapping;
export type AttributeCallbackMappingModel = AttributeCallbackMappingDto;

export type AttributeCallbackDto = AttributeCallback;
export type AttributeCallbackModel = Omit<AttributeCallbackDto, 'mappings'> & { mappings: Array<AttributeCallbackMappingModel> };

export type DataAttributeDto = DataAttribute;
export type DataAttributeModel = Omit<DataAttributeDto, 'content | properties | constraints | attributeCallback'> & {
    content?: Array<BaseAttributeContentModel>;
    properties: DataAttributePropertiesModel;
    constraints?: Array<BaseAttributeConstraintModel>;
    attributeCallback?: AttributeCallbackModel;
};

export type GroupAttributeDto = GroupAttribute;
export type GroupAttributeModel = Omit<GroupAttributeDto, 'content | attributeCallback'> & {
    content?: Array<AttributeDescriptorModel>;
    attributeCallback?: AttributeCallbackModel;
};

export type InfoAttributePropertiesDto = InfoAttributeProperties;
export type InfoAttributePropertiesModel = InfoAttributePropertiesDto;

export type InfoAttributeDto = InfoAttribute;
export type InfoAttributeModel = Omit<InfoAttributeDto, 'content | properties'> & {
    content: Array<BaseAttributeContentModel>;
    properties: InfoAttributePropertiesModel;
};

export type CustomAttributePropertiesDto = CustomAttributeProperties;
export type CustomAttributePropertiesModel = CustomAttributePropertiesDto;

export type CustomAttributeDto = CustomAttribute;
export type CustomAttributeModel = Omit<CustomAttributeDto, 'content | properties'> & {
    content?: Array<BaseAttributeContentModel>;
    properties: CustomAttributePropertiesModel;
};

export type MetadataAttributePropertiesDto = MetadataAttributeProperties;
export type MetadataAttributePropertiesModel = MetadataAttributePropertiesDto;

export type MetadataAttributeDto = MetadataAttribute;
export type MetadataAttributeModel = Omit<MetadataAttributeDto, 'content | properties'> & {
    content: Array<BaseAttributeContentModel>;
    properties: MetadataAttributePropertiesModel;
};

export type AttributeDescriptorDto = BaseAttributeDto;
export type AttributeDescriptorModel =
    | DataAttributeModel
    | GroupAttributeModel
    | InfoAttributeModel
    | CustomAttributeModel
    | MetadataAttributeModel;

export type AttributeDescriptorCollectionDto = {
    [functionGroup: string]: {
        [kind: string]: AttributeDescriptorDto[];
    };
};

export type AttributeDescriptorCollectionModel = {
    [functionGroup: string]: {
        [kind: string]: AttributeDescriptorModel[];
    };
};

export const isDataAttributeModel = (attribute: AttributeDescriptorModel): attribute is DataAttributeModel => {
    return attribute.type === AttributeType.Data;
};

export const isInfoAttributeModel = (attribute: AttributeDescriptorModel): attribute is InfoAttributeModel => {
    return attribute.type === AttributeType.Info;
};

export const isGroupAttributeModel = (attribute: AttributeDescriptorModel): attribute is GroupAttributeModel => {
    return attribute.type === AttributeType.Group;
};

export const isCustomAttributeModel = (attribute: AttributeDescriptorModel): attribute is CustomAttributeModel => {
    return attribute.type === AttributeType.Custom;
};

export const isCustomAttributeModelArray = (attributes: AttributeDescriptorModel[]): attributes is CustomAttributeModel[] => {
    return attributes.every(isCustomAttributeModel);
};

export const isAttributeDescriptorModel = (attribute: object): attribute is AttributeDescriptorModel => {
    return (
        (attribute as AttributeDescriptorModel).name !== undefined &&
        (attribute as AttributeDescriptorModel).uuid !== undefined &&
        (attribute as AttributeDescriptorModel).type !== undefined
    );
};
