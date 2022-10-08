import React, { useCallback, useMemo, useState } from "react";
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
                  objects: resource.objects?.map(
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

         dispatch(authActions.listObjects({ endpoint: resource.listObjectsEndpoint }));
         setCurrentResource(resource);
         setShowObjectLevel(true);

      },
      [dispatch]

   );


   const setOLP = useCallback(

      (resourceUuid: string, objectUuid: string, action: string, permissions: "allow" | "deny" | "inherit") => {

         const resource = resources?.find(r => r.uuid === resourceUuid);
         if (!resource) return;

         const newPermissions: SubjectPermissionsModel = clonePerms();

         const resourcePermissions = newPermissions.resources.find(r => r.name === resource.name);

         if (resourcePermissions) {

            const objectPermissions = resourcePermissions.objects?.find(o => o.uuid === objectUuid);

            if (objectPermissions) {

               if (permissions === "allow") {

                  if (!objectPermissions.allow.includes(action)) objectPermissions.allow.push(action);

               } else if (permissions === "deny") {

                  if (!objectPermissions.deny.includes(action)) objectPermissions.deny.push(action);

               } else {

                  objectPermissions.allow = objectPermissions.allow.filter(a => a !== action);
                  objectPermissions.deny = objectPermissions.deny.filter(a => a !== action);

               }

            } else {

               if (!resourcePermissions.objects) resourcePermissions.objects = [];

               resourcePermissions.objects.push({

                  uuid: objectUuid,
                  allow: permissions === "allow" ? [action] : [],
                  deny: permissions === "deny" ? [action] : []

               });

            }

         } else {

            newPermissions.resources.push({

               name: resource.name,
               allowAllActions: false,
               actions: [],
               objects: [{
                  uuid: objectUuid,
                  allow: permissions === "allow" ? [action] : [],
                  deny: permissions === "deny" ? [action] : []
               }]

            });

         }

         onPermissionsChanged?.(newPermissions);

      },
      [clonePerms, onPermissionsChanged, resources]

   );


   const objectLevelPermissions = useMemo(

      () => (

         <div className={style.objectLevelPermissionsContainer}>

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

                           const objectPermissions = permissions.resources.find(r => r.name === currentResource?.name)?.objects?.find(o => o.uuid === object.uuid);

                           return (

                              <tr key={object.uuid}>

                                 <td>{object.name || object.uuid}</td>

                                 {

                                    currentResource?.actions.map(

                                       action => {

                                          return (

                                             <td key={action.uuid}>

                                                <div className={style.objectPermissions}>

                                                   <div>
                                                      <div title="Allow">A</div>
                                                      <input type="radio" checked={objectPermissions?.allow.includes(action.name) || false} name={object.uuid + " " + action.uuid}
                                                         onChange={(e) => { if (e.target.checked) setOLP(currentResource.uuid, object.uuid, action.name, "allow") }}
                                                      />
                                                   </div>

                                                   <div>
                                                      <div title="Deny">D</div>
                                                      <input type="radio" checked={objectPermissions?.deny.includes(action.name) || false} name={object.uuid + " " + action.uuid}
                                                         onChange={(e) => { if (e.target.checked) setOLP(currentResource.uuid, object.uuid, action.name, "deny") }}
                                                      />
                                                   </div>

                                                   <div>
                                                      <div title="Inherit">I</div>
                                                      <input type="radio" checked={!objectPermissions?.deny.includes(action.name) && !objectPermissions?.allow.includes(action.name)} name={object.uuid + " " + action.uuid}
                                                         onChange={(e) => { if (e.target.checked) setOLP(currentResource.uuid, object.uuid, action.name, "inherit") }}
                                                      />
                                                   </div>

                                                </div>

                                             </td>

                                          )

                                       }

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

         </div>

      ),
      [currentResource, isFetchingObjects, objects, permissions.resources, setOLP]

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

                              {
                                 !resource.objectAccess ? <></> : (
                                    <Button color="link" title="Edit Object Level Permissions" onClick={() => onEditObjectLevelPermissionsClick(resource)}>Edit OLP</Button>
                                 )
                              }

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
               { color: "secondary", onClick: () => setShowObjectLevel(false), body: "Close" },
            ]}
         />


      </>

   );
}

export default RolePermissionsEditor;
