import React, { useEffect, useState } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import { fieldTypeTransform } from "utils/fieldTypeTransform";
import { fieldNameTransform } from "utils/fieldNameTransform";
import { InputType } from "reactstrap/es/Input";
import { useDispatch } from "react-redux";
import Select from "react-select";
// import { validateCustom } from "utils/validators";
import {
  CallbackPathVariableDict,
  CallbackQueryParameterDict,
  CallbackRequestBodyDict,
} from "models/callback";
import { AttributeResponse } from "models/attributes";

interface Props {
  fieldInfo: AttributeResponse[];
  attributeFunction?: any;
  editMode?: boolean;
  callbackSelector?: any;
  actions?: any;
  connectorUuid?: string;
  setPassAttribute?: any;
  functionGroup?: string;
  kind?: string;
  authorityUuid?: string;
}

function DynamicForm({
  fieldInfo,
  attributeFunction,
  editMode,
  callbackSelector = false,
  actions,
  connectorUuid,
  setPassAttribute,
  functionGroup = "",
  kind = "",
  authorityUuid = "",
}: Props) {
  const [valueMap, setValueMap] = useState(new Map<string, any>());
  const [valueMapFull, setValueMapFull] = useState(new Map<string, any>());
  // eslint-disable-next-line
  const [hideMap, setHideMap] = useState(new Map<string, any>());
  const [callbackField, setCallbackField] = useState<string>();
  const dispatch = useDispatch();
  useEffect(() => {
    getValueMap();
    getHidden();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldInfo, attributeFunction, editMode]);

  useEffect(() => {
    if (callbackSelector && callbackSelector.length > 0) {
      let updated = fieldInfo;
      for (let i of updated) {
        if (i.name === callbackField) {
          i.value = callbackSelector;
        }
      }
      setPassAttribute(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackSelector]);

  const getValueMap = () => {
    let dict = new Map<string, any>();
    for (let field of fieldInfo) {
      if (field.value !== undefined) {
        if (
          fieldTypeTransform[field.type] === "select" ||
          field.type === "select"
        ) {
          dict.set(field.name, field.value[0]);
        } else {
          dict.set(field.name, field.value);
        }
      }
    }
    setValueMap(dict);
  };

  function checkCallback(fieldName: string) {
    let start = false;
    for (let i of fieldInfo) {
      if (fieldName === i.name) {
        start = true;
      }
      if (
        i.attributeCallback !== undefined &&
        i.attributeCallback &&
        start &&
        fieldName !== i.name
      ) {
        let isCallback = true;
        for (let key of Object.keys(i.attributeCallback?.mappings || [])) {
          if (Array.isArray(valueMapFull.get(key))) {
            isCallback = false;
          }
        }
        if (isCallback) {
          let updatedCallback = i.attributeCallback;
          let pathVariables: CallbackPathVariableDict = new Map<string, any>();
          let requestBody: CallbackRequestBodyDict = new Map<string, any>();
          let queryParameters: CallbackQueryParameterDict = new Map<
            string,
            any
          >();

          for (let mapping of i.attributeCallback?.mappings || []) {
            for (let target of mapping.targets) {
              if (
                valueMapFull.get(mapping.from || "") === undefined &&
                mapping.value === undefined
              ) {
                isCallback = false;
                break;
              }
              if (target === "pathVariable") {
                if (typeof valueMapFull.get(mapping.from || "") === "string") {
                  pathVariables[mapping.to] =
                    mapping.value || valueMapFull.get(mapping.from || "");
                } else {
                  pathVariables[mapping.to] =
                    mapping.value || valueMapFull.get(mapping.from || "").id;
                }
              }
              if (target === "requestParameter") {
                queryParameters[mapping.to] =
                  mapping.value || valueMapFull.get(mapping.from || "");
              }
              if (target === "body") {
                requestBody[mapping.to] =
                  mapping.value || valueMapFull.get(mapping.from || "");
              }
            }
          }

          if (isCallback) {
            updatedCallback.pathVariables = pathVariables;
            updatedCallback.queryParameters = queryParameters;
            updatedCallback.requestBody = requestBody;

            let requestCallback = JSON.parse(JSON.stringify(updatedCallback));
            setCallbackField(i.name);
            requestCallback.name = i.name;
            requestCallback.uuid = i.uuid;
            requestCallback.mappings = undefined;
            requestCallback.callbackMethod = undefined;
            requestCallback.callbackContext = undefined;

            dispatch(
              actions.requestCallback(
                connectorUuid,
                requestCallback,
                functionGroup,
                kind,
                authorityUuid
              )
            );
            return updatedCallback;
          }
          return null;
        }
      }
    }
    return null;
  }

  const isHidden = (field: any) => {
    if (typeof field.dependsOn === "undefined" || field.dependsOn === []) {
      if (!editMode) {
        return !field.visible;
      }
      return !field.editable;
    } else {
      return field.dependsOn.value !== valueMap.get(field.dependsOn.key);
    }
  };

  const getHidden = () => {
    let dict = new Map<string, any>();
    for (let field of fieldInfo) {
      if (!editMode) {
        dict.set(field.name, !field.visible && isHidden(field));
      } else {
        dict.set(field.name, !field.editable && isHidden(field));
      }
    }
    setHideMap(dict);
  };

  const onValueChange = (e: any, field: any) => {
    // let updated = valueMap;

    // updated.set(field.name, e.target?.value);
    // setValueMap(updated);
    // let updatedHidden = hideMap;
    // for (let i of fieldInfo) {
    //   updatedHidden.set(i.name, isHidden(i));
    // }
    // setHideMap(updatedHidden);
    if (field.multiValue) {
      field["value"] = e.map(function (value: any) {
        return value.value;
      });
    } else if (e.target?.type === "file") {
      let reader = new FileReader();
      reader.onload = function (ev) {
        const content = reader.result || "";
        field["value"] = Buffer.from(content).toString("base64");
      };
      reader.readAsArrayBuffer(e.currentTarget.files[0]);
    } else if (e.target?.type === "checkbox") {
      field["value"] = e.target?.checked;
    } else {
      if (fieldTypeTransform[field.type] === "number") {
        field["value"] = Number(e.target?.value || e.value);
      } else {
        field["value"] = e.target?.value || e.value;
      }
    }
    let updValueMap = valueMapFull;
    updValueMap.set(field["name"], field["value"]);
    setValueMapFull(updValueMap);
    let updatedCallback = checkCallback(field["name"]);
    field["attributeCallback"] = updatedCallback;
    attributeFunction(field);
  };

  const fieldList = () => {
    let fieldHtml = [];

    for (let field of fieldInfo) {
      let valueForDropdown = [];
      if (
        fieldTypeTransform[field.type] === "select" &&
        field.value !== undefined
      ) {
        try {
          for (let option of field.value) {
            if (typeof option === "string") {
              valueForDropdown.push({ label: option, value: option });
            } else {
              valueForDropdown.push({ label: option.name, value: option });
            }
          }
        } catch {
          if (typeof field.value === "string") {
            valueForDropdown.push({ label: field.value, value: field.value });
          } else {
            valueForDropdown.push({
              label: field.value.name,
              value: field.value.id,
            });
          }
        }
      }
      let defaultSelectValue: any = {};
      if (fieldTypeTransform[field.type] === "select" && editMode) {
        if (
          typeof field.value[0] === "string" ||
          typeof field.value[0] === "number"
        ) {
          defaultSelectValue = {
            label: field.value[0],
            value: field.value[0],
          };
        } else {
          try {
            defaultSelectValue = {
              label: field.value[0].name,
              value: field.value[0],
            };
          } catch (error) {
            defaultSelectValue = {
              label: field.value.name,
              value: field.value,
            };
          }
        }
      }
      let inputField;
      if (fieldTypeTransform[field.type] === "select") {
        inputField = (
          <Select
            maxMenuHeight={140}
            options={valueForDropdown}
            placeholder="Select"
            menuPlacement="auto"
            onChange={(event) => onValueChange(event, field)}
            key={field.uuid}
            isMulti={field.multiValue}
            defaultValue={editMode ? defaultSelectValue : null}
          />
        );
      } else if (fieldTypeTransform[field.type] === "checkbox") {
        inputField = (
          <Input
            key={field.uuid}
            type={(fieldTypeTransform[field.type] || field.type) as InputType}
            placeholder={field.description}
            name={field.name.toString()}
            hidden={editMode ? !field.editable : !field.visible}
            onChange={(event) => onValueChange(event, field)}
            defaultChecked={field.value}
            disabled={field.readOnly}
          ></Input>
        );
      } else {
        inputField = (
          <Input
            key={field.uuid}
            type={(fieldTypeTransform[field.type] || field.type) as InputType}
            placeholder={field.description}
            name={field.name.toString()}
            hidden={
              editMode ? !field.visible || !field.editable : !field.visible
            }
            onChange={(event) => onValueChange(event, field)}
            defaultValue={field.value}
            disabled={field.readOnly}
            required={field.required}
            // valid={validateCustom(
            //   field.validationRegex || ("" as string) || "",
            //   valueMap.get(field.id?.toString())
            // )}
            // invalid={
            //   !validateCustom(
            //     field.validationRegex || ("" as string) || "",
            //     valueMap.get(field.id?.toString())
            //   )
            // }
          ></Input>
        );
      }
      fieldHtml.push(
        <div key={field.name}>
          <FormGroup key="formGroupDynamic">
            {(fieldTypeTransform[field.type] || field.type) === "checkbox" ? (
              <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
            ) : null}
            {(fieldTypeTransform[field.type] || field.type) === "checkbox"
              ? inputField
              : null}
            <Label
              check
              hidden={
                editMode ? !field.visible || !field.editable : !field.visible
              }
              key={field.name}
            >
              {field.label || fieldNameTransform[field.name] || field.name}
            </Label>
            {(fieldTypeTransform[field.type] || field.type) !== "checkbox"
              ? inputField
              : null}
          </FormGroup>
        </div>
      );
    }
    return fieldHtml;
  };
  return <div>{fieldList()}</div>;
}

export default DynamicForm;
