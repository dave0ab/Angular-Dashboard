import { Component , inject} from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Zemen-system';
  router = inject(Router);
  constructor(private tokenStorage: TokenStorageService ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
    
if(this.tokenStorage.getToken() != ''){
  this.router.navigateByUrl('/default');
}
else if(this.tokenStorage.getToken() == ''){
  this.router.navigateByUrl('/login');
}
    }
  }






}
