import { Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { concat, Observable } from 'rxjs';
import { UserService } from 'src/app/_services/user.service';
import { JokeComponent } from '../joke/joke.component';

@Component({
  selector: 'app-jokefeed',
  templateUrl: './jokefeed.component.html',
  styleUrls: ['./jokefeed.component.css']
})
export class JokefeedComponent implements OnInit {
  jokesJsonStringlike = Array<string>();
  jokes = Array<any>();
  filteredJokes = Array<string>();
  comments: any = [];
  reacts : any = [];

  @ViewChildren("jokeComponent") jokesComponents: any;
  @Input() options: any;
  constructor(private userService: UserService) { }

  async setJokes() {
    setTimeout(() => {this.userService.getAllJokes().subscribe({
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
          this.filteredJokes = this.jokesJsonStringlike;
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
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    let author = this.options.author;
    let tags = this.options.tags;
    let isChecked = this.options.hasImage;
    let sortingCriteria = this.options.sort;

    let tempJokes = [];
    this.filteredJokes = [];

    for (var i = 0; i < this.jokes.length; i++) {
      let item = this.jokes[i];
      if (item.joke.author.toLowerCase().search(author.toLowerCase(),) != -1) {
        this.filteredJokes.push(this.jokesJsonStringlike[i]);
        tempJokes.push(this.jokes[i]);
      }
    }

    if (tags && tags.length > 0) {
      for (var i = tempJokes.length - 1; i >= 0; i--) {
        let item = tempJokes[i];
        let intersection = item.joke.keys.filter((x: any) => tags.includes(x));
        if (intersection.length == 0) {
          this.filteredJokes.splice(i, 1);
          tempJokes.splice(i, 1);
        }
      }
    }

    if (isChecked) {
      for (var i = this.filteredJokes.length - 1; i >= 0; i--) {
        let item = tempJokes[i];
        if (item.joke.photo_url == '') {
          this.filteredJokes.splice(i, 1);
          tempJokes.splice(i, 1);
        }
      }
    }

    if (sortingCriteria) {
      this.sortJokes(tempJokes, sortingCriteria);
    }
  }

  sortJokes(jokes: Array<any>, sortingCriteria: string) {
    setTimeout(() => {
    }, 100)
    if (sortingCriteria == "date asc") {
      jokes.sort((a, b) => {
        return new Date(a.joke.createdAt).getTime() - new Date(b.joke.createdAt).getTime();
      });
    } else if (sortingCriteria == "date desc") {
      jokes.sort((a, b) => {
        return new Date(b.joke.createdAt).getTime() - new Date(a.joke.createdAt).getTime();
      });
    } else if (sortingCriteria == "relevance") {
      jokes.sort((a, b) => {
        return this.computeRelevance(b) - this.computeRelevance(a);
      });
    } else if (sortingCriteria == "laughs") {
      jokes.sort((a, b) => {
        return this.computeLaughs(b) - this.computeLaughs(a);
      });
    }
    this.filteredJokes = [];
    jokes.forEach(x => {
      this.filteredJokes.push(JSON.stringify(x));
    });
  }

  computeLaughs(joke: any) {
    return joke.joke.laugh_count;
  }

  computeRelevance(joke: any) {
    let jokeComp = this.jokesComponents._results.find((x: { id: any; }) => x.id == joke.id);
    let jokeComments = jokeComp.comments.commentsList;
    let commentScore = 10;
    let reactScore = 2;
    let finalScore = commentScore * jokeComments.length + reactScore * (joke.joke.catOk_count + joke.joke.dislike_count + joke.joke.laugh_count);

    return finalScore;
  }

}
