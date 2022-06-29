import React, { useMemo } from "react";
import { Container } from "reactstrap";

import AuthorityForm from "components/Forms/AuthorityForm";

export default function RaProfilesEdit() {

   const title = useMemo(
      () => (
         <h5>
            Edit <span className="fw-semi-bold">Certification Authority</span>
         </h5>
      ),
      []
   );

   return (
      <Container className="themed-container" fluid>
         <AuthorityForm title={title} />
      </Container>
   );

}

/*
import { actions, selectors } from "ducks/ca-authorities";
import AuthorityForm from "components/AuthorityForm";

function AuthorityEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isEditing = useSelector(selectors.isEditing);
  const authority = useSelector(selectors.selectAuthorityDetails);
  const isFetchingCallback = useSelector(callbackSelectors.isFetchingCallback);
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;
  const [showConfirm, toggleConfirmDialog] = useState(false);
  const [editAction, setEditAction] = useState<Action | null>(null);
  const resetValueAttributeTypes = ["file", "secret"];

  const defaultValues = {
    ...(authority || { attributes: [] }),
  };

  const onCancelEdit = useCallback(() => toggleConfirmDialog(false), []);
  const onConfirmEdit = useCallback(() => {
    dispatch(editAction);
    toggleConfirmDialog(false);
  }, [dispatch, editAction]);

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      name: string,
      connectorUuid: string,
      credential: any,
      status: string,
      attributes: any,
      kind: string
    ) => {
      setEditAction(
        actions.requestUpdateAuthority(
          uuid,
          name,
          connectorUuid,
          credential,
          status,
          attributes,
          kind,
          history
        )
      );
      toggleConfirmDialog(true);
    },
    [history, uuid]
  );

  useEffect(() => {
    dispatch(actions.requestAuthorityDetail(uuid));
  }, [dispatch, uuid]);

  const title = (
    <h5>
      Edit <span className="fw-semi-bold">Authority</span>
    </h5>
  );

  const getAttributes = () => {
    let editableAttributes = [];
    for (let i of authority?.attributes || []) {
      if (resetValueAttributeTypes.includes(i.type)) {
        let updated = i;
        i.value = "";
        editableAttributes.push(updated);
      } else {
        editableAttributes.push(i);
      }
    }
    let updated = defaultValues || { attributes: [] };
    updated["attributes"] = editableAttributes;
    return updated;
  };

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <AuthorityForm
          defaultValues={getAttributes()}
          isSubmitting={isEditing}
          authority={authority}
          onCancel={onCancel}
          onSubmit={onSubmit}
          editMode={true}
        ></AuthorityForm>
      </Widget>
      <ConfirmEditDialog
        isOpen={showConfirm}
        onCancel={onCancelEdit}
        onConfirm={onConfirmEdit}
      />
      <Spinner active={isFetching || isFetchingCallback} />
    </Container>
  );
}

export default AuthorityEdit;
*/