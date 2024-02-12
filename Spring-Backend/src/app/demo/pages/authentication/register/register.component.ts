import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {NgAlertBoxComponent} from "ng-alert-box-popup";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingComponent } from 'src/app/loading/loading.component';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule,MatProgressSpinnerModule,LoadingComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {

  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

loading :boolean=false;
  router = inject(Router);

  registerModel = {
    firstname: '',
    lastname: '',
    email: '',
    username:'',
    password: ''
  };


constructor(private authService: AuthService,private http: HttpClient, private alerts: NgAlertBoxComponent) { }

register(){

  this.loading=true;
  this.authService.register(this.form).subscribe(
    data => {
      this.loading=false;
      this.isSuccessful = true;
      this.isSignUpFailed = false;
      this.alerts.dialog('S','Successfully Registered');
      this.router.navigateByUrl('/login');
    },
    err => {
      this.loading=false;
      this.errorMessage = err.error.message;
      this.alerts.dialog('E',this.errorMessage);
      this.isSignUpFailed = true;
    }
  );


  /*
this.loading=true;
const registerRequest={

  firstname: this.registerModel.firstname,
  lastname: this.registerModel.lastname,
  email: this.registerModel.email,
  password: this.registerModel.password

}


this.http.post<any>('http://192.168.137.1:8080/user', registerRequest)
.subscribe(response=>{

if(response=='1'){
  this.loading=false;
  this.alerts.dialog('S','Successfully Registered');
         this.router.navigateByUrl('/login');
}

}, error => {
  this.loading=false;
  this.alerts.dialog('E',error);


}); */






}


}
