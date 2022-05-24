import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private http: HttpClient, private tokenStorageService:TokenStorageService, private userService:UserService,
    private _snackBar: MatSnackBar) { }
  event : any = "";
  @ViewChild("commArea") commArea : any;

  ngOnInit(): void {
    this.http.get('https://man1joke.lm.r.appspot.com/active-events').subscribe(
      {
        next: (data) => {
          this.event = Object.values(data)[0];
        },
        error: (err) => {
        }
      }
    );
  }

  sendEntry() {
    let commentText = this.commArea.nativeElement.value;
    console.log(commentText);
    if (commentText != "") {
      var isLoggedIn = this.tokenStorageService.getToken();

      if(isLoggedIn && this.event.name) {
        this.userService.postEntry(this.event.name, this.tokenStorageService.getUser(), commentText).subscribe();
      
        var entry = {
          author : this.tokenStorageService.getUser(),
          text : commentText
        }
        this.event.entries.push(entry);
      
        // initialize snackbar if exists
        this._snackBar.open("Entry submitted!", "", {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-over-modal']
        });
      }
      this.commArea.nativeElement.value = "";
    }
  }

}
