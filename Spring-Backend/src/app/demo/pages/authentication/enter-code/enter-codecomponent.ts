import { Component , inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule,ActivatedRoute  } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {NgAlertBoxComponent} from "ng-alert-box-popup";

@Component({
  selector: 'app-enter-code',
  standalone: true,
  imports: [CommonModule, RouterModule,HttpClientModule,FormsModule],
  templateUrl: './enter-code.component.html',
  styleUrls: ['./enter-code.component.scss']
})
export default class EnterCodeComponent   {
  receivedData= '';
  response='';
  router = inject(Router);
   data ='';

  forgetModel = {
    code: ''
    };

  constructor(private http: HttpClient, private alerts: NgAlertBoxComponent,private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.receivedData = params.get('myData');
     
    });}

  forget() {

    
    
    const forgetRequest = {
     
      email:this.receivedData,
      code: this.forgetModel.code

    };

  

    // Make a POST request to your Spring Boot backend
    this.http.post<any>('http://192.168.137.1:8080/api/auth/check-code', forgetRequest)
      .subscribe(response => {
        // Handle the response as needed
       
        if (response == '1') {
          this.alerts.dialog('S','Success');

          this.router.navigate(['/change-password', { myData: this.receivedData }]);
          
        



        }
      }, error => {
        this.alerts.dialog('E',error.toString());
        console.error(error);
      });
  }


}
