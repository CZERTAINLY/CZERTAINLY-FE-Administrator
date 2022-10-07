import React, { useCallback, useMemo, useState } from "react";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { useDispatch, useSelector } from "react-redux";


import style from "./style.module.scss";
import { Button } from "reactstrap";

import { ResourceDetailModel, SubjectPermissionsModel } from "models";
import { actions as authActions, selectors as authSelectors } from "ducks/auth";
import Dialog from "components/Dialog";
import Spinner from "components/Spinner";

interface Props {
   resources?: ResourceDetailModel[]
   permissions?: SubjectPermissionsModel;
   disabled?: boolean;
   onPermissionsChanged?: (permissions: SubjectPermissionsModel) => void;
}

function RolePermissionsEditor({
   resources,
   permissions = { allowAllResources: false, resources: [] },
   disabled = false,
   onPermissionsChanged
}: Props) {

   const dispatch = useDispatch();

   const objects = useSelector(authSelectors.objects);

   const isFetchingObjects = useSelector(authSelectors.isFetchingObjects);

   const [expandedRow, setExpandedRow] = useState<string>();

   const [currentResource, setCurrentResource] = useState<ResourceDetailModel>();
   const [showObjectLevel, setShowObjectLevel] = useState<boolean>(false);

   const getPermissions = useCallback(

      (resource: ResourceDetailModel) => {
         const perms = permissions?.resources.find(r => r.name === resource.name)?.actions.join(", ");
         return perms ? <>&nbsp;&nbsp;&nbsp;{`(${perms})`}</> : "";
      },
      [permissions]
   )

   const clonePerms = useCallback(

      () => {

         return ({
            allowAllResources: permissions.allowAllResources,
            resources: permissions.resources.map(
               resource => ({
                  allowAllActions: resource.allowAllActions,
                  actions: [...resource.actions],
                  name: resource.name,
                  objects: resource.objects.map(
                     object => ({
                        uuid: object.uuid,
                        allow: [...object.allow],
                        deny: [...object.deny]
                     })
                  )
               })
            )
         })
      },
      [permissions]

   );

   const allowAllActions = useCallback(

      (resource: ResourceDetailModel, enable: boolean) => {

         const newPermissions: SubjectPermissionsModel = clonePerms();

         const resourcePermissions = newPermissions.resources.find(r => r.name === resource.name);

         if (resourcePermissions) {
            resourcePermissions.allowAllActions = enable;
            resourcePermissions.actions = [];
         } else {
            newPermissions.resources.push({
               name: resource.name,
               allowAllActions: enable,
               actions: [],
               objects: []
            });
         }

         onPermissionsChanged?.(newPermissions);

      },
      [clonePerms, onPermissionsChanged]

   )

   const allowAction = useCallback(

      (resource: ResourceDetailModel, action: string, enable: boolean) => {

         const newPermissions: SubjectPermissionsModel = clonePerms();

         const resourcePermissions = newPermissions.resources.find(r => r.name === resource.name);

         if (resourcePermissions) {

            if (enable) {
               resourcePermissions.actions.push(action);
            } else {
               resourcePermissions.actions = resourcePermissions.actions.filter(a => a !== action);
            }

         } else {

            newPermissions.resources.push({
               name: resource.name,
               allowAllActions: false,
               actions: [action],
               objects: []
            });

         }

         onPermissionsChanged?.(newPermissions);

      },
      [clonePerms, onPermissionsChanged]

   )


   const onEditObjectLevelPermissionsClick = useCallback(

      (resource: ResourceDetailModel) => {

         const objects = permissions.resources.find(r => r.name === resource.name)?.objects || [];

         dispatch(authActions.listObjects({ endpoint: resource.listObjectsEndpoint }));
         setCurrentResource(resource);
         setShowObjectLevel(true);

      },
      [dispatch, permissions.resources]

   );


   const onObjectLevelPermissionsChanged = useCallback(

      () => {
         setShowObjectLevel(false);
      },
      []

   );


   const objectLevelPermissions = useMemo(

      () => (

         <>

            <table className={style.objectLevelTable}>

               <thead>

                  <tr>
                     <th>Object Name</th>

                     {
                        currentResource?.actions.map(
                           action => (
                              <th key={action.uuid}>{action.displayName}</th>
                           )
                        )

                     }

                  </tr>

               </thead>

               <tbody>

                  {

                     objects?.map(
                        object => {

                           const objectPermissions = permissions.resources.find(r => r.name === currentResource?.name)?.objects.find(o => o.uuid === object.uuid);

                           return (

                              <tr key={object.uuid}>


                                 <td>{object.name || object.uuid}</td>

                                 {

                                    currentResource?.actions.map(

                                       action => (

                                          <td>

                                             <div className={style.objectPermissions}>

                                                <div>
                                                   <div title="Allow">A</div>
                                                   <input type="radio" checked={objectPermissions?.allow.includes("read")} name={object.uuid + " " + action.uuid} />
                                                </div>

                                                <div>
                                                   <div title="Deny">D</div>
                                                   <input type="radio" checked={objectPermissions?.deny.includes("read")} name={object.uuid + " " + action.uuid} />
                                                </div>

                                                <div>
                                                   <div title="Inherit">I</div>
                                                   <input type="radio" checked={!objectPermissions?.deny.includes("read") || !objectPermissions?.allow.includes("read")} name={object.uuid + " " + action.uuid} />
                                                </div>

                                             </div>

                                          </td>

                                       )

                                    )
                                 }

                              </tr>

                           )

                        }

                     )

                  }

               </tbody>

            </table>

            <Spinner active={isFetchingObjects} />

         </>

      ),
      [currentResource?.name, isFetchingObjects, objects, permissions.resources]

   );


   return (

      <>

         <label htmlFor="allResources">
            <input
               id="allResources"
               type="checkbox"
               checked={permissions?.allowAllResources || false}
               disabled={disabled}
               onChange={(e) => {
                  if (onPermissionsChanged && permissions) onPermissionsChanged({ ...permissions, allowAllResources: e.target.checked })
               }}
            />
            &nbsp;&nbsp;&nbsp;Allow All Resources
         </label>

         {

            permissions?.allowAllResources ? <></> : (

               resources?.map(

                  resource => (

                     <ul className={style.accordeon} key={resource.uuid} onMouseDown={(e) => setExpandedRow(resource.uuid)}>

                        <div className={style.accordeonLabel} data-selected={expandedRow === resource.uuid ? "true" : "false"} >

                           <strong>{resource.displayName}</strong>
                           {getPermissions(resource)}

                           <li style={{ float: "right" }}>

                              <label>

                                 <input
                                    type="checkbox"
                                    checked={permissions?.resources.find(r => r.name === resource.name)?.allowAllActions || false}
                                    disabled={disabled}
                                    onChange={(e) => allowAllActions(resource, e.target.checked)}
                                 />

                                 &nbsp;&nbsp;&nbsp;Allow All Actions

                              </label>

                           </li>

                        </div>


                        <div className={style.accordeonContent} data-selected={expandedRow === resource.uuid && !(permissions?.resources.find(r => r.name === resource.name)?.allowAllActions) ? "true" : "false"} >

                           {
                              !resource.objectAccess ? <></> : (
                                 <Button style={{ float: "right" }} onClick={() => onEditObjectLevelPermissionsClick(resource)}>Edit Object Level Permissions</Button>
                              )
                           }

                           {
                              resource.actions.map(

                                 action => (
                                    <li key={action.uuid}>

                                       <label>

                                          <input
                                             type="checkbox"
                                             checked={permissions?.resources.find(r => r.name === resource.name)?.actions.includes(action.name) || false}
                                             disabled={disabled}
                                             onChange={(e) => allowAction(resource, action.name, e.target.checked)}
                                          />

                                          &nbsp;&nbsp;&nbsp;{action.displayName}

                                       </label>


                                    </li>
                                 )

                              )
                           }

                        </div>

                     </ul>

                  )

               )

            )

         }


         <Dialog
            isOpen={showObjectLevel}
            caption="Edit Object Level Permissions"
            body={objectLevelPermissions}
            toggle={() => setShowObjectLevel(false)}
            size="lg"
            buttons={[
               { color: "danger", onClick: onObjectLevelPermissionsChanged, body: "OK" },
               { color: "secondary", onClick: () => setShowObjectLevel(false), body: "Cancel" },
            ]}
         />


      </>

   );
}

export default RolePermissionsEditor;
