import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;
  jokes_feed?: string;
  options = {"sort" :"date asc"};
  event : any = '';

  send(options : any){
    this.options = options;
  }

  constructor(private http:HttpClient) { }

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
}
