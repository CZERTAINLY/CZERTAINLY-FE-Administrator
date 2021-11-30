import { FieldState, FieldValidator } from "final-form";

export const validateRequired = () => (value: any) =>
  value ? undefined : "Required Field";

export const validatePattern =
  (pattern: RegExp, message?: string) => (value: any) =>
    !value || pattern.test(value)
      ? undefined
      : message || `Value must conform to ${pattern}`;

export const validateAlphaNumeric = () =>
  validatePattern(
    /^([a-zA-Z0-9À-ž]+([ '-/][a-zA-Z0-9À-ž]+)*)+$/,
    "Value can only contain numbers or letters eventually separated by a space, dash, apostrophe or slash"
  );

export const validateEmail = () =>
  validatePattern(
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/,
    "Value must be a valid email address"
  );

export const composeValidators =
  (...validators: FieldValidator<any>[]) =>
  (value: any, allValues: object, meta?: FieldState<any>) =>
    validators.reduce(
      (error, validator) => error || validator(value, allValues, meta),
      undefined
    );

export const validateUrl = () =>
  validatePattern(
    /^((http(s?)?):\/\/)?[a-zA-Z0-9\-.]+:[0-9]+?$/g,
    "Value must be a valid url. Example: http://localhost:8443"
  );

export const validateCustom = (pattern: string, value: string) => {
  return new RegExp(pattern).test(value);
};
