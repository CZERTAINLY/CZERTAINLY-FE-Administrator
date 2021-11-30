import { Observable } from 'rxjs';

export interface ProfileResponse {
  name: string;
  surname: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthApi {
  getProfile(): Observable<ProfileResponse>;
  updateProfile(name?: string, surname?: string, username?: string, email?: string): Observable<void>;
}
