// import { FieldState, FieldValidator } from "final-form";

export const composeValidators = (...validators: any[]) => (value: string) =>
   validators.reduce((error, validator) => error || validator(value), undefined);

export const validateRequired = () => (value: any) => value ? undefined : "Required Field";

export const validatePattern = (pattern: RegExp, message?: string) =>
   (value: any) =>
      !value || pattern.test(value)
         ? undefined
         : message || `Value must conform to ${pattern}`;

export const validateInteger = () => validatePattern(/^[+-]?(\d*)$/, "Value must be an integer");

export const validateFloat = () => validatePattern(/^[+-]?(\d*[.])?\d+$/, "Value must be a float without an exponent.");

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

export const validateUrl = () =>
   validatePattern(
      /^((http(s?)?):\/\/)?[a-zA-Z0-9\-.]+:[0-9]+?$/g,
      "Value must be a valid url. Example: http://localhost:8443"
   );

export const validateCustom = (pattern: string, value: string) => {
   return !value || new RegExp(pattern).test(value) ? undefined : `Value must conform to '${pattern}'`;
};

export const validateCustomUrl = (value: string) => {
   return !value || new RegExp(
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/g
   ).test(value) ? undefined : "Value must be a valid url";
};

export const validateCustomIp = (value: string) => {
   return !value || new RegExp(
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
   ).test(value) ? undefined : "Value must be a valid ip address";
};

export const validateCustomPort = (value: string) => {
   return !value || new RegExp(
      /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
   ).test(value) ? undefined : "Value must be a valid port";
};
