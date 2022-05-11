import { ConnectorFunctionGroupDTO } from "api/connectors";
import { AttributeResponse } from "models/attributes";

export function inIframe() {
  //Check if the window is directly loaded or loaded uisng an IFrame
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export function functionGroupChecker(
  finder: string,
  groups: ConnectorFunctionGroupDTO[]
): boolean {
  for (let i of groups) {
    if (i.functionGroupCode === finder) {
      return true;
    }
  }
  return false;
}

export function attributeCombiner(
  attribute: AttributeResponse[],
  connectorAttributes: AttributeResponse[]
): AttributeResponse[] {
  let noFillType = ["SECRET", "FILE"];
  let editAttributes: AttributeResponse[] = [];
  let attribIds = attribute.map(function (name: AttributeResponse) {
    return name.uuid;
  });
  for (let connAttrib of connectorAttributes) {
    if (attribIds.includes(connAttrib.uuid)) {
      for (let attrib of attribute) {
        if (attrib.uuid === connAttrib.uuid) {
          attrib.required = connAttrib.required;
          attrib.attributeCallback = connAttrib.attributeCallback;
          attrib.dependsOn = connAttrib.dependsOn;
          attrib.description = connAttrib.description;
          attrib.editable = connAttrib.editable;
          attrib.multiValue = connAttrib.multiValue;
          attrib.readOnly = connAttrib.readOnly;
          attrib.validationRegex = connAttrib.validationRegex;
          attrib.visible = connAttrib.visible;
          if (!noFillType.includes(attrib.type)) {
            if (attrib.value !== connAttrib.value) {
              if (
                ["DROPDOWN", "SELECT", "LIST", "CREDENTIAL"].includes(
                  connAttrib.type
                )
              ) {
                let updatedList = [attrib.value];
                if (connAttrib.value !== undefined) {
                  for (let i of connAttrib.value) {
                    if (!updatedList.includes(i)) {
                      updatedList.push(i);
                    }
                  }
                }
                connAttrib.value = updatedList;
                editAttributes.push(connAttrib);
              } else {
                editAttributes.push(attrib);
              }
            } else {
              editAttributes.push(attrib);
            }
          } else {
            editAttributes.push(connAttrib);
          }
        }
      }
    } else {
      if (
        ["DROPDOWN", "SELECT", "LIST", "CREDENTIAL"].includes(connAttrib.type)
      ) {
        connAttrib.value.unshift("NON_MANDATORY");
      }
      editAttributes.push(connAttrib);
    }
  }
  return editAttributes;
}
