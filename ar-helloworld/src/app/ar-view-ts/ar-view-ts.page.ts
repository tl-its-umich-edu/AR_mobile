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

    let hello: string = "Hello world from typescript!";
    doSomething(hello);
  }

  ionViewDidEnter() {
    //generateAFrameScene();
  }
}

function doSomething(message: string) {
  console.log(message);
}

function generateAFrameScene() {
  let ionContent: Element = document.querySelector('ion-content');

  let aScene: Element = document.createElement('a-scene');
  ionContent.appendChild(aScene);
}
