import {
   AttributeCallback, AttributeCallbackMapping,
   AttributeType, BaseAttributeConstraint,
   BaseAttributeContent,
   BaseAttributeDto,
   BooleanAttributeContent,
   CredentialAttributeContent,
   CredentialDto,
   DataAttribute, DataAttributeProperties,
   DateAttributeContent, DateTimeAttributeConstraint, DateTimeAttributeConstraintData,
   DateTimeAttributeContent,
   FileAttributeContent,
   FileAttributeContentData,
   FloatAttributeContent, GroupAttribute, InfoAttribute, InfoAttributeProperties,
   IntegerAttributeContent, LocalTime,
   MimeType,
   ObjectAttributeContent, RangeAttributeConstraint, RangeAttributeConstraintData, RegexpAttributeConstraint,
   RequestAttributeDto,
   ResponseAttributeDto,
   SecretAttributeContent,
   SecretAttributeContentData,
   StringAttributeContent,
   TextAttributeContent, TimeAttributeContent
} from "./openapi";
import { CredentialResponseModel } from "./credentials";

//TODO remove
export type AttributeCallbackMappingTarget_AttributeCallbackModel = "pathVariable" | "requestParameter" | "body";

//TODO remove
export type AttributeListValue = {
   id: number;
   name: string;
}
//TODO remove
export type AttributeValue = string | number | boolean | AttributeListValue;

//TODO remove
// export type AttributeType = "BOOLEAN" | "INTEGER" | "FLOAT" | "STRING" | "TEXT" | "DATE" | "TIME" | "DATETIME" | "FILE" | "SECRET" | "CREDENTIAL" | "JSON";

export type BooleanAttributeContentDto = BooleanAttributeContent;
export type BooleanAttributeContentModel = BooleanAttributeContentDto;

export type CredentialAttributeContentDto = CredentialAttributeContent;
export type CredentialAttributeContentModel = Omit<CredentialAttributeContentDto, "data"> & { data: CredentialResponseModel };

export type DateAttributeContentDto = DateAttributeContent;
export type DateAttributeContentModel = DateAttributeContentDto;

export type DateTimeAttributeContentDto = DateTimeAttributeContent;
export type DateTimeAttributeContentModel = DateTimeAttributeContentDto;

export type MimeTypeDto = MimeType;
export type MimeTypeModel = MimeTypeDto;

export type FileAttributeContentDataDto = FileAttributeContentData;
export type FileAttributeContentDataModel = Omit<FileAttributeContentDataDto, "mimeType"> & { mimeType: MimeTypeModel };

export type FileAttributeContentDto = FileAttributeContent;
export type FileAttributeContentModel = Omit<FileAttributeContentDto, "data"> & { data: FileAttributeContentDataModel };

export type FloatAttributeContentDto = FloatAttributeContent;
export type FloatAttributeContentModel = FloatAttributeContentDto;

export type IntegerAttributeContentDto = IntegerAttributeContent;
export type IntegerAttributeContentModel = IntegerAttributeContentDto;

export type ObjectAttributeContentDto = ObjectAttributeContent;
export type ObjectAttributeContentModel = ObjectAttributeContentDto;

export type SecretAttributeContentDataDto = SecretAttributeContentData;
export type SecretAttributeContentDataModel = SecretAttributeContentDataDto;

export type SecretAttributeContentDto = SecretAttributeContent;
export type SecretAttributeContentModel = Omit<SecretAttributeContentDto, "data"> & { data: SecretAttributeContentDataModel };

export type StringAttributeContentDto = StringAttributeContent;
export type StringAttributeContentModel = StringAttributeContentDto;

export type TextAttributeContentDto = TextAttributeContent;
export type TextAttributeContentModel = TextAttributeContentDto;

export type LocalTimeDto = LocalTime;
export type LocalTimeModel = LocalTimeDto;

export type TimeAttributeContentDto = TimeAttributeContent;
export type TimeAttributeContentModel = Omit<TimeAttributeContentDto, "data"> & { data: LocalTimeModel };

