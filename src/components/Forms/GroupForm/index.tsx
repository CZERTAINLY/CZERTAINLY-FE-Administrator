import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";
import {
  Button,
  ButtonGroup,
  Form as BootstrapForm,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import ProgressButton from "components/ProgressButton";
import {
  validateRequired,
  composeValidators,
  validateAlphaNumeric,
} from "utils/validators";
import { actions, selectors } from "ducks/groups";
import { GroupModel } from "models";
import Widget from "components/Widget";
import { mutators } from "utils/attributeEditorMutators";

interface Props {
  title: JSX.Element;
}

interface FormValues {
  name: string;
  description: string;
}

function GroupForm({ title }: Props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const { params } = useRouteMatch<{ id: string }>();

  const editMode = useMemo(
    () => params.id !== undefined,
    [params.id]
  );

  const groupSelector = useSelector(selectors.group);
  const isFetchingDetail = useSelector(selectors.isFetchingDetail);
  const isCreating = useSelector(selectors.isCreating);
  const isUpdating = useSelector(selectors.isUpdating);

  const [group, setGroup] = useState<GroupModel>();


  const isBusy = useMemo(
    () => isFetchingDetail || isCreating || isUpdating,
    [isCreating, isFetchingDetail, isUpdating]
  );


  const onSubmit = useCallback(
    (values: FormValues) => {
      if (editMode) {
        dispatch(actions.updateGroup({ groupUuid: params.id, name: values.name, description: values.description }));
      } else {
        dispatch(actions.createGroup({ name: values.name, description: values.description }));
      }
    },
    [dispatch, editMode, params.id]
  );

  const onCancelClick = useCallback(

    () => {
      history.goBack()
    },
    [history, params.id, editMode]

  );

  useEffect(

    () => {

      if (editMode && groupSelector && groupSelector.uuid !== group?.uuid) {

        setGroup(groupSelector);

      }
    },
    [dispatch, editMode, group?.uuid, groupSelector]

  )

  const defaultValues: FormValues = useMemo(
    () => ({
      name: editMode ? group?.name || "" : "",
      description: editMode ? group?.description || "" : "",
    }),
    [editMode, group]
  );


  return (
    <Widget title={title} busy={isBusy}>

      <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

        {({ handleSubmit, pristine, submitting, valid, form }) => (

          <BootstrapForm onSubmit={handleSubmit}>
            <Field
              name="name"
              validate={composeValidators(
                validateRequired(),
                validateAlphaNumeric()
              )}
            >
              {({ input, meta }) => (
                <FormGroup>
                  <Label for="name">Group Name</Label>
                  <Input
                    {...input}
                    valid={!meta.error && meta.touched}
                    invalid={!!meta.error && meta.touched}
                    type="text"
                    id="name"
                    placeholder="Group Name"
                    disabled={editMode}
                  />
                  <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
              )}
            </Field>
            <Field
              name="description"
              validate={composeValidators(
                validateRequired(),
                validateAlphaNumeric()
              )}
            >
              {({ input, meta }) => (
                <FormGroup>
                  <Label for="description">Group Description</Label>
                  <Input
                    {...input}
                    valid={!meta.error && meta.touched}
                    invalid={!!meta.error && meta.touched}
                    type="text"
                    id="description"
                    placeholder="Group Description"
                  />
                  <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
              )}
            </Field>
            <div className="d-flex justify-content-end">

              <ButtonGroup>

                <ProgressButton
                  title={editMode ? "Update" : "Create"}
                  inProgressTitle={editMode ? "Updating..." : "Creating..."}
                  inProgress={submitting}
                  disabled={pristine || submitting || !valid}
                />

                <Button color="default" onClick={onCancelClick} disabled={submitting}>
                  Cancel
                </Button>

              </ButtonGroup>

            </div>
          </BootstrapForm>
        )}
      </Form>
    </Widget >
  );
}

export default GroupForm;
