import { Component, OnInit, ViewChild } from '@angular/core';
import { $ } from 'protractor';
import { AFrame } from 'aframe';
import { AndroidPermissions, AndroidPermissionResponse } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-ar-view-ts',
  templateUrl: './ar-view-ts.page.html',
  styleUrls: ['./ar-view-ts.page.scss'],
})
export class ArViewTsPage implements OnInit {

  constructor(private androidPermissions: AndroidPermissions) {

    // TODO: fix error here
    // TypeError: Cannot read property 'androidPermissions' of undefined
    // try this? https://www.youtube.com/watch?v=W47ZJ1vgqqI

    // check/get camera permission
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
    .then( function(response: AndroidPermissionResponse) {
      let hasCameraPerms: boolean = response.hasPermission;
      if (!hasCameraPerms) {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
      }
    })
    .catch( function(failureCallBack) {
      alert(failureCallBack);
    });
  }

  ngOnInit() {
    require('aframe'); // initialize ar.js
  }
}
