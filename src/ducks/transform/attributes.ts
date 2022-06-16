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
      content: JSON.parse(JSON.stringify(attribute.content))
   }

}


export function transformAttributeModelToDTO(attribute: AttributeModel): AttributeDTO {

   return {
      uuid: attribute.uuid,
      name: attribute.name,
      label: attribute.label,
      type: attribute.type,
      content: JSON.parse(JSON.stringify(attribute.content))
   }

}


export function transformAttributeDescriptorDTOToModel(attributeDescriptor: AttributeDescriptorDTO): AttributeDescriptorModel {

   return {
      uuid: attributeDescriptor.uuid,
      name: attributeDescriptor.name,
      group: attributeDescriptor.group,
      type: attributeDescriptor.type,
      label: attributeDescriptor.label,
      required: attributeDescriptor.required,
      readOnly: attributeDescriptor.readOnly,
      visible: attributeDescriptor.visible,
      list: attributeDescriptor.list,
      multiSelect: attributeDescriptor.multiSelect,
      description: attributeDescriptor.description,
      validationRegex: attributeDescriptor.validationRegex ? new RegExp(attributeDescriptor.validationRegex) : undefined,
      callback: !attributeDescriptor.callback ? undefined : {
         callbackContext: attributeDescriptor.callback.callbackContext,
         callbackMethod: attributeDescriptor.callback.callbackMethod,
         mappings: attributeDescriptor.callback.mappings.map(
            mapping => ({
               from: mapping.from ? mapping.from : undefined,
               attributeType: mapping.attributeType ? mapping.attributeType : undefined,
               to: mapping.to,
               targets: mapping.targets,
               value: mapping.value
            })
         )
      },
      content: !attributeDescriptor.content ? undefined : JSON.parse(JSON.stringify(attributeDescriptor.content))
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