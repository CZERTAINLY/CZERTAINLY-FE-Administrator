import { Observable, of } from "rxjs";
import { dbData } from "api/_mocks/db";
import * as model from "./model";

export class DashboardManagementMock implements model.DashboardManagementApi {
  getDashboardData(): Observable<model.DashboardDTO> {
    return of(dbData.dashboard);
  }
}
