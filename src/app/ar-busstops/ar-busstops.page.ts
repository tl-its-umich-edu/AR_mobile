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

  loadIframe = false;

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private location: Location) {

    // set up iframe listener
    window.addEventListener('message', e => {
      if (e.data === 'ready') {
        // fetch data from api
        const apiUrl = 'https://dev-bus-service.webplatformsunpublished.umich.edu/bus/stops?key=' + environment.busServiceApiKey;

        fetch(apiUrl)
        .then(response => {
          return response.json();
        })
        .then(dataObj => {
          // pass api results to iframe
          // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
          const iframe = window.frames[0];
          iframe.postMessage(dataObj, '*');
        });
      }
    });

    if (this.platform.is('cordova')) { // running in native app
      this.platform.ready().then(() => {
        // request camera and geolocation permissions before loading iframe
        this.androidPermissions.requestPermissions([
          this.androidPermissions.PERMISSION.CAMERA,
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
        ]).then((result) => {
          console.log('camera permission:',
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA));
          console.log('geolocation permission:',
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION));
          this.loadIframe = result; // enable iframe if permissions enabled
        });
      });
    } else { // running from browser
      this.loadIframe = true;
    }
  }

  ionViewWillLeave() {
    // disable iframe to free system resources
    this.loadIframe = false;
  }

}
