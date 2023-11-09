import { ComplianceStatus } from "types/openapi";

interface Props {
    status: ComplianceStatus | undefined;
    id: string;
}

interface CertificateComplianceIcon {
    [key: string]: {
        color: string;
        message: string;
    };
}

//TODO replace with CertificateStatus?
const certificateIcon: CertificateComplianceIcon = {
    [ComplianceStatus.Ok]: {
        color: "green",
        message: "Compliant",
    },
    [ComplianceStatus.Nok]: {
        color: "red",
        message: "Non Compliant",
    },
    [ComplianceStatus.Na]: {
        color: "grey",
        message: "Not Applicable",
    },
    [ComplianceStatus.NotChecked]: {
        color: "#D1D1D1",
        message: "Not Checked",
    },
    unknown: {
        color: "#D1D1D1",
        message: "Not Checked",
    },
};

function CertificateComplianceStatusIcon({ status, id }: Props) {
    const pattern = certificateIcon[status || "unknown"];

    return (
        <>
            <i title={pattern.message} className={"fa fa-circle"} style={{ color: pattern.color }} data-tip data-for={id} />
        </>
    );
}

export default CertificateComplianceStatusIcon;
