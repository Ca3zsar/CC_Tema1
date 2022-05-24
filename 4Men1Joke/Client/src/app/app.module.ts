import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon'; 
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import {MatDividerModule} from '@angular/material/divider'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { JokefeedComponent } from './home/jokefeed/jokefeed.component';
import { JokeComponent } from './home/joke/joke.component';
import { FilterComponent } from './home/filter/filter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { PostComponent } from './post/post.component';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input'; 
import {MatSelectModule} from '@angular/material/select';
import { FileUploadComponent } from './post/file-upload/file-upload.component'; 

import { ValidateTokenComponent } from './validate-token/validate-token.component';
import { CommentsDialogComponent } from './home/comments-dialog/comments-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DashboardComponent } from './profile/dashboard/dashboard.component';
import { PostsComponent } from './profile/posts/posts.component';
import { CommentsComponent } from './profile/comments/comments.component';
import { AwardsComponent } from './profile/awards/awards.component';
import { PreviewComponent } from './profile/comments/preview/preview.component';
import { EventsComponent } from './events/events.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    JokefeedComponent,
    JokeComponent,
    FilterComponent,
    PostComponent,
    FileUploadComponent,
    ValidateTokenComponent,
    CommentsDialogComponent,
    DashboardComponent,
    PostsComponent,
    CommentsComponent,
    AwardsComponent,
    PreviewComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDividerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatCheckboxModule,
    MatAutocompleteModule
  ],
  providers: [FileUploadComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
