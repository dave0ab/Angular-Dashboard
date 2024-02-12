import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
Token='';
  constructor(private cookieService: CookieService) {}

  signOut(): void {
    this.cookieService.deleteAll(USER_KEY);
    this.cookieService.delete(USER_KEY);
    this.cookieService.deleteAll(TOKEN_KEY);
    this.cookieService.delete(TOKEN_KEY);
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
   window.localStorage.removeItem(TOKEN_KEY);
   // window.localStorage.setItem(TOKEN_KEY, token);
    this.Token=token;
  // this.cookieService.set(TOKEN_KEY,token); 
  }

  public getToken(): string {
    return this.cookieService.get(TOKEN_KEY);
  }

  public saveUser(user): void {


   this.cookieService.deleteAll(USER_KEY);
   this.cookieService.set(USER_KEY, JSON.stringify(user).replace('"','').replace('"','').trim());
   this.cookieService.set(TOKEN_KEY,this.Token); 
  // To Set Cookie
     // this.cookieValue = this.cookieService.get('name'); // To Get Cookie
    /*

     window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user).replace('"','').replace('"','').trim());
    window.localStorage.setItem(USER_KEY, JSON.stringify(user)); */
  }

  public getUser(): any {
    return this.cookieService.get(USER_KEY);;
  }
}
