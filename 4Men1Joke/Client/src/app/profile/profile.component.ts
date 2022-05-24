import { Component, OnInit } from '@angular/core';
import { JWTService } from '../_services/jwt_check.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  username: string;
  email: string;

  component_flag = 1;
  isLoggedIn = false;


  constructor(private tokenStorage: TokenStorageService, private jwt_service:JWTService) {
    this.username = '';
    this.email = '';
    if (this.tokenStorage.getToken()) {
      this.jwt_service.verifyToken(this.tokenStorage.getToken()!).subscribe(
        (data) => {
          this.isLoggedIn = true;
          this.tokenStorage.saveUser(data.username);
          this.currentUser = data.username;
          this.username = data.username;
          this.email = data.email;
        }, (err) => {
          this.tokenStorage.signOut()
          window.location.href = '/home';
        }
      )
    }else{
      window.location.href = '/home';
    }
  }

  ngOnInit(): void {
  }


  toggleComponent(flag: number) {
    this.component_flag = flag;
  }
}