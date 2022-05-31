import { AttributeDescriptorDTO, AttributeDTO, AttributeDescriptorCollectionDTO } from "api/_common/attributeDTO";
import { ConnectorHealthDTO } from "api/connectors";
import { AttributeDescriptorCollectionModel, AttributeDescriptorModel, AttributeModel } from "models/attributes";
import { ConnectorHealthModel, ConnectorHealthPartModel } from "models/connectors";
import { FunctionGroupCode } from "types/connectors";


export function transformAttributeDTOToModel(attribute: AttributeDTO): AttributeModel {

   return {
      uuid: attribute.uuid,
      name: attribute.name,
      label: attribute.label,
      type: attribute.type,
      value: attribute.value
   }

}


export function transformAttributeModelToDTO(attribute: AttributeModel): AttributeDTO {

   return {
      uuid: attribute.uuid,
      name: attribute.name,
      label: attribute.label,
      type: attribute.type,
      value: attribute.value
   }

}


export function transformAttributeDescriptorDTOToModel(attributeDesctiptor: AttributeDescriptorDTO): AttributeDescriptorModel {

   return {
      uuid: attributeDesctiptor.uuid,
      name: attributeDesctiptor.name,
      type: attributeDesctiptor.type,
      label: attributeDesctiptor.label,
      required: attributeDesctiptor.required,
      readOnly: attributeDesctiptor.readOnly,
      editable: attributeDesctiptor.editable,
      visible: attributeDesctiptor.visible,
      multiValue: attributeDesctiptor.multiValue,
      description: attributeDesctiptor.description,
      dependsOn: attributeDesctiptor.dependsOn ? attributeDesctiptor.dependsOn.map(dep => ({ name: dep.name, value: dep.value })) : undefined,
      validationRegex: attributeDesctiptor.validationRegex,
      attributeCallback: attributeDesctiptor.attributeCallback ? {
         callbackContext: attributeDesctiptor.attributeCallback.callbackContext,
         callbackMethod: attributeDesctiptor.attributeCallback.callbackMethod,
         mappings: attributeDesctiptor.attributeCallback.mappings.map(mapping => ({
            from: mapping.from,
            to: mapping.to,
            attributeType: mapping.attributeType,
            targets: [...mapping.targets],
            value: typeof mapping.value === "object" ? JSON.parse(JSON.stringify(mapping.value)) : mapping.value ? mapping.value : undefined
         }))
      } : undefined,
      value: typeof attributeDesctiptor.value === "object" ? JSON.parse(JSON.stringify(attributeDesctiptor.value)) : attributeDesctiptor.value
   }

}


export function transfromAttributeDescriptorCollectionDTOToModel(collection: AttributeDescriptorCollectionDTO): AttributeDescriptorCollectionModel {

   const result: AttributeDescriptorCollectionModel = {};

   for (const key in collection) {

      const functionFroup = key as FunctionGroupCode;

      result[functionFroup] = {};

      for (const kind in collection[functionFroup]) {

         result[functionFroup]![kind] = collection[functionFroup]![kind].map(
            attrDesc => transformAttributeDescriptorDTOToModel(attrDesc)
         )

      }

   }

   return result;

}


export function transformConnectorHealthDTOToModel(health: ConnectorHealthDTO): ConnectorHealthModel {

   const parts: ConnectorHealthPartModel | undefined = health.parts ? {} : undefined;

   if (parts) {

      for (const key in health.parts) {
         parts[key] = transformConnectorHealthDTOToModel(health.parts[key])
      }

   }

   return {
      status: health.status,
      description: health.description,
      parts
   }

}