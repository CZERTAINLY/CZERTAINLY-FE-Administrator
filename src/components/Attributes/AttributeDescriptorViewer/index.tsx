import { attributeFieldNameTransform, getAttributeContent } from "utils/attributes/attributes";
import { useMemo } from "react";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { AttributeDescriptorModel, isDataAttributeModel } from "types/attributes";
import { AttributeConstraintType } from "types/openapi";

interface Props {
   attributeDescriptors: AttributeDescriptorModel[];
}

export default function AttributeDescriptorViewer({
   attributeDescriptors,
}: Props) {

   const headers: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Name",
            width: "20%"
         },
         {
            id: "required",
            content: "Required",
            width: "10%"
         },
         {
            id: "defaultValue",
            content: "Default Value",
            width: "10%"
         }
      ],
      []

   );

   const data: TableDataRow[] = useMemo(

      () => attributeDescriptors.map(

         attributeDescriptor => {
             if (!isDataAttributeModel(attributeDescriptor)) return { id: attributeDescriptor.name, columns: [] };
             const regex = attributeDescriptor.constraints?.find(c => c.type === AttributeConstraintType.RegExp);
             return {

                 id: attributeDescriptor.name,
                 columns: [
                     attributeDescriptor.properties.label || attributeFieldNameTransform[attributeDescriptor.name] || attributeDescriptor.name,
                     attributeDescriptor.properties.required ? "Yes" : "No",
                     getAttributeContent(attributeDescriptor.contentType, attributeDescriptor.content),
                     //getAttributeDetail(attributeDescriptor)
                 ],
                 detailColumns: [
                     <></>,
                     <></>,
                     <></>,
                     <CustomTable
                         headers={[{ id: "name", content: "Name" }, { id: "value", content: "Value" }]}
                         data={[
                             { id: "name", columns: [<b>Name</b>, attributeDescriptor.name] },
                             { id: "desc", columns: [<b>Description</b>, attributeDescriptor.description || "Not set"] },
                             { id: "label", columns: [<b>Label</b>, attributeDescriptor.properties.label] },
                             { id: "group", columns: [<b>Group</b>, attributeDescriptor.properties.group || "Not set"] },
                             { id: "type", columns: [<b>Type</b>, attributeDescriptor.contentType] },
                             { id: "required", columns: [<b>Required</b>, attributeDescriptor.properties.required ? "Yes" : "No"] },
                             { id: "readOnly", columns: [<b>Read Only</b>, attributeDescriptor.properties.readOnly ? "Yes" : "No"] },
                             { id: "list", columns: [<b>List</b>, attributeDescriptor.properties.list ? "Yes" : "No"] },
                             { id: "multiValue", columns: [<b>Multiple Values</b>, attributeDescriptor.properties.multiSelect ? "Yes" : "No"] },
                             { id: "validationRegex", columns: [<b>Validation Regex</b>, regex?.data ? regex.data.toString() : "Not set"] },
                             {
                                 id: "defaults", columns: [<b>Defaults</b>, getAttributeContent(attributeDescriptor.contentType, attributeDescriptor.content)
                                 ]
                             },
                         ]}
                         hasHeader={false}
                     />
                 ]

             }
         }

      ),
      [attributeDescriptors]
   );



   return (

      <CustomTable
         headers={headers}
         data={data}
         hasDetails={true}
      />

   )

}