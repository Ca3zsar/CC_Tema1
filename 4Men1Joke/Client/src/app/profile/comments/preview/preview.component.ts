import { Component, Input, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() jsonString?: any;

  userService: UserService;
  tokenStorage: TokenStorageService;

  constructor(userService: UserService, tokenStorage: TokenStorageService) {
    this.userService = userService;
    this.tokenStorage = tokenStorage;
  }

  id = '';
  joke_key = '';

  votes = {
    catOk_count : 0,
    laugh_count : 0,
    dislike_count : 0
  }

  author = '';
  createdAt = '';
  content = '';
  photo_url = '';
  keys?: string[];

  title = '';
  toggledOn_catOk = false;
  toggledOn_laugh = false;
  toggledOn_dislike = false;

  ngOnInit(): void {
    if(this.jsonString) {
      this.id = this.jsonString.id;
      this.joke_key = this.jsonString["joke_key"];

      this.author = this.jsonString.joke["author"];
      this.createdAt = this.jsonString.joke["createdAt"];
      this.content = this.jsonString.joke["content"];
      this.photo_url = this.jsonString.joke["photo_url"];
      this.title = this.jsonString.joke["title"];

      this.votes.catOk_count = this.jsonString.joke["catOk_count"];
      this.votes.laugh_count = this.jsonString.joke["laugh_count"];
      this.votes.dislike_count = this.jsonString.joke["dislike_count"];
      
    }
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