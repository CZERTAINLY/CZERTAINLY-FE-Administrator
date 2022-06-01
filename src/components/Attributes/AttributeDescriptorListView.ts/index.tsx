import styles from "./attributeDescriptorListView.module.scss";

import cx from "classnames";
import { Table } from "reactstrap";

import { AttributeDescriptorModel } from "models/attributes"
import { AttributeType } from "types/attributes"
import { attributeFieldNameTransform } from "models/attributes";
import { useState } from "react";

interface Props {
   attributeDescriptors: AttributeDescriptorModel[];
   ignoreValueTypes: AttributeType[];
}

export default function (props: Props) {

   const [ expandedRows, setExpandedRows ] = useState<string[]>([]);

   const toggleRow = (uuid: string): void => {

      if (expandedRows.includes(uuid)) {
         setExpandedRows(expandedRows.filter(expuuid => expuuid !== uuid));
      } else {
         setExpandedRows([ ...expandedRows, uuid ]);
      }

   }

   const getAttributesValues = (attributes: any) => {

      if (!attributes.value) return "";

      if (
         typeof attributes.value !== "string" &&
         ["LIST", "list", "array", "ARRAY", "BOOLEAN", "CREDENTIAL"].includes(
            attributes.type
         )
      ) {
         return attributes.value[0];
      } else {
         return attributes.value;
      }

   };

   return (

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

            {props.attributeDescriptors.map(

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
                           {props.ignoreValueTypes.includes(attributeDescriptor.type)
                              ? "************"
                              : getAttributesValues(attributeDescriptor)}
                        </td>

                        <td onClick={() =>toggleRow(attributeDescriptor.uuid)}>
                           <span className={styles.showMore}>Show more...</span>
                        </td>
                     </tr>

                     <tr className={cx(styles.detailRow, { [styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid) })}>

                        <td>

                           <div className={cx({[styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid) })}>

                              <p>
                                 <b>Name</b>: {attributeDescriptor.name}
                              </p>

                              <p>
                                 <b>Type</b>: {attributeDescriptor.type}
                              </p>

                           </div>

                        </td>

                        <td>

                           <div className={cx({[styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid)})}>

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
                           <div className={cx({[styles.hidden]: !expandedRows.includes(attributeDescriptor.uuid) })}>

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

   )

}