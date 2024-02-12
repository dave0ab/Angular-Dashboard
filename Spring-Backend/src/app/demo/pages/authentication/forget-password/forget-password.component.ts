import { Component , inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {NgAlertBoxComponent} from "ng-alert-box-popup";
import { LoadingComponent } from 'src/app/loading/loading.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule,HttpClientModule,FormsModule,LoadingComponent],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export default class ForgetPasswordComponent {
  loading :boolean=false;
  router = inject(Router);

  forgetModel = {
    email: ''
    };

  constructor(private http: HttpClient, private alerts: NgAlertBoxComponent) { }
  
  
  forget() {

    this.loading=true;
    const forgetRequest = {
      email: this.forgetModel.email
    };

    // Make a POST request to your Spring Boot backend
    this.http.put<any>('http://192.168.137.1:8080/api/auth/forget', forgetRequest)
      .subscribe(response => {
        // Handle the response as needed
        
        if (response == '1') {

          this.loading=false;
       
          this.router.navigate(['/enter-code', { myData: forgetRequest.email }]);
        


        }
      }, error => {
        this.loading=false;
        this.alerts.dialog('E','Email or Password is Incorect');
        console.error(error);
      });
  }


}
