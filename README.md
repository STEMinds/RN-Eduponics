# RN-Eduponics
Eduponics react native app


## Generate release for android

react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

Make sure to remove the files from /res/drawable folder for duplicates