export type BaseAttributeContentDto = BaseAttributeContent;
export type BaseAttributeContentModel = BooleanAttributeContentModel | CredentialAttributeContentModel | DateAttributeContentModel | DateTimeAttributeContentModel | FileAttributeContentModel | FloatAttributeContentModel | IntegerAttributeContentModel | ObjectAttributeContentModel | SecretAttributeContentModel | StringAttributeContentModel | TextAttributeContentModel | TimeAttributeContentModel;

export type AttributeRequestDto = RequestAttributeDto;
export type AttributeRequestModel = Omit<AttributeRequestDto, "content"> & { content: Array<BaseAttributeContentModel> };

export type AttributeResponseDto = ResponseAttributeDto;
export type AttributeResponseModel = Omit<AttributeResponseDto, "content"> & { content?: Array<BaseAttributeContentModel> };

export type DataAttributePropertiesDto = DataAttributeProperties;
export type DataAttributePropertiesModel = DataAttributePropertiesDto;

export type DateTimeAttributeConstraintDataDto = DateTimeAttributeConstraintData;
export type DateTimeAttributeConstraintDataModel = DateTimeAttributeConstraintDataDto;

export type DateTimeAttributeConstraintDto = DateTimeAttributeConstraint;
export type DateTimeAttributeConstraintModel = Omit<DateTimeAttributeConstraintDto, "data"> & { data?: DateTimeAttributeConstraintDataModel };

export type RangeAttributeConstraintDataDto = RangeAttributeConstraintData;
export type RangeAttributeConstraintDataModel = RangeAttributeConstraintDataDto;

export type RangeAttributeConstraintDto = RangeAttributeConstraint;
export type RangeAttributeConstraintModel = Omit<RangeAttributeConstraintDto, "data"> & { data?: RangeAttributeConstraintDataModel };

export type RegexpAttributeConstraintDto = RegexpAttributeConstraint;
export type RegexpAttributeConstraintModel = RegexpAttributeConstraintDto;

export type BaseAttributeConstraintDto = BaseAttributeConstraint;
export type BaseAttributeConstraintModel = DateTimeAttributeConstraintModel | RangeAttributeConstraintModel | RegexpAttributeConstraintModel;

export type AttributeCallbackMappingDto = AttributeCallbackMapping;
export type AttributeCallbackMappingModel = AttributeCallbackMappingDto;

export type AttributeCallbackDto = AttributeCallback;
export type AttributeCallbackModel = Omit<AttributeCallbackDto, "mappings"> & { mappings: Array<AttributeCallbackMappingModel> };

export type DataAttributeDto = DataAttribute;
export type DataAttributeModel = Omit<DataAttributeDto, "content | properties | constraints | attributeCallback"> & { content?: Array<BaseAttributeContentModel>, properties: DataAttributePropertiesModel, constraints?: Array<BaseAttributeConstraintModel>, attributeCallback?: AttributeCallbackModel };

export type GroupAttributeDto = GroupAttribute;
export type GroupAttributeModel = Omit<GroupAttributeDto, "content | attributeCallback"> & { content?: Array<AttributeDescriptorModelNew>, attributeCallback?: AttributeCallbackModel };

export type InfoAttributePropertiesDto = InfoAttributeProperties;
export type InfoAttributePropertiesModel = InfoAttributePropertiesDto;

export type InfoAttributeDto = InfoAttribute;
export type InfoAttributeModel = Omit<InfoAttributeDto, "content | properties"> & { content: Array<BaseAttributeContentModel>, properties: InfoAttributePropertiesModel };

export type AttributeDescriptorDto = BaseAttributeDto;
export type AttributeDescriptorModelNew = DataAttributeModel | GroupAttributeModel | InfoAttributeModel; // TODO rename

export type AttributeDescriptorCollectionDto = {
   [functionGroup: string]: {
      [kind: string]: AttributeDescriptorDto[];
   }
}

// TODO rename
export type AttributeDescriptorCollectionModelNew = {
   [functionGroup: string]: {
      [kind: string]: AttributeDescriptorModelNew[];
   }
}

export const isDataAttributeModel = (attribute: AttributeDescriptorModelNew): attribute is DataAttributeModel => {
   return attribute.type === AttributeType.Data;
}
