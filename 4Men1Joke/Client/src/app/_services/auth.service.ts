import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'https://man1joke.lm.r.appspot.com/';
// const AUTH_API = 'http://localhost:8000/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      "username":username,
      "password":password,
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      "username":username,
      "email":email,
      "password":password
    }, httpOptions);
  }
  validate_token(verification_code: string,username:string): Observable<any> {
    return this.http.post(AUTH_API + 'validate', {
      "verification_code": verification_code,
      "username": username
    }, httpOptions);
  }
}
