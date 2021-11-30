import { Observable, of } from "rxjs";

export function readCertificate(file: File): Observable<string> {
  if (!file) {
    return of("");
  }
  return new Observable((subscriber) => {
    const isPem = file.name.endsWith(".pem");
    const reader = new FileReader();
    reader.addEventListener("error", () => subscriber.error(reader.error));
    reader.addEventListener("load", () => {
      if (isPem) {
        const content = reader.result as string;
        if (content.includes("-----BEGIN CERTIFICATE-----")) {
          const certificate = content
            .replace("-----BEGIN CERTIFICATE-----", "")
            .replace("-----END CERTIFICATE-----", "")
            .replace(/\r|\n/g, "");
          subscriber.next(certificate);
        } else {
          subscriber.error(
            new Error("File does not contain a valid PEM certificate")
          );
          return;
        }
      } else {
        subscriber.next(btoa(reader.result as string));
      }
      subscriber.complete();
    });
    if (isPem) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
}
