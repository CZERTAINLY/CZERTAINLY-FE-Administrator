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


// same empty array is used to prevent re-rendering of the component
// !!! never modify the attributes field inside of the component !!!
const emptyAttributes: AttributeModel[] = [];


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
   attributes = emptyAttributes,
   authorityUuid,
   connectorUuid,
   functionGroupCode,
   kind
}: Props) {

   const dispatch = useDispatch();

   const form = useForm();
   const formState = useFormState();

   // data from callbacks
   const callbackData = useSelector(connectorSelectors.callbackData);

   // used to check if descritors have changed
   const [prevDescriptors, setPrevDescriptors] = useState<AttributeDescriptorModel[]>();

   // used to check if attributes have changed
   const [prevAttributes, setPrevAttributes] = useState<AttributeModel[]>();

   // options for selects
   const [options, setOptions] = useState<{ [attributeName: string]: { label: string, value: any }[] }>({});

   // stores previous values of form in order to be possible to detect attribute changes
   const [previousFormValues, setPreviousFormValues] = useState<{ [name: string]: any }>({});

   // stores previous callback data in order to be possible to detect what data changed
   const [previousCallbackData, setPreviousCallbackData] = useState<{ [callbackId: string]: any; }>({});


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
   const buildDynamicCallbackMappings = useCallback(

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
    * Builds mappings for callback from the attribute descriptor
    */
   const buildStaticCallbackMappings = useCallback(

      (descriptor: AttributeDescriptorModel): AttributeCallbackDataModel | undefined => {

         let isDynamicMapping = false;

         const data: AttributeCallbackDataModel = {
            uuid: "",
            name: "",
            pathVariable: {},
            queryParameter: {},
            body: {}
         };

         descriptor.callback?.mappings.forEach(

            mapping => {

               if (mapping.from) isDynamicMapping = true;

               mapping.targets.forEach(
                  target => {
                     data[target][mapping.to] = mapping.value
                  }
               )

            }

         );

         return isDynamicMapping ? undefined : data;

      },
      []

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
    * Clean form attributes and previous form state whenever passed attribute descriptors or attributes changed
    */
   useEffect(
      () => {

         // variables are passed just to prevent linting error, they are unused in the clearAttributes function
         form.mutators.clearAttributes(attributeDescriptors, attributes);

      },
      [attributeDescriptors, attributes, form.mutators]
   );


   /**
    * Called on first render
    * Setups final form values and initial values (based on descriptors and attributes passed)
    * Setups "static" options for selects from the attribute descriptors
    * Performs initial callbacks
    */
   useEffect(

      () => {

         // run this effect only when attribute descripotors or attributes changed
         if (attributeDescriptors === prevDescriptors && attributes === prevAttributes) return;

         let newOptions: { [attributeName: string]: { label: string; value: any; }[] } = {};

         attributeDescriptors.forEach(

            descriptor => {

               const formAttributeName = `__attributes__${id}__.${descriptor.name}`;

               const attribute = attributes.find(a => a.name === descriptor.name);


               // Build "static" options from the descriptor

               if (descriptor.list && Array.isArray(descriptor.content)) {

                  newOptions = { ...newOptions, [formAttributeName]: descriptor.content.map(data => ({ label: data.value as string, value: data })) };

               }


               // Perform initial callbacks based on "static" mappings

               if (descriptor.callback) {

                  const mappings = buildStaticCallbackMappings(descriptor);

                  if (mappings) {

                     console.log(mappings);

                     mappings.name = descriptor.name;
                     mappings.uuid = descriptor.uuid;

                     const url = authorityUuid
                        ?
                        `${authorityUuid}/callback`
                        :
                        `connectors/${connectorUuid}/${functionGroupCode}/${kind}/callback`
                        ;

                     dispatch(

                        connectorActions.callback({
                           callbackId: formAttributeName,
                           url,
                           callbackData: mappings
                        })

                     );

                  }

               }

               // Set initial values from the attribute

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

         setOptions({ ...options, ...newOptions });

         setPrevDescriptors(attributeDescriptors);
         setPrevAttributes(attributes);

      },
      [id, attributeDescriptors, attributes, form.mutators, buildStaticCallbackMappings, options, dispatch, authorityUuid, connectorUuid, functionGroupCode, kind, prevDescriptors, prevAttributes]

   )


   /**
    * Called on every form change
    * Evaluates changed attributes and eventually performs a callback whenever necessary
    */
   useEffect(

      () => {

         if (previousFormValues === formState.values) return;

         const changedAttributes: { [name: string]: { previous: any, current: any } } = {};

         for (const key in formState.values) {

            if (key.startsWith("__attributes__")) {

               for (const attrKey in formState.values[key]) {

                  if (previousFormValues[key] === undefined || previousFormValues[key][attrKey] === undefined || previousFormValues[key][attrKey] !== formState.values[key][attrKey]) {

                     changedAttributes[attrKey] = {
                        previous: previousFormValues[key] !== undefined && previousFormValues[key][attrKey] !== undefined ? previousFormValues[key][attrKey] : undefined,
                        current: formState.values[key][attrKey]
                     }

                  }

               }

            }

         }

         if (Object.keys(changedAttributes).length > 0) {
            console.group("Attributes changed");
            console.log(changedAttributes);
            console.groupEnd();
         }

         setPreviousFormValues(formState.values);

      },
      [previousFormValues, formState.values]

   );


   /**
    * Called on first render
    * Fills the form with passed attribute values
    * "Static callbacks" for predefined values are performed
    * If attributes were passed to the attribute form, "dynamic callbacks" are performed
    */
   /*useEffect(

      () => {

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

                  if (send) {

                     form.mutators.setAttribute(`__attributes__${id}__.${descriptor.name}`, undefined);

                     dispatch(

                        connectorActions.callback({
                           callbackId,
                           url,
                           callbackData
                        })

                     );

                  }


                  prevCbData[callbackId + url] = callbackDataStringified;
                  updatePrevCbData = true;

               }

            }

         );

         if (updatePrevCbData) setPreviousCallbackData(prevCbData);

      },
      [id, functionGroupCode, kind, authorityUuid, attributeDescriptors, connectorUuid]

   )*/




   /**
    * Obtains values from attribute callbacks and updates the form values / options accordingly
    */
   useEffect(

      () => {

         if (previousCallbackData === callbackData) return;

         for (const callbackId in callbackData) {

            if (callbackData[callbackId] === previousCallbackData[callbackId]) continue;

            console.log("Callback data changed", callbackId, callbackData[callbackId]);

            // Update options

            if (Array.isArray(callbackData[callbackId])) {
               setOptions({ ...options, [callbackId]: callbackData[callbackId].map((value: any) => ({ label: value.value, value })) });
            }

            // here should be updating of the other form values based on the callback data, but currently it is not necessary as there is no usecase for that

         }

         setPreviousCallbackData(callbackData);

      },
      [callbackData, options, previousCallbackData]

   )




   /*
      Attribute Form Rendering
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
                              options={options[`__attributes__${id}__.${descriptor.name}`]} />

                        </div>

                     )

                  )

               }

            </Widget>

         )

         return attrs;

      },
      [id, groupedAttributesDescriptors, options]

   );

   return <>{attrs}</>;

}
