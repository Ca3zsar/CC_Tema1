import { Component } from '@angular/core';
import { JWTService } from './_services/jwt_check.service';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService, private jwtService: JWTService) { }

  ngOnInit(): void {
    var token = this.tokenStorageService.getToken();
    if (token) {
      this.jwtService.verifyToken(token).subscribe(
        data => {
          this.isLoggedIn = true;
          const user = this.tokenStorageService.getUser();
          this.username = user;
        }
        ,error => {
          this.tokenStorageService.signOut();
        }
      );

    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
