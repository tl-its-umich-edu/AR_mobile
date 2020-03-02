import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../environments/environment';
import { stringify } from 'querystring';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ar-busstops',
  templateUrl: './ar-busstops.page.html',
  styleUrls: ['./ar-busstops.page.scss'],
})
export class ArBusstopsPage {

  apiKey: string;
  loadIframe: boolean = false;

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private geolocation: Geolocation, private location:Location) {

    if (this.platform.is('cordova')) { // running in native app
      this.platform.ready().then(() => {
        // request camera and geolocation permissions before loading iframe
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]).then((result) => {
          console.log('camera permission:', this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA));
          console.log('geolocation permission:', this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION));
          this.loadIframe = result; // enable iframe if permissions enabled
        });
      });
    }
    else { // running from browser
      this.loadIframe = true;
    }
    
    if (this.loadIframe) {
      // pass api results to iframe
      this.apiKey = environment.busServiceApiKey;
    }
  }

  ionViewWillLeave() {
    // disable iframe to free system resources
    this.loadIframe = false;
  }

}
