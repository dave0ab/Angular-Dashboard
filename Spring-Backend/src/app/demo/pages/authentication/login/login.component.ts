import { Component , inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {NgAlertBoxComponent} from "ng-alert-box-popup";
import * as jwt from 'jsonwebtoken'
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthService } from 'src/app/_services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule,HttpClientModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,private http: HttpClient, private alerts: NgAlertBoxComponent) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
if(this.isLoggedIn == true){
  this.router.navigateByUrl('/default');
}
else if(this.tokenStorage.getToken() == ''){
  this.router.navigateByUrl('/login');
}
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  router = inject(Router);


  
  
  login() {

    
 
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data.username);

        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.alerts.dialog('S','Success');

        this.router.navigateByUrl('/default');

        this.roles = this.tokenStorage.getUser().roles;
    //    this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.alerts.dialog('E',this.errorMessage);
        this.isLoginFailed = true;
      }
    );
    

    // Make a POST request to your Spring Boot backend 
    /*

      loginModel = {
    email: '',
    password: ''
  };

    this.http.post<any>('http://192.168.137.1:8080/login', loginRequest)
      .subscribe(response => {
        // Handle the response as needed
        
        if (response == '1') {
        


        }
      }, error => {
        this.alerts.dialog('E','Email or Password is Incorect');
        console.error(error);
      }); */
  }

  register() {
    // Redirect to the registration page
    this.router.navigateByUrl('/register');
  }

  forget() {
    // Redirect to the forgot password page
    this.router.navigateByUrl('/forget');
  }
  reloadPage(): void {
   
    window.location.reload();
    this.router.navigateByUrl('/default');
  } 
}



