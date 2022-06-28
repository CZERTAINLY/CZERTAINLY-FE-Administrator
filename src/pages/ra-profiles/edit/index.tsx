import React, { useMemo } from "react";
import { Container } from "reactstrap";

import RaProfileForm from "components/Forms/RaProfileForm";

export default function RaProfilesEdit() {

   const title = useMemo(
      () => (
         <h5>
            Edit <span className="fw-semi-bold">RA Profile</span>
         </h5>
      ),
      []
   );

   return (
      <Container className="themed-container" fluid>
         <RaProfileForm title={title} />
      </Container>
   );

}

/*
import RaProfileForm from "components/RaProfileForm";
import ConfirmEditDialog from "components/ConfirmActionDialog";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/ra-profiles";
import { selectors as callbackSelectors } from "ducks/connectors";
import { AttributeResponse } from "models/attributes";

function RaProfileEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isEditing = useSelector(selectors.isUpdating);
  const raProfile = useSelector(selectors.selectProfileDetail);
  const isFetchingCallback = useSelector(callbackSelectors.isFetchingCallback);
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;
  const [showConfirm, toggleConfirmDialog] = useState(false);
  const [editAction, setEditAction] = useState<Action | null>(null);

  const onCancelEdit = useCallback(() => toggleConfirmDialog(false), []);
  const onConfirmEdit = useCallback(
    () => dispatch(editAction),
    [dispatch, editAction]
  );

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      authorityInstanceUuid: string,
      name: string,
      description: string,
      attributes: AttributeResponse[]
    ) => {
      setEditAction(
        actions.requestUpdateProfile(
          authorityInstanceUuid,
          uuid,
          name,
          description,
          attributes,
          history
        )
      );
      toggleConfirmDialog(true);
    },
    [history, uuid]
  );

  useEffect(() => {
    dispatch(actions.requestProfileDetail(uuid));
  }, [dispatch, uuid]);

  const title = (
    <h5>
      Edit <span className="fw-semi-bold">RA Profile</span>
    </h5>
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <RaProfileForm
          isSubmitting={isEditing}
          raProfile={raProfile}
          onCancel={onCancel}
          onSubmit={onSubmit}
          editMode
        />
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

export default RaProfileEdit;
*/