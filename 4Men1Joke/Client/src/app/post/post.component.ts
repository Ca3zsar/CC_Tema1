import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JWTService } from '../_services/jwt_check.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { FileUploadComponent } from './file-upload/file-upload.component';

const API_LINK = 'https://man1joke.lm.r.appspot.com/jokes';
// const API_LINK = 'http://localhost:8000/jokes';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  selectedTags :string[] = [];
  listOfTags = [
    "cringe", "meme", "ironic", "short", "pun", "mic drop", "bad joke"
  ];
  selectedOption : any;
  post_form :FormGroup;
  validationError : boolean = false;
  isLoggedIn = false;

  @ViewChild('imageUploader') imageUploader : FileUploadComponent | undefined; 

  constructor(private jwt_service : JWTService, private http: HttpClient,fb: FormBuilder, public tokenStorage: TokenStorageService) { 
    this.post_form = fb.group({
      "title": [null, Validators.compose([Validators.required])],
      "content": [null, Validators.compose([Validators.required])]
    });
  }

  addNewTag() {
    if(this.selectedOption !== "Choose a tag" && this.selectedTags.indexOf(this.selectedOption) == -1){
      this.selectedTags.push(this.selectedOption);
    }
    var yourSelect = document.getElementById( "selector" ) as HTMLSelectElement;
    yourSelect.selectedIndex = 0;
  }

  submitPost(){
    this.markFormTouched(this.post_form);
    if (this.post_form.valid && this.selectedTags.length > 0) {
      var formValues = this.post_form.getRawValue();
      this.sendPostRequest(formValues);
    }else{
      if(this.selectedTags.length == 0)
      {
        this.validationError = true;
      }else{
        this.validationError = false;
      }
    }
  }

  sendPostRequest(formValues : any)
  {
    let formData : FormData = new FormData();
    formData.append('title', formValues.title);
    formData.append('content',formValues.content);
    formData.append('tags',this.selectedTags.toString());
    formData.append('image',this.imageUploader!.file);
    formData.append('author', this.tokenStorage.getUser());
    const upload$ = this.http.post(API_LINK,formData,
      ).subscribe(
      {
        next: (data) => {
          window.location.href = '/home';
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  markFormTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = (group.controls as any)[key];
      if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
      else { control.markAsTouched(); };
    });
  };

  ngOnInit(): void {
    this.selectedOption = "Choose a tag";

    if (this.tokenStorage.getToken()) {
      this.jwt_service.verifyToken(this.tokenStorage.getToken()!).subscribe(
        (data) => {
          this.isLoggedIn = true;
        }, (err) => {
          this.tokenStorage.signOut()
          window.location.href = '/home';
        }
      )
    }else{
      window.location.href = '/home';
    }
  }

}
