# AR_mobile

This is a demonstration of AR running in Ionic 4 for mobile devices.

## Building for android

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

- If a page with AR is opened before permissions to camera/gps are given,
permissions have to be accepted and then the page must be reopened.

- Reopening pages may not initialize the camera properly and will show a white
screen instead. Close and reopen the app to fix this.

- Bus signs may be shown pointing in the wrong direction.

## Other useful commands for dev

`$ ionic cordova build android`

`$ ionic cordova run android --device --no-build`

`$ adb devices`