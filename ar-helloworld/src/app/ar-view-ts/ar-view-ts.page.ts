import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { AFrame } from 'aframe';

@Component({
  selector: 'app-ar-view-ts',
  templateUrl: './ar-view-ts.page.html',
  styleUrls: ['./ar-view-ts.page.scss'],
})
export class ArViewTsPage implements OnInit {

  constructor() { }

  ngOnInit() {

    require('aframe');

    
  }
}
