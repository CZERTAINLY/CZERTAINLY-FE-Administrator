import styles from "./attributeDescriptorViewer.module.scss";

import cx from "classnames";
import { Table } from "reactstrap";

import { AttributeDescriptorModel } from "models/attributes"
import { AttributeType } from "types/attributes"
import { attributeFieldNameTransform } from "models/attributes";
import { useCallback, useMemo, useState } from "react";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

interface Props {
   attributeDescriptors: AttributeDescriptorModel[];
   ignoreValueTypes: AttributeType[];
}

export default function ({
   attributeDescriptors,
   ignoreValueTypes
}: Props) {


   const [expandedRows, setExpandedRows] = useState<string[]>([]);


   const toggleRow = useCallback(

      (uuid: string): void => {

         if (expandedRows.includes(uuid)) {
            setExpandedRows(expandedRows.filter(expuuid => expuuid !== uuid));
         } else {
            setExpandedRows([...expandedRows, uuid]);
         }

      },
      []

   );


   const getAttributeValues = useCallback(

      (attributeDescriptor: AttributeDescriptorModel) => {

         if (!attributeDescriptor.value) return "";

         if (
            typeof attributeDescriptor.value !== "string" &&
            ["LIST", "list", "array", "ARRAY", "BOOLEAN", "CREDENTIAL"].includes(
               attributeDescriptor.type
            )
         ) {
            return (attributeDescriptor.value as Array<any>)[0]
         } else {
            return attributeDescriptor.value;
         }

      },
      []

   );


   const getAttributeDetail = useCallback(

      (attributeDescriptor: AttributeDescriptorModel) => {
      },
      []

   )


   const headers: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Name"
         },
         {
            id: "required",
            content: "Required"
         },
         {
            id: "defaultValue",
            content: "Default Value"
         },
         {
            id: "details",
            content: "Details"
         }
      ],
      []

   );

   const data: TableDataRow[] = useMemo(

      () => attributeDescriptors.map(

         attributeDescriptor => ({

            id: attributeDescriptor.uuid,
            columns: [
               attributeDescriptor.label || attributeFieldNameTransform[attributeDescriptor.name] || attributeDescriptor.name,
               attributeDescriptor.required ? "Yes" : "No",
               getAttributeValues(attributeDescriptor)//,
               //getAttributeDetail(attributeDescriptor)
            ]

         })

      ),

      []
   );



   return (

      <>
         <CustomTable
            headers={headers}
            data={data}
         />

         <Table className="table-hover" size="sm">
            <thead>
               <tr>
                  <th>
                     <b>Name</b>
                  </th>

                  <th>
                     <b>Required</b>
                  </th>
                  <th>
                     <b>Default Value</b>
                  </th>
                  <th>
                     <b>Details</b>
                  </th>
               </tr>
            </thead>

            <tbody>

               {attributeDescriptors.map(

                  attributeDescriptor => (
                     <>

                        <tr>

                           <td>
                              {attributeDescriptor.label ||
                                 attributeFieldNameTransform[attributeDescriptor.name] ||
                                 attributeDescriptor.name}
                           </td>

                           <td>{attributeDescriptor.required ? "Yes" : "No"}</td>

                           <td>
                              {ignoreValueTypes.includes(attributeDescriptor.type)
                                 ? "************"
                                 : getAttributeValues(attributeDescriptor)}
                           </td>

                           <td onClick={() => toggleRow(attributeDescriptor.uuid)}>
                              <span className={styles.showMore}>Show more...</span>
                           </td>
                        </tr>

                        <tr className={cx(styles.detailRow, { [styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid) })}>

                           <td>

                              <div className={cx({ [styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid) })}>

                                 <p>
                                    <b>Name</b>: {attributeDescriptor.name}
                                 </p>

                                 <p>
                                    <b>Type</b>: {attributeDescriptor.type}
                                 </p>

                              </div>

                           </td>

                           <td>

                              <div className={cx({ [styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid) })}>

                                 <p>
                                    <b>Read Only</b>:{" "}
                                    {attributeDescriptor.readOnly ? "Yes" : "No"}
                                 </p>

                                 <p>
                                    <b>Editable</b>: {attributeDescriptor.editable ? "Yes" : "No"}
                                 </p>

                              </div>

                           </td>

                           <td>
                              <div className={cx({ [styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid) })}>

                                 <p>
                                    <b>Visible</b>: {attributeDescriptor.visible ? "No" : "Yes"}
                                 </p>

                                 <p>
                                    <b>Multiple Value</b>:{" "}
                                    {attributeDescriptor.multiValue ? "Yes" : "No"}
                                 </p>

                              </div>

                           </td>

                           <td className={"w-25"}>

                              <div className={cx({ [styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid) })}>

                                 <p>
                                    <b>Description</b>: {attributeDescriptor.description}
                                 </p>

                                 <p>
                                    <b>Validation Regex</b>: {attributeDescriptor.validationRegex}
                                 </p>

                              </div>

                           </td>

                        </tr>

                     </>

                  )

               )}

            </tbody>

         </Table>
      </>

   )

}