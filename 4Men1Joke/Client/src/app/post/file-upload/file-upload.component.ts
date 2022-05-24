import { Component, OnInit } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
@Component({
  selector: 'app-file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.css"]
})
export class FileUploadComponent {

    acceptedTypes : string[] = ['image/png', 'image/jpeg', 'image/gif'];
    file! : File;
    fileName = '';
    imgSrc : string = '';
    uploadSub?: Subscription | null;

    constructor() {}

    onFileSelected(event : any) {
        const fileTemp:File = event.target.files[0];
        this.file = fileTemp;
        if (this.file) {
            this.fileName = this.file.name;
            const formData = new FormData();
            const reader = new FileReader();

            reader.readAsDataURL(this.file); // toBase64
            reader.onload = () => {
              this.imgSrc = reader.result as string; // base64 Image src
            };
            formData.append("thumbnail", this.file);
        }
    }

  cancelUpload() {
    this.uploadSub!.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadSub = null;
  }
}