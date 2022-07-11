import { useDispatch, useSelector } from "react-redux";
import { useForm, useFormState } from "react-final-form";

import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { AttributeDescriptorCallbackMappingModel } from "models/attributes/AttributeDescriptorCallbackMappingModel";

import { selectors as connectorSelectors, actions as connectorActions } from "ducks/connectors";

import Widget from "components/Widget";
import { FunctionGroupCode } from "types/connectors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AttributeCallbackDataModel } from "models/attributes/AttributeCallbackDataModel";
import { AttributeContentModel } from "models/attributes/AttributeContentModel";
import { Attribute } from "./Attribute";
import { FileAttributeContentModel } from "models/attributes/FileAttributeContentModel";


interface Props {
   id: string;
   attributeDescriptors: AttributeDescriptorModel[];
   attributes?: AttributeModel[];
   authorityUuid?: string;
   connectorUuid?: string;
   functionGroupCode?: FunctionGroupCode;
   kind?: string;
}


export default function AttributeEditor({
   id,
   attributeDescriptors,
   attributes = [],
   authorityUuid,
   connectorUuid,
   functionGroupCode,
   kind
}: Props) {

   const dispatch = useDispatch();

   const form = useForm();
   const formState = useFormState();

   const callbackData = useSelector(connectorSelectors.callbackData);

   // stores options for selects from the attribute descriptor content and is updated by callbacks
   const [_callbackData, _setCallbackData] = useState<{ [callbackId: string]: AttributeContentModel[] }>({});

   const [_previousCallbackData, _setPreviousCallbackData] = useState<{ [urlid: string]: any }>({});


   /** Helper to have the stata avaialbe during the current call */
   let previousCallbackData = _previousCallbackData;
   const setPreviousCallbackData = useCallback(

      (data: { [urlid: string]: any }) => {
         // eslint-disable-next-line react-hooks/exhaustive-deps
         previousCallbackData = data;
         _setPreviousCallbackData(data);
      },
      [_setPreviousCallbackData]

   );


   /**
    * Clean form attributes and previous form state when attribute descriptors or attributes are changed
    */
   useEffect(
      () => {
         // variables are passed just to prevent linting error, otherwise they are unused
         form.mutators.clearAttributes(attributeDescriptors, attributes);
         setPreviousCallbackData({});
      },
      [attributeDescriptors, attributes, form.mutators, setPreviousCallbackData]
   );


   /**
    * Gets the value from the object property identified by path
    */
   const getObjectPropertyValue = useCallback(

      (object: any, path: string) => {


         const pathParts = path.split(".");

         let currentObject = object;

         for (const pathPart of pathParts) {

            if (currentObject === undefined) {
               return undefined;
            }

            currentObject = currentObject[pathPart];
         }

         return currentObject;

      },
      []

   );


   /**
    * Gets the value of the attribute identified by the path (attributeName.propertyName.propertyName...)
    */
   const getAttributeValue = useCallback(

      (attributes: AttributeModel[], path: string | undefined): any => {

         if (!path) return undefined;

         if (!path.includes(".")) return attributes.find(a => a.name === path)?.content;

         let spath = path.split(".");

         return getObjectPropertyValue(attributes.find(a => a.name === spath[0])?.content, spath.slice(1).join("."));

      },
      [getObjectPropertyValue]

   );


   /**
    * Gets the value from the current input state or from the attribute or from the default value of the attribute descriptor.
    */
   const getCurrentFromMappingValue = useCallback(

      (descriptor: AttributeDescriptorModel, mapping: AttributeDescriptorCallbackMappingModel): any => {

         const attributeFromValue = getAttributeValue(attributes, mapping.from);

         const formAttributes = !(formState.values[`__attributes__${id}__`]) ? undefined : formState.values[`__attributes__${id}__`];
         const formMappingName = mapping.from ? mapping.from.includes(".") ? mapping.from.split(".")[0] : mapping.from : "";
         const formAttribute = formAttributes ? Object.keys(formAttributes).find(key => key.startsWith(`${formMappingName}`)) : undefined;

         // only lists are supported now, because of this the 'value' is added to the path as the list selected option is { label: "", value: "" }
         const formMappingPath = mapping.from ? mapping.from.includes(".") ? "value." + mapping.from.split(".").slice(1).join(".") : "value" : "value";
         const currentContent = formAttribute ? getObjectPropertyValue(formAttributes[formAttribute], formMappingPath) : undefined;

         return currentContent || attributeFromValue || descriptor.content;

      },

      [attributes, formState.values, getAttributeValue, getObjectPropertyValue, id]

   );


   /**
    * Builds mappingg of values taken from the form, attribute or attribute descriptor
    * for the callback as defined by the API
    */
   const buildCallbackMappings = useCallback(

      (descriptor: AttributeDescriptorModel): AttributeCallbackDataModel => {

         const data: AttributeCallbackDataModel = {
            uuid: "",
            name: "",
            pathVariable: {},
            queryParameter: {},
            body: {}
         };

         descriptor.callback?.mappings.forEach(

            mapping => mapping.targets.forEach(
               target => {
                  data[target][mapping.to] = mapping.value || getCurrentFromMappingValue(descriptor, mapping)
               }
            )

         );

         return data;

      },
      [getCurrentFromMappingValue]

   );


   /**
    * Performs the attribute callback on first render or when the form attribute values changes
    * Unfortunately, this effect is called everytime any of the form values changes so performance is not as good as it could be
    * On the first render, all callback has to be called
    * On other renders just those callback with the 'from' mapping defined and only when for the particulat form attribute values changes
    */
   useEffect(

      () => {

         const prevCbData = { ...previousCallbackData };
         let updatePrevCbData: boolean = false;

         attributeDescriptors.forEach(

            descriptor => {

               if (!descriptor.callback) return;

               const callbackData = buildCallbackMappings(descriptor);

               callbackData.uuid = descriptor.uuid;
               callbackData.name = descriptor.name;

               const callbackId = `__attributes__${id}__.${descriptor.name}`;

               const url = authorityUuid
                  ?
                  `${authorityUuid}/callback`
                  :
                  `connectors/${connectorUuid}/${functionGroupCode}/${kind}/callback`
                  ;


               const callbackDataStringified = JSON.stringify(callbackData);

               if (previousCallbackData[callbackId + url] !== callbackDataStringified) {

                  let send = true;

                  for (const v in callbackData.pathVariable) if (callbackData.pathVariable[v] === undefined) send = false;
                  for (const v in callbackData.queryParameter) if (callbackData.queryParameter[v] === undefined) send = false;
                  for (const v in callbackData.body) if (callbackData.body[v] === undefined) send = false;

                  if (send) dispatch(connectorActions.callback({
                     callbackId,
                     url,
                     callbackData
                  }));


                  prevCbData[callbackId + url] = callbackDataStringified;
                  updatePrevCbData = true;

               }

            }

         );

         if (updatePrevCbData) setPreviousCallbackData(prevCbData);

      },
      [attributeDescriptors, authorityUuid, buildCallbackMappings, connectorUuid, dispatch, functionGroupCode, id, kind, previousCallbackData, setPreviousCallbackData]

   )


   /**
    * Groups attributes for rendering according to the attribute descriptor group property
    */
   const groupedAttributesDescriptors: { [key: string]: AttributeDescriptorModel[] } = useMemo(

      () => {

         const grouped: { [key: string]: AttributeDescriptorModel[] } = {};

         attributeDescriptors.forEach(

            descriptor => {

               const groupName = descriptor.group || "__";
               grouped[groupName] ? grouped[groupName].push(descriptor) : grouped[groupName] = [descriptor]

            }

         );

         return grouped;

      },
      [attributeDescriptors]

   );


   /**
    * Obtains values from attribute callbacks prepares options for the selects
    */
   useEffect(

      () => {

         for (const callbackId in callbackData) {
            if (callbackData[callbackId] !== _callbackData[callbackId]) _setCallbackData({ ..._callbackData, [callbackId]: callbackData[callbackId] });
         }

      },
      [callbackData, _callbackData]

   )


   /**
    * Setups "static"options for selects
    * Setups final form values and initial values and for attributes
    */
   useEffect(

      () => {

         attributeDescriptors.forEach(

            descriptor => {

               const formAttributeName = `__attributes__${id}__.${descriptor.name}`;

               if (descriptor.list && Array.isArray(descriptor.content) && !_callbackData[formAttributeName]) {

                  _setCallbackData({
                     ..._callbackData,
                     [formAttributeName]: descriptor.content
                  })

               }

               if (formState.values[`__attributes__${id}__`] !== undefined && formState.values[`__attributes__${id}__`][descriptor.name] !== undefined) return;

               const attribute = attributes.find(a => a.name === descriptor.name);

               if (descriptor.type === "FILE") {

                  if (attribute?.content) {

                     form.mutators.setAttribute(`${formAttributeName}.value`, (attribute.content as FileAttributeContentModel).value);
                     form.mutators.setAttribute(`${formAttributeName}.contentType`, (attribute.content as FileAttributeContentModel).contentType || "unknown");
                     form.mutators.setAttribute(`${formAttributeName}.fileName`, (attribute.content as FileAttributeContentModel).fileName || "unknown");

                  } else if (descriptor.content) {

                     form.mutators.setAttribute(`${formAttributeName}.value`, (descriptor.content as FileAttributeContentModel).value);
                     form.mutators.setAttribute(`${formAttributeName}.contentType`, (descriptor.content as FileAttributeContentModel).contentType || "unknown");
                     form.mutators.setAttribute(`${formAttributeName}.fileName`, (descriptor.content as FileAttributeContentModel).fileName || "unknown");

                  }

                  return;

               }

               let formAttributeValue = undefined;

               if (descriptor.list && descriptor.multiSelect) {

                  if (Array.isArray(attribute?.content)) {

                     formAttributeValue = attribute!.content.map(content => ({ label: content.value, value: content }))

                  } else if (attribute?.content) {

                     formAttributeValue = [{ label: attribute!.content.value, value: attribute!.content }]


                  } else if (Array.isArray(descriptor?.content)) {

                     formAttributeValue = descriptor.content.map(content => ({ label: content.value, value: content }))

                  } else if (descriptor?.content) {

                     formAttributeValue = [{ label: descriptor!.content.value, value: descriptor!.content }]

                  }

               } else if (descriptor.list) {

                  if (attribute?.content) {

                     formAttributeValue = { label: (attribute.content as AttributeContentModel).value, value: attribute.content }

                  } else if (descriptor.content) {

                     formAttributeValue = { label: (descriptor.content as AttributeContentModel).value, value: descriptor.content }

                  }

               } else if (attribute?.content) {

                  formAttributeValue = (attribute?.content as AttributeContentModel).value;

               } else if (descriptor.content) {

                  formAttributeValue = (descriptor.content as AttributeContentModel).value;

               }

               form.mutators.setAttribute(formAttributeName, formAttributeValue);

            }

         )

      },
      [attributeDescriptors, attributes, form.mutators, id, _callbackData, formState.values]

   )

   /*
      Attribute Form Rendering
      All values are stored in the final form state already
      Options for selects are prepared in the useEffect hook above
   */

   const attrs = useMemo(

      () => {

         const attrs: JSX.Element[] = [];

         for (const group in groupedAttributesDescriptors) attrs.push(

            <Widget key={group} title={<h6>{group === "__" ? "" : group}</h6>}>

               {

                  groupedAttributesDescriptors[group].map(

                     descriptor => (

                        <div key={descriptor.name}>

                           <Attribute
                              name={`__attributes__${id}__.${descriptor.name}`}
                              descriptor={descriptor}
                              options={_callbackData[`__attributes__${id}__.${descriptor.name}`]?.map(data => ({ label: data.value.toString(), value: data.value })) } />

                        </div>

                     )

                  )

               }


               <pre>{JSON.stringify(formState.values, null, 3)}</pre>

               {
                  groupedAttributesDescriptors[group].map(

                     descriptor => (

                        <div key={`__${descriptor.name}`}>

                           <hr />
                           <pre>id={id}</pre>
                           <pre>descriptor={JSON.stringify(descriptor, null, 3)}</pre>
                           <pre>attribute={JSON.stringify(attributes.find(a => a.name === descriptor.name), null, 3)}</pre>

                        </div>

                     )

                  )

               }

            </Widget>

         )

         return attrs;

      },
      [attributes, formState.values, groupedAttributesDescriptors, id, _callbackData]

   );

   return <>{attrs}</>;

}
