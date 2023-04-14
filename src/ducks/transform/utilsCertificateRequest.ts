import { CertificateDetailResponseModel } from "../../types/certificate";
import { ParseRequestResponseDto } from "../../types/openapi/utils";
import { isPkcs10RequestBasicData } from "../../types/utilsCertificateRequest";
import { emptyCertificate } from "../../utils/certificate";

export function transformParseRequestResponseDtoToCertificateResponseDetailModel(
    req: ParseRequestResponseDto,
): CertificateDetailResponseModel {
    return isPkcs10RequestBasicData(req.data)
        ? {
              ...emptyCertificate,
              subjectDn: req.data.subject,
          }
        : emptyCertificate;
}
