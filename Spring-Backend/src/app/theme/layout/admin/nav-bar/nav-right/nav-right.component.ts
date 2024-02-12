// Angular import
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthService } from 'src/app/_services/auth.service';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Component({
  selector: 'app-nav-right',

  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  firstname = '';
  lastname = '';


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    //  this.roles = ["ROLE_ADMIN"];

    this.authService.getProfile(user).subscribe((data) => {
      const a = data.firstName;
      const b = data.lastname;

      this.firstname = a.toUpperCase();
      this.lastname = b.toUpperCase();
      //  console.log(data);
    });
  }

  signOut(): void {
    this.cookieService.deleteAll(USER_KEY);
    this.cookieService.delete(USER_KEY);
    this.cookieService.deleteAll(TOKEN_KEY);
    this.cookieService.delete(TOKEN_KEY);
    window.localStorage.clear();
  }
}
