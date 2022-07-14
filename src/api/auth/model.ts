import { Observable } from 'rxjs';


export interface UserProfileDTO {
   name: string;
   surname: string;
   username: string;
   email: string;
   role: string;
}


export interface AuthApi {

   getProfile(): Observable<UserProfileDTO>;

   updateProfile(name?: string, surname?: string, username?: string, email?: string): Observable<void>;

}
