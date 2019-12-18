# AR_mobile

This is a demonstration of AR running in Ionic 4 for mobile devices.

## AndroidManifest.xml

Currently, setting custom configs using the config.xml file doesn't work, but later on we can
use the [cordova custom config plugin](https://github.com/dpa99c/cordova-custom-config#installation) to fix it.

For now, these configs have to be set manually by pasting

```
    <uses-feature android:name="android.hardware.camera" />
    <uses-feature android:name="android.hardware.camera.autofocus" />
    <uses-feature android:name="android.hardware.camera2.full" />
    <uses-feature android:name="android.hardware.camera2.autofocus" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.webkit.PermissionRequest" />
```

inside the `<manifest>` tag in the AndroidManifest.xml file located at `platforms/android/app/src/main/`.

If the file doesn't exist, you must create a build for android first to generate it.

## Running in an android simulator

1. Make sure you have [JDK 1.8.x](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) installed. The download requires a login since it is legacy. <!-- http://bugmenot.com/view/oracle.com -->

2. Set the JAVA_HOME environmental variable to JDK 1.8.x for this terminal session.

`` $ export JAVA_HOME=`/usr/libexec/java_home -v 1.8` ``

3. Run the app

`$ ionic cordova run android`
