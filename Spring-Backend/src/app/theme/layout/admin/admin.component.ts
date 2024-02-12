// Angular import
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// Project import
import { BerryConfig } from '../../../app-config';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  @ViewChild('navigationContainer') navigationContainer: ElementRef;

  // public props
  berryConfig;
  navCollapsed: boolean;
  navCollapsedMob = false;
  windowWidth: number;

  // Constructor
  constructor(
    private zone: NgZone,
    private location: Location,
    private locationStrategy: LocationStrategy
  ) {
    this.berryConfig = BerryConfig;

    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    if (current_url === baseHref + '/layout/theme-compact' || current_url === baseHref + '/layout/box') {
      this.berryConfig.isCollapse_menu = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
  }

  ngAfterViewInit(): void {
    // Code that needs to run after the view is initialized
    let clickCount = 0;
    let previousClickCount = 0;

    const toggleButton = document.querySelector('.toggle-button');

    toggleButton.addEventListener('click', () => {
      ++clickCount;
      this.navMobClick();

      window.addEventListener('click', (event) => {
        // Store the previous count
        // Increment the current count

        if (clickCount > previousClickCount) {
          previousClickCount = clickCount;
          this.navCollapsedMob = true;
          this.navMobClick();
      ///    console.log('Click count increased!');
        } else {
     //     console.log('why');

          if (this.navCollapsedMob && this.navigationContainer) {
            const clickedOutside = this.navigationContainer.nativeElement.contains(event.target);
      //      console.log(clickedOutside);
        //    console.log(this.navCollapsedMob);
            if (this.navCollapsedMob == true && clickedOutside == true) {
              this.navCollapsedMob = false;
            }
          }
        }
        previousClickCount = clickCount;
      });
    });
  }
  // public method
  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
}
