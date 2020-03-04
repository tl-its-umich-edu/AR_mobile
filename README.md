# AR_mobile

This is a demonstration of AR running in Ionic 4 for mobile devices.

## Building as a PWA for Firebase

Based on [this guide](https://ionicframework.com/docs/angular/pwa).

1. Make sure you have the Angular CLI and the Firebase CLI installed.

`$ npm install -g @angular/cli`

`$ npm install -g firebase-tools`

2. Set up the project for hosting from Firebase

`$ firebase init`

Select the hosting option when asked what features to set up for this folder.

Choose an existing project or create a new one to host the app.

Enter `www` as the public directory.

Choose **Yes** when asked to configure as a single-page app.

Choose **No** if asked to overwrite index.html.

3. Build the app

`$ ionic build --prod`

4. Publish the app

`$ firebase deploy`

## Building as a native app for Android

1. Make sure you have
[JDK 1.8.x](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
installed. The download requires a login since it is legacy.
<!-- http://bugmenot.com/view/oracle.com -->

2. Set the JAVA_HOME environmental variable to JDK 1.8.x for this terminal
session.

`` $ export JAVA_HOME=`/usr/libexec/java_home -v 1.8` ``

3. Add your bus service api key to the environment file.<br>It can be found at
`src/environments/environment.ts`

4. Run the app

`$ ionic cordova run android --device`

## Known issues

- Reopening pages may not initialize the camera properly and will show a white
screen instead. Close and reopen the app to fix this.

- If location or camera permissions are denied, then the app will show a white
screen. Close and reopen the app to fix this.

- On older devices (especially tablets), compass accuracy may be poor causing
bus stops to be shown in the wrong direction. Use a recent smartphone for best
results.

## Other useful commands for dev

`$ ionic cordova build android`

`$ ionic cordova run android --device --no-build`

`$ adb devices`

`ionic build --prod && firebase deploy`
