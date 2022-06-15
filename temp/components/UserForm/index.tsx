import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
} from "reactstrap";

import ProgressButton from "components/ProgressButton";
import { useChecked, useInputValue } from "utils/hooks";

export interface DefaultValues {
  name?: string;
  email?: string;
  description?: string;
  superAdmin?: boolean;
  enabled?: boolean;
}

interface Props {
  adminForm?: boolean;
  editMode?: boolean;
  defaultValues?: DefaultValues;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (
    name: string,
    certFile: File,
    description: string,
    enabled: boolean,
    superAdmin: boolean,
    email: string
  ) => void;
}

function CreateUserForm({
  adminForm,
  isSubmitting,
  editMode,
  defaultValues,
  onCancel,
  onSubmit,
}: Props) {
  const defaults = defaultValues || {};

  const [name, setName] = useState(defaults.name || "");
  const [email, setEmail] = useState(defaults.email || "");
  const [certFile, setCertFile] = useState<File | null>(null);
  const [description, setDescription] = useState(defaults.description || "");
  const [superAdmin, setSuperAdmin] = useState(defaults.superAdmin || false);
  const [enabled, setEnabled] = useState(defaults.enabled || false);

  const entity = adminForm ? "Administrator" : "Client";
  const nameLabel = `${entity} Name`;
  const certificateLabel = `Upload ${entity} Certificate`;
  const certificateText = adminForm
    ? "Upload certificate of administrator based on which will be authenticated."
    : "Upload certificate of client based on which will be authenticated to CZERTAINLY.";

  const onName = useInputValue(setName);
  const onEmail = useInputValue(setEmail);
  const onDescription = useInputValue(setDescription);
  const onSuperAdmin = useChecked(setSuperAdmin);
  const onEnabled = useChecked(setEnabled);
  const onCertFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setCertFile(event.target.files ? event.target.files[0] : null),
    []
  );
  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(name, certFile as File, description, enabled, superAdmin, email);
    },
    [onSubmit, name, certFile, description, enabled, superAdmin, email]
  );

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name || "");
      setEmail(defaultValues.email || "");
      setDescription(defaultValues.description || "");
      setSuperAdmin(defaultValues.superAdmin || false);
      setEnabled(defaultValues.enabled || false);
    }
  }, [defaultValues]);

  const submitTitle = editMode ? "Save" : "Create";
  const inProgressTitle = editMode ? "Saving..." : "Creating...";

  return (
    <Form onSubmit={onFormSubmit}>
      <FormGroup>
        <Label for="name">{nameLabel}</Label>
        <Input
          type="text"
          placeholder={nameLabel}
          name="name"
          value={name}
          onChange={onName}
          disabled={editMode && !adminForm}
          required
        />
      </FormGroup>
      {adminForm ? (
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={onEmail}
            required
          />
        </FormGroup>
      ) : null}
      <FormGroup>
        <Label for="certFile">{certificateLabel}</Label>
        <Input
          type="file"
          name="certFile"
          onChange={onCertFile}
          required={!editMode}
        />
        <FormText color="muted">{certificateText}</FormText>
      </FormGroup>
      <FormGroup>
        <Label for="description">Description</Label>
        <textarea
          name="description"
          className="form-control"
          placeholder="Description / Comment"
          value={description}
          onChange={onDescription}
        />
      </FormGroup>
      {adminForm ? (
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={superAdmin}
              onChange={onSuperAdmin}
            />
            &nbsp;Superadmin
          </Label>
        </FormGroup>
      ) : null}
      {editMode ? null : (
        <FormGroup check>
          <Label check>
            <Input type="checkbox" checked={enabled} onChange={onEnabled} />
            &nbsp;Enabled
          </Label>
        </FormGroup>
      )}
      <div className="d-flex justify-content-end">
        <ButtonGroup>
          <Button color="default" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <ProgressButton
            title={submitTitle}
            inProgressTitle={inProgressTitle}
            inProgress={isSubmitting}
          />
        </ButtonGroup>
      </div>
    </Form>
  );
}

export default CreateUserForm;
