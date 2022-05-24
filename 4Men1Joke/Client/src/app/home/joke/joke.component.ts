import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-joke',
  templateUrl: './joke.component.html',
  styleUrls: ['./joke.component.css']
})

export class JokeComponent implements OnInit {
  @Input() jsonString?: string;
  @Input() triggers : any;
  @ViewChild("comments") comments : any;

  userService: UserService;
  tokenStorage: TokenStorageService;

  constructor(userService: UserService, tokenStorage: TokenStorageService) {
    this.userService = userService;
    this.tokenStorage = tokenStorage;
  }

  votes = {
    catOk_count : 0,
    laugh_count : 0,
    dislike_count : 0
  }

  id = '';
  joke_key = '';
  title = '';
  author = '';
  createdAt = '';
  content = '';
  photo_url = '';
  keys?: string[];

  toggledOn_catOk = false;
  toggledOn_laugh = false;
  toggledOn_dislike = false;

  ngOnInit(): void {
    if(this.jsonString) {
      var jokeObj = JSON.parse(this.jsonString);

      this.id = jokeObj.id;
      this.joke_key = jokeObj.joke_key;

      this.author = jokeObj.joke.author;
      this.createdAt = jokeObj.joke.createdAt;
      this.content = jokeObj.joke.content;
      this.photo_url = jokeObj.joke.photo_url;
      this.votes.catOk_count = parseInt(jokeObj.joke.catOk_count);
      this.votes.laugh_count = parseInt(jokeObj.joke.laugh_count);
      this.votes.dislike_count = parseInt(jokeObj.joke.dislike_count);
      this.title = jokeObj.joke.title;
      this.keys = jokeObj.joke.keys;
      this.toggledOn_catOk = jokeObj.triggers.indexOf("catOk") != -1;
      this.toggledOn_laugh = jokeObj.triggers.indexOf("laugh") != -1;
      this.toggledOn_dislike = jokeObj.triggers.indexOf("dislike") != -1;
    }
  }

  ngAfterViewInit() {
    this.changeButtonState("catOk",this.toggledOn_catOk);
      this.changeButtonState("laugh", this.toggledOn_laugh);
      this.changeButtonState("dislike", this.toggledOn_dislike);
  }

  changeButtonState(reaction: string, toggledOn: boolean) {
    if(toggledOn) {
      document.getElementById(reaction + `_${this.joke_key}`)?.classList.add("border", "border-info", "rounded-pill", "mr-2", "ml-2");
    }
    else {
      document.getElementById(reaction + `_${this.joke_key}`)?.classList.remove("border", "border-info", "rounded-pill", "mr-2", "ml-2");

    }
  }

  triggerVote(reaction : string){
    if(this.tokenStorage.getToken() == null) return;
    this.userService.updateVote(this.joke_key, reaction, this.tokenStorage.getToken()!).subscribe();

    if(reaction == "catOk") {
      this.toggledOn_catOk = !this.toggledOn_catOk;
      this.votes.catOk_count = this.votes.catOk_count + (this.toggledOn_catOk? 1 : -1);
      this.changeButtonState(reaction, this.toggledOn_catOk);
    }else if(reaction == "laugh") {
      this.toggledOn_laugh = !this.toggledOn_laugh;
      this.votes.laugh_count = this.votes.laugh_count + (this.toggledOn_laugh? 1 : -1);
      this.changeButtonState(reaction, this.toggledOn_laugh);
    }else{
      this.toggledOn_dislike = !this.toggledOn_dislike;
      this.votes.dislike_count = this.votes.dislike_count + (this.toggledOn_dislike? 1 : -1);
      this.changeButtonState(reaction, this.toggledOn_dislike);
    }

  }
}
