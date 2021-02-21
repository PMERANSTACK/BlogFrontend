import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/model/user.interface';
import { AuthenticationService} from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user-service/user.service';

export interface File {
  data : any;
  progress: number;
  inprogress: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild("fileupload", {static: false}) fileupload: ElementRef = null as any;

  file: File = {
      data:  null,
      inprogress: false,
      progress: 0
  };

  form: FormGroup = null as any;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService) {
    
   }

  ngOnInit(): void {
     this.form = this.formBuilder.group({
       id: [{
         value: null,
         disabled: true
       }, [Validators.required]],
       name: [null, [Validators.required]],
       username: [null,[Validators.required]],
       profileImage: [null]
     });

     this.authService.getUserId().pipe(
         switchMap((id: number) =>
          this.userService.findOne(id).pipe(
            tap((user : User) =>{
              this.form.patchValue({
                id: user.id,
                name: user.name,
                username: user.username,
                profileImage: user.profileImage
              })
            })
          )
         )
     ).subscribe()
  }

  update(){
    this.userService.updateOne(this.form.getRawValue()).subscribe()
  }

  onClick(){
    const fileInput = this.fileupload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inprogress: false,
        progress: 0
      };
      this.fileupload.nativeElement.value = '';
      this.uploadFile();
    }
  }

  uploadFile() {
    const file = this.file;
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inprogress = true;
    this.userService.uploadProfileImage(formData).pipe(
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
        this.file.inprogress = false;
        return of('Upload failed')
      })
    ).subscribe((event: any) => {
      if(typeof(event) === 'object'){
        this.form.patchValue({profileImage: event.body.profileImage});
      }
    })
  }

}
