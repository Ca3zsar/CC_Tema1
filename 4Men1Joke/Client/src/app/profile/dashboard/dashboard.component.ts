import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { Component, Input, OnInit } from '@angular/core';
import { CommentsDialogComponent } from 'src/app/home/comments-dialog/comments-dialog.component';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userService : UserService;
  @Input() username?: string;
  @Input() email!: string;
  alreadySubscribed : boolean = false;
 
  constructor(userService : UserService  ,private token: TokenStorageService) {
    this.userService = userService;
    this.token = token;
   }
   user_token  = this.token.getToken();

   handleSubscribe() {
    this.alreadySubscribed = !this.alreadySubscribed;
    
      if (this.alreadySubscribed) {
        this.userService.subscribeUser(this.user_token!).subscribe(
          data => {
          }
        );
      }
      else {
        this.userService.unsubscribeUser(this.user_token!).subscribe(
          data => {
          }
        );
      }
  }

  ngOnInit(): void {
    this.userService.checkIfUserIsSubscribed(this.email).subscribe(
      data => {
        var jsonObject = JSON.parse(data);
        
        if(jsonObject.subscribed == true) {
          this.alreadySubscribed = true;
        }
        else
        {
          this.alreadySubscribed = false;
        }
      }
    );
  }

} 