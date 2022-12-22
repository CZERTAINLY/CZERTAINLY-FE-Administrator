import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";

import { actions as discoveryActions, selectors as discoverySelectors } from "ducks/discoveries";
import { actions as connectorActions } from "ducks/connectors";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import Select from "react-select";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";
import { ConnectorResponseModel } from "types/connectors";
import { FunctionGroupCode } from "types/openapi";
import { AttributeDescriptorModel } from "types/attributes";


interface FormValues {
   name: string | undefined;
   discoveryProvider: { value: string; label: string } | undefined;
   storeKind: { value: string; label: string } | undefined;
}


export default function DiscoveryForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const discoveryProviders = useSelector(discoverySelectors.discoveryProviders);
   const discoveryProviderAttributeDescriptors = useSelector(discoverySelectors.discoveryProviderAttributeDescriptors);

   const isFetchingDiscoveryDetail = useSelector(discoverySelectors.isFetchingDetail);
   const isFetchingDiscoveryProviders = useSelector(discoverySelectors.isFetchingDiscoveryProviders);
   const isFetchingAttributeDescriptors = useSelector(discoverySelectors.isFetchingDiscoveryProviderAttributeDescriptors);
   const isCreating = useSelector(discoverySelectors.isCreating);

   const [init, setInit] = useState(true);
   const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

   const [discoveryProvider, setDiscoveryProvider] = useState<ConnectorResponseModel>();

   const isBusy = useMemo(
      () => isFetchingDiscoveryDetail || isFetchingDiscoveryProviders || isCreating || isFetchingAttributeDescriptors,
      [isFetchingDiscoveryDetail, isFetchingDiscoveryProviders, isCreating, isFetchingAttributeDescriptors]
   );

   useEffect(

      () => {

         if (init) {
             dispatch(discoveryActions.resetState());
             setInit(false);
             dispatch(connectorActions.clearCallbackData());
             dispatch(discoveryActions.listDiscoveryProviders());
         }

      },
      [dispatch, init]

   );


   const onDiscoveryProviderChange = useCallback(

      (event: { value: string }) => {

         dispatch(discoveryActions.clearDiscoveryProviderAttributeDescriptors());
         dispatch(connectorActions.clearCallbackData());
         setGroupAttributesCallbackAttributes([]);

         if (!event.value || !discoveryProviders) return;
         const provider = discoveryProviders.find(p => p.uuid === event.value);

         if (!provider) return;
         setDiscoveryProvider(provider);

      },
      [dispatch, discoveryProviders]

   );


   const onKindChange = useCallback(

      (event: { value: string }) => {

         if (!event.value || !discoveryProvider) return;
         dispatch(connectorActions.clearCallbackData());
         setGroupAttributesCallbackAttributes([]);
         dispatch(discoveryActions.getDiscoveryProviderAttributesDescriptors({ uuid: discoveryProvider.uuid, kind: event.value }));

      },
      [dispatch, discoveryProvider]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {
         dispatch(discoveryActions.createDiscovery({
            name: values.name!,
            connectorUuid: values.discoveryProvider!.value,
            kind: values.storeKind?.value!,
            attributes: collectFormAttributes("discovery", [...(discoveryProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes], values)
         }));

      },
      [dispatch, discoveryProviderAttributeDescriptors, groupAttributesCallbackAttributes]
   );


   const onCancel = useCallback(

      () => {
         navigate(-1);
      },
      [navigate]

   )


   const optionsForDiscoveryProviders = useMemo(

      () => discoveryProviders?.map(
         provider => ({
            label: provider.name,
            value: provider.uuid,
         })
      ),
      [discoveryProviders]

   );


   const optionsForKinds = useMemo(

      () => discoveryProvider?.functionGroups.find(
         fg => fg.functionGroupCode === "discoveryProvider"
      )?.kinds.map(
         kind => ({
            label: kind,
            value: kind
         })
      ) ?? [],
      [discoveryProvider]

   );


   return (

      <Widget title="Add discovery" busy={isBusy}>

         <Form onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, values, valid, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Discovery Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Enter the Discovery Name"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  <Field name="discoveryProvider" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="discoveryProvider">Discovery Provider</Label>

                           <Select
                              {...input}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForDiscoveryProviders}
                              placeholder="Select Discovery Provider"
                              onChange={(event) => { onDiscoveryProviderChange(event); form.mutators.clearAttributes(); form.mutators.setAttribute("storeKind", undefined); input.onChange(event); }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                        </FormGroup>

                     )}

                  </Field>

                  {discoveryProvider ? <Field name="storeKind" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="storeKind">Kind</Label>

                           <Select
                              {...input}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForKinds}
                              placeholder="Select Kind"
                              onChange={(event) => { onKindChange(event); input.onChange(event); }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>

                        </FormGroup>
                     )}
                  </Field> : undefined}

                  {discoveryProvider && values.storeKind && discoveryProviderAttributeDescriptors && discoveryProviderAttributeDescriptors.length > 0 ? (

                     <>
                        <hr />
                        <h6>Discovery Attributes</h6>
                        <hr />

                        <AttributeEditor
                           id="discovery"
                           attributeDescriptors={discoveryProviderAttributeDescriptors}
                           connectorUuid={discoveryProvider.uuid}
                           functionGroupCode={FunctionGroupCode.DiscoveryProvider}
                           kind={values.storeKind.value}
                           groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                           setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                        />
                     </>

                  ) : null}

                  {

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title="Create"
                              inProgressTitle="Creating..."
                              inProgress={submitting}
                              disabled={pristine || !valid}
                           />

                           <Button
                              color="default"
                              onClick={onCancel}
                              disabled={submitting}
                           >
                              Cancel
                           </Button>

                        </ButtonGroup>

                     </div>
                  }

               </BootstrapForm>

            )}

         </Form>

      </Widget>

   );

}
