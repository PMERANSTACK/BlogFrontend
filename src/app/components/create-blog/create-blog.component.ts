import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BlogService } from 'src/app/services/blog.service';

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}


@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss']
})
export class CreateBlogComponent implements OnInit {
  
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef = null as any;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  }

  form: FormGroup = null as any;
  constructor( private formBuilder: FormBuilder,
               private blogService: BlogService,
               private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}],
      title: [null,[Validators.required]],
      slug: [{value: null, disabled: true}],
      description: [null, [Validators.required]],
      body: [null, [Validators.required]],
      headerImage:[null,[Validators.required]]
    })
  }


  post(){
    this.blogService.post(this.form.getRawValue()).pipe(
      tap(() => this.router.navigate(['../']))
    ).subscribe();
  }

  onClick(){
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0 
        
      }
    }
    this.fileUpload.nativeElement.value = '';
    this.uploadFile();
  }

  uploadFile(){
    
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.blogService.uploadHeaderImage(formData).pipe(
      map((event) => {
        switch (event.type){
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
           return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.file.inProgress = false;
        return of('Upload failed')
      })
    ).subscribe((event: any) => {
      if(typeof(event) === 'object'){
        this.form.patchValue({headerImage: event.body.filename});
      }
    })
  }
  
}
