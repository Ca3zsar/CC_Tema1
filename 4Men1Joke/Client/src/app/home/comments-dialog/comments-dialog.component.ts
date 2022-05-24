import { Component, Input, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-comments-dialog',
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.css']
})
export class CommentsDialogComponent implements OnInit {
  @Input() joke_id?: string;

  userService: UserService;
  tokenStorageService: TokenStorageService


  commentsList: Array<any>;



  constructor( private _snackBar: MatSnackBar, userService: UserService, tokenStorageService: TokenStorageService) {
    this.userService = userService;
    this.tokenStorageService = tokenStorageService;


    this.commentsList = []
  }

  ngOnInit(): void {
    if(this.joke_id) {
      this.userService.getCommentsByJokeId(this.joke_id).subscribe(
        data => {
          var jsonObject = JSON.parse(data);

          var keys = Object.keys(jsonObject);

          for(var i = 0; i < keys.length; i++) {
            var comment = {
              username: jsonObject[keys[i]].username,
              comment: jsonObject[keys[i]].comment,
              joke_id: jsonObject[keys[i]].joke_id,
              createdAt: jsonObject[keys[i]].createdAt
            }
            this.commentsList.push(comment);
          }
        }
      );
    }
  }

  sendComment() {
    if ((<HTMLTextAreaElement>document.getElementById('textarea' + this.joke_id))?.value != '') {
      var comment = (<HTMLTextAreaElement>document.getElementById('textarea' + this.joke_id))?.value;
      
      // check if user is logged in

      var isLoggedIn = !!this.tokenStorageService.getToken();

      
      if(isLoggedIn && this.joke_id) {
        // send comment to server
        this.userService.postComment(this.joke_id, this.tokenStorageService.getUser(), comment).subscribe();
      
        // add comment to list for rerendering
        var comment_ = {
          username: this.tokenStorageService.getUser(),
          comment: comment,
          joke_id: this.joke_id,
          createdAt: new Date()
        }
        this.commentsList.push(comment_);
      
        // initialize snackbar if exists
        this._snackBar.open("Comment sent!", "", {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-over-modal']
        });
        
        // clear textarea
        (<HTMLTextAreaElement>document.getElementById('textarea' + this.joke_id)).value = '';

      }
    }
  }
}
