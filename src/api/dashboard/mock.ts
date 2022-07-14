import { Observable, of } from "rxjs";
import { dbData } from "mocks/db";
import * as model from "./model";

export class DashboardManagementMock implements model.DashboardManagementApi {
  getDashboardData(): Observable<model.DashboardDTO> {
    return of(dbData.dashboard);
  }
}
