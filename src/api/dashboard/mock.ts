import { Observable, of } from "rxjs";
import { dbData } from "api/_mocks/db";
import * as model from "./model";

export class DashboardManagementMock {
  getDashboardData(): Observable<model.DashboardDTO> {
    return of(dbData.dashboard);
  }
}
