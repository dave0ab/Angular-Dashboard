import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API =  'http://192.168.137.1:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      firstname:user.firstname,
      lastname:user.lastname,
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }

    getProfile(un): Observable<any> {
    return this.http.get(AUTH_API + 'profile/'+un, httpOptions);
  }


  logout(): Observable<any> {

    return this.http.get(AUTH_API + 'logout', httpOptions);
  }

}
