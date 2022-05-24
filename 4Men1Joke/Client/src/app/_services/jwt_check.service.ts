import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const CHECK_API = 'https://man1joke.lm.r.appspot.com/utils/jwt-check';
// const CHECK_API = 'http://localhost:8000/utils/jwt-check';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
    providedIn: 'root'
})
export class JWTService {
    constructor(private http: HttpClient) { }
    jwtValue: any;

    verifyToken(token: string): Observable<any> {
        return this.http.post(CHECK_API, {
            "token": token,
        }, httpOptions);
    }
}
