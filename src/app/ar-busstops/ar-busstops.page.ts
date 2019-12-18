import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-ar-busstops',
  templateUrl: './ar-busstops.page.html',
  styleUrls: ['./ar-busstops.page.scss'],
})
export class ArBusstopsPage implements OnInit {

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private geolocation: Geolocation) {
    if (this.platform.is('cordova')) {
      
      // camera permissions
      
      this.platform.ready().then(() => {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            result => console.log('Has camera permission?', result.hasPermission),
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        );

        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
      });

      // geolocation permissions

      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log(resp.coords.latitude, resp.coords.longitude)
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
  }

  ngOnInit() {
  }

}
