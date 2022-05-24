import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { JWTService } from '../_services/jwt_check.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-validate-token',
  templateUrl: './validate-token.component.html',
  styleUrls: ['./validate-token.component.css']
})
export class ValidateTokenComponent implements OnInit {

  form: any = {
    verification_code: null
  };
  username: string = '';
  errorMessage = '';
  verification_code : string = '';
  isValidateFailed = false;

  constructor(private jwtService : JWTService,private authService: AuthService, public tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.username = this.tokenStorage.getUser();
  }

  onSubmit(): void {
    const { verification_code } = this.form;
    this.authService.validate_token(verification_code,this.username).subscribe({
      next: async data => {
        this.tokenStorage.saveToken(data.token);
        this.verification_code = verification_code;
        this.redirectToHome();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isValidateFailed = true;
      }
    });
  }
  redirectToHome(): void {
    window.location.href = '/login';
  }
}
