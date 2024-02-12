import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as SockJS from 'sockjs';

import {FormsModule} from '@angular/forms'
import { Router } from '@angular/router';
@Component({
  selector: 'app-typography',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export default class TypographyComponent {
}