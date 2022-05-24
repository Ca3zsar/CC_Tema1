import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { JWTService } from '../_services/jwt_check.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  username : string = '';

  constructor(private jwtService : JWTService,private authService: AuthService, public tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  setUser(token:string): void{
    this.jwtService.verifyToken(token).subscribe({
      next: (data) => {
        this.tokenStorage.saveUser(data.username);
      },
      error: (err) => {
        this.tokenStorage.signOut();
      }
    });
  }


  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe({
      next: async data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(username);
        this.username = username;
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.redirectToHome();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  redirectToHome(): void {
    window.location.href = '/home';
  }
}
