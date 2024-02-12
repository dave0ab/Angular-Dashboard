import { Component , inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule,ActivatedRoute  } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {NgAlertBoxComponent} from "ng-alert-box-popup";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-enter-code',
  standalone: true,
  imports: [CommonModule, RouterModule,HttpClientModule,FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export default class ChangePasswordComponent {

  router = inject(Router);
  receivedData= '';
  changeModel = {
    email: '',
    password:''
    };

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.receivedData = params.get('myData');
       
      });}
  constructor(private http: HttpClient, private alerts: NgAlertBoxComponent,private route: ActivatedRoute) { }
  
  passwordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });
  

  Change() {

    
    const changeRequest = {
      email: this.receivedData,
      password:this.changeModel.password,
    };

    if (this.passwordForm.get('password')!.value == this.passwordForm.get('confirmPassword')!.value) {
      
      this.http.put<any>('http://192.168.137.1:8080/api/auth/change-password', changeRequest)
      .subscribe(response => {
        // Handle the response as needed
        
        if (response == '1') {
          this.alerts.dialog('S','Success now login');

          this.router.navigate(['/login', { myData: this.receivedData }]);
          
        



        }
      }, error => {
       this.alerts.dialog('E',error);
        console.error(error);
      });


     
      
    } else {
      this.alerts.dialog('E','Passwords do not match.');
      
    }
    // Make a POST request to your Spring Boot backend
  



  }

   passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;
  
    return password == confirmPassword ? null : { notEqual: true };
  }
  

}
