import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { environment } from '../../environments/environment';
import { stringify } from 'querystring';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ar-busstops',
  templateUrl: './ar-busstops.page.html',
  styleUrls: ['./ar-busstops.page.scss'],
})
export class ArBusstopsPage {

  url: SafeResourceUrl;
  apiKey: string;

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private geolocation: Geolocation, private sanitizer: DomSanitizer, private location:Location) {
    if (this.platform.is('cordova')) {
      let hasCamPerms:boolean;
      let hasGeoPerms:boolean;

      // get device permissions
      this.platform.ready().then(() => {
        // request permissions
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS, this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);

        // check permissions
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then((result) => {
          hasCamPerms = true;
        }).catch((error) => {
          hasCamPerms = false;
        });
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then((result) => {
          hasGeoPerms = true;
        }).catch((error) => {
          hasGeoPerms = false;
        });

        console.log('camera permission:', hasCamPerms);
        console.log('geolocation permission:', hasGeoPerms);

        if (hasCamPerms && hasGeoPerms || true) {
          // get bus service api key
          this.apiKey = environment.busServiceApiKey;
    
          // init iframe
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ar-busstops/index.html?busServiceApiKey=' + this.apiKey);
        }
      });
    }
  }

}
