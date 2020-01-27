import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.page.html',
  styleUrls: ['./ar-view.page.scss'],
})
export class ArViewPage {

  url: SafeResourceUrl;
  apiKey: string;
  loadIframe = false;

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions,private sanitizer: DomSanitizer) {

    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        // request camera permissions before loading iframe
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]).then((result) => {
          console.log('camera permission:', this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA));
          this.loadIframe = result; // enable iframe if permissions enabled
          if (result) {
            // init iframe
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ar/index.html');
          }
        });
      });
    }
  }

  ionViewWillLeave() {
    // disable iframe to free system resources
    this.loadIframe = false;
  }
}
