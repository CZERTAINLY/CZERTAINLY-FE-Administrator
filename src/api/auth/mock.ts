import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpErrorResponse } from 'ts-rest-client';

import { dbData } from 'mocks/db';
import { randomDelay } from 'utils/mock';
import * as model from './model';

const profileIdx = process.env.REACT_APP_MOCK_PROFILE_ID ? +process.env.REACT_APP_MOCK_PROFILE_ID : 0;

export class AuthMock implements model.AuthApi {
  getProfile(): Observable<model.ProfileResponse> {
    return of(dbData.administrators[profileIdx]).pipe(
      delay(randomDelay()),
      map(profile => {
        if (profile) {
          return {
            name: profile.name,
            surname: profile.surname,
            username: profile.username,
            email: profile.email,
            role: profile.role,
          };
        }

        throw new HttpErrorResponse({ status: 404 });
      }),
    );
  }

  updateProfile(name?: string, surname?: string, username?: string, email?: string): Observable<void> {
    return of(dbData.administrators[profileIdx]).pipe(
      delay(randomDelay()),
      map(function(profile): void {
        if (profile) {
          if (name) {
            profile.name = name;
          }
          if (surname) {
            profile.surname = surname;
          }
          if (username) {
            profile.username = username;
          }
          if (email) {
            profile.email = email;
          }
        } else {
          throw new HttpErrorResponse({ status: 404 });
        }
      }),
    );
  }
}
