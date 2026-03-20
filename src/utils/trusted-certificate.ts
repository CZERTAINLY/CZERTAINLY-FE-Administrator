import { dateFormatter } from 'utils/dateUtil';

export const MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL = '-';
export const MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE = '<empty>';

export const formatTrustedCertificateValue = (value?: string | null, clickable?: boolean): string => {
    if (value == null || value.trim() === '') {
        return clickable ? MISSING_TRUSTED_CERTIFICATE_FIELD_CLICKABLE : MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL;
    }
    return value;
};

export const formatTrustedCertificateDate = (value?: string | null): string =>
    value == null || value.trim() === '' ? MISSING_TRUSTED_CERTIFICATE_FIELD_NORMAL : dateFormatter(value);
