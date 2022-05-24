import { Component, OnInit } from '@angular/core';
import { concat } from 'rxjs';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  jokesJsonStringlike = Array<string>();
  tokenStorage: TokenStorageService;
  userService: UserService;
  reacts :any = [];
  jokes :any = [];
  

  constructor(userService: UserService  , tokenStorage : TokenStorageService) { 
    this.tokenStorage = tokenStorage;
    this.userService = userService;
  }

  async setJokes() {
    setTimeout(() => {this.userService.getJokesByUsername(this.tokenStorage.getUser()).subscribe({
      next: data => {
        var jsonResponse = JSON.parse(data);
        if (jsonResponse.jokes) {
          var keys = Object.keys(jsonResponse.jokes);
          for (var i = 0; i < keys.length; i++) {

            var outputFormat = {
              "id": i,
              "joke_key": keys[i],
              "joke": jsonResponse.jokes[keys[i]],
              "triggers" : this.reacts.filter((x: any) => x.joke_key == keys[i]).map((x: any) => x.react)
            }
            this.jokesJsonStringlike.push(JSON.stringify(outputFormat));
            this.jokes.push(outputFormat);
          }
        }
      },
      error: err => {
        console.log(err);
      }
    });},200);
  }

  async setReacts() {
    return this.userService.getReactsOfUser().subscribe({
      next: data => {
        var jsonResponse = JSON.parse(data);
        if (jsonResponse.reacts) {
          var keys = Object.keys(jsonResponse.reacts);
          for (var i = 0; i < keys.length; i++) {
            var outputFormat = {
              "id": i,
              "joke_key": jsonResponse.reacts[keys[i]]["post-id"],
              "react": jsonResponse.reacts[keys[i]]["reaction"]
            }
            this.reacts.push(outputFormat);
          }
        }
      }

    });
  }

  ngOnInit(): void {
    concat(this.setReacts(),this.setJokes()).subscribe(
    );
  }

}