import { dateFormatter } from 'utils/dateUtil';

export const MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL = '-';
export const MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE = '<empty>';

export const formatTrustedCertificateValue = (value?: string | null, clickable?: boolean): string =>
    value == null || value.trim() === ''
        ? clickable
            ? MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE
            : MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL
        : value;

export const formatTrustedCertificateDate = (value?: string | null): string =>
    value == null || value.trim() === '' ? MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL : dateFormatter(value);
