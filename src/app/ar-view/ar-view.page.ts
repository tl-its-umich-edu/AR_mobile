import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.page.html',
  styleUrls: ['./ar-view.page.scss'],
})
export class ArViewPage {

  apiKey: string;
  loadIframe = false;

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions) {

    if (this.platform.is('cordova')) { // running in native app
      this.platform.ready().then(() => {
        // request camera permissions before loading iframe
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]).then((result) => {
          console.log('camera permission:', this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA));
          this.loadIframe = result; // enable iframe if permissions enabled
        });
      });
    }
    else { // running from browser
      this.loadIframe = true;
    }
  }

  ionViewWillLeave() {
    // disable iframe to free system resources
    this.loadIframe = false;
  }
}
