import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../environments/environment';
import { stringify } from 'querystring';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ar-busstops',
  templateUrl: './ar-busstops.page.html',
  styleUrls: ['./ar-busstops.page.scss'],
})
export class ArBusstopsPage {

  url: SafeResourceUrl;
  apiKey: string;

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private geolocation: Geolocation, private sanitizer: DomSanitizer) {

    // get device permissions
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        // camera permissions
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
        // geolocation permissions
        this.geolocation.getCurrentPosition().then((resp) => {
          console.log(resp.coords.latitude, resp.coords.longitude)
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      });

      // get bus service api key
      this.apiKey = environment.busServiceApiKey;

      // init iframe
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/ar-busstops/index.html?busServiceApiKey=' + this.apiKey);
    }
  }

}
