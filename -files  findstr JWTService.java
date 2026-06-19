[33mcommit 5417db706584699abcc08db53782dc58ca85adb1[m
Author: 0Kenji0 <147841123+0Kenji0@users.noreply.github.com>
Date:   Tue Jun 16 02:53:26 2026 +0700

    Add frontend and backend source code

[1mdiff --git a/Fakeflix b/Fakeflix[m
[1mdeleted file mode 160000[m
[1mindex 3da8ccc..0000000[m
[1m--- a/Fakeflix[m
[1m+++ /dev/null[m
[36m@@ -1 +0,0 @@[m
[31m-Subproject commit 3da8ccc5624819a04d7a56324963f74fc8c83fff[m
[1mdiff --git a/Fakeflix/.claude/settings.json b/Fakeflix/.claude/settings.json[m
[1mnew file mode 100644[m
[1mindex 0000000..176e6a5[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/.claude/settings.json[m
[36m@@ -0,0 +1,5 @@[m
[32m+[m[32m{[m
[32m+[m[32m  "enabledPlugins": {[m
[32m+[m[32m    "expo@claude-plugins-official": true[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
[1mdiff --git a/Fakeflix/.gitignore b/Fakeflix/.gitignore[m
[1mnew file mode 100644[m
[1mindex 0000000..a08687b[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/.gitignore[m
[36m@@ -0,0 +1,51 @@[m
[32m+[m[32m# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files[m
[32m+[m
[32m+[m[32m# dependencies[m
[32m+[m[32mnode_modules/[m
[32m+[m
[32m+[m[32m# Expo[m
[32m+[m[32m.expo/[m
[32m+[m[32mdist/[m
[32m+[m[32mweb-build/[m
[32m+[m[32mexpo-env.d.ts[m
[32m+[m
[32m+[m[32m# Native[m
[32m+[m[32m.kotlin/[m
[32m+[m[32m*.orig.*[m
[32m+[m[32m*.jks[m
[32m+[m[32m*.p8[m
[32m+[m[32m*.p12[m
[32m+[m[32m*.key[m
[32m+[m[32m*.mobileprovision[m
[32m+[m
[32m+[m[32m# Metro[m
[32m+[m[32m.metro-health-check*[m
[32m+[m
[32m+[m[32m# debug[m
[32m+[m[32mnpm-debug.*[m
[32m+[m[32myarn-debug.*[m
[32m+[m[32myarn-error.*[m
[32m+[m
[32m+[m[32m# macOS[m
[32m+[m[32m.DS_Store[m
[32m+[m[32m*.pem[m
[32m+[m
[32m+[m[32m# local env files[m
[32m+[m[32m.env*.local[m
[32m+[m
[32m+[m[32m# typescript[m
[32m+[m[32m*.tsbuildinfo[m
[32m+[m
[32m+[m[32mexample[m
[32m+[m
[32m+[m[32m# generated native folders[m
[32m+[m[32m/ios[m
[32m+[m[32m/android[m
[32m+[m
[32m+[m[32mnode_modules/[m
[32m+[m[32m.expo/[m
[32m+[m[32mdist/[m
[32m+[m[32mweb-build/[m
[32m+[m[32m.git/[m
[32m+[m[32m*.md[m
[32m+[m[32m.env[m
\ No newline at end of file[m
[1mdiff --git a/Fakeflix/.vscode/extensions.json b/Fakeflix/.vscode/extensions.json[m
[1mnew file mode 100644[m
[1mindex 0000000..b7ed837[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/.vscode/extensions.json[m
[36m@@ -0,0 +1 @@[m
[32m+[m[32m{ "recommendations": ["expo.vscode-expo-tools"] }[m
[1mdiff --git a/Fakeflix/.vscode/settings.json b/Fakeflix/.vscode/settings.json[m
[1mnew file mode 100644[m
[1mindex 0000000..e2798e4[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/.vscode/settings.json[m
[36m@@ -0,0 +1,7 @@[m
[32m+[m[32m{[m
[32m+[m[32m  "editor.codeActionsOnSave": {[m
[32m+[m[32m    "source.fixAll": "explicit",[m
[32m+[m[32m    "source.organizeImports": "explicit",[m
[32m+[m[32m    "source.sortMembers": "explicit"[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
[1mdiff --git a/Fakeflix/Dockerfile b/Fakeflix/Dockerfile[m
[1mnew file mode 100644[m
[1mindex 0000000..c2e2b20[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/Dockerfile[m
[36m@@ -0,0 +1,13 @@[m
[32m+[m[32m# Build stage[m
[32m+[m[32mFROM node:20-alpine AS build[m
[32m+[m[32mWORKDIR /app[m
[32m+[m[32mCOPY package*.json ./[m
[32m+[m[32mRUN npm install[m
[32m+[m[32mCOPY . .[m
[32m+[m[32mRUN npx expo export --platform web[m
[32m+[m
[32m+[m[32m# Serve stage[m
[32m+[m[32mFROM nginx:alpine[m
[32m+[m[32mCOPY --from=build /app/dist /usr/share/nginx/html[m
[32m+[m[32mCOPY nginx.conf /etc/nginx/conf.d/default.conf[m
[32m+[m[32mEXPOSE 80[m
\ No newline at end of file[m
[1mdiff --git a/Fakeflix/LICENSE b/Fakeflix/LICENSE[m
[1mnew file mode 100644[m
[1mindex 0000000..30b20e3[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/LICENSE[m
[36m@@ -0,0 +1,21 @@[m
[32m+[m[32mThe MIT License (MIT)[m
[32m+[m
[32m+[m[32mCopyright (c) 2015-present 650 Industries, Inc. (aka Expo)[m
[32m+[m
[32m+[m[32mPermission is hereby granted, free of charge, to any person obtaining a copy[m
[32m+[m[32mof this software and associated documentation files (the "Software"), to deal[m
[32m+[m[32min the Software without restriction, including without limitation the rights[m
[32m+[m[32mto use, copy, modify, merge, publish, distribute, sublicense, and/or sell[m
[32m+[m[32mcopies of the Software, and to permit persons to whom the Software is[m
[32m+[m[32mfurnished to do so, subject to the following conditions:[m
[32m+[m
[32m+[m[32mThe above copyright notice and this permission notice shall be included in all[m
[32m+[m[32mcopies or substantial portions of the Software.[m
[32m+[m
[32m+[m[32mTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR[m
[32m+[m[32mIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,[m
[32m+[m[32mFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE[m
[32m+[m[32mAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER[m
[32m+[m[32mLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,[m
[32m+[m[32mOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE[m
[32m+[m[32mSOFTWARE.[m
[1mdiff --git a/Fakeflix/app.json b/Fakeflix/app.json[m
[1mnew file mode 100644[m
[1mindex 0000000..f2589dc[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/app.json[m
[36m@@ -0,0 +1,46 @@[m
[32m+[m[32m{[m
[32m+[m[32m  "expo": {[m
[32m+[m[32m    "name": "Fakeflix",[m
[32m+[m[32m    "slug": "Fakeflix",[m
[32m+[m[32m    "version": "1.0.0",[m
[32m+[m[32m    "orientation": "portrait",[m
[32m+[m[32m    "icon": "./assets/images/icon.png",[m
[32m+[m[32m    "scheme": "fakeflix",[m
[32m+[m[32m    "userInterfaceStyle": "automatic",[m
[32m+[m[32m    "ios": {[m
[32m+[m[32m      "icon": "./assets/expo.icon"[m
[32m+[m[32m    },[m
[32m+[m[32m    "android": {[m
[32m+[m[32m      "adaptiveIcon": {[m
[32m+[m[32m        "backgroundColor": "#E6F4FE",[m
[32m+[m[32m        "foregroundImage": "./assets/images/android-icon-foreground.png",[m
[32m+[m[32m        "backgroundImage": "./assets/images/android-icon-background.png",[m
[32m+[m[32m        "monochromeImage": "./assets/images/android-icon-monochrome.png"[m
[32m+[m[32m      },[m
[32m+[m[32m      "predictiveBackGestureEnabled": false[m
[32m+[m[32m    },[m
[32m+[m[32m    "web": {[m
[32m+[m[32m      "output": "static",[m
[32m+[m[32m      "favicon": "./assets/images/favicon.png"[m
[32m+[m[32m    },[m
[32m+[m[32m    "plugins": [[m
[32m+[m[32m      "expo-router",[m
[32m+[m[32m      [[m
[32m+[m[32m        "expo-splash-screen",[m
[32m+[m[32m        {[m
[32m+[m[32m          "backgroundColor": "#208AEF",[m
[32m+[m[32m          "android": {[m
[32m+[m[32m            "image": "./assets/images/splash-icon.png",[m
[32m+[m[32m            "imageWidth": 76[m
[32m+[m[32m          }[m
[32m+[m[32m        }[m
[32m+[m[32m      ],[m
[32m+[m[32m      "expo-video",[m
[32m+[m[32m      "expo-image"[m
[32m+[m[32m    ],[m
[32m+[m[32m    "experiments": {[m
[32m+[m[32m      "typedRoutes": true,[m
[32m+[m[32m      "reactCompiler": true[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
[1mdiff --git a/Fakeflix/assets/expo.icon/Assets/expo-symbol 2.svg b/Fakeflix/assets/expo.icon/Assets/expo-symbol 2.svg[m
[1mnew file mode 100644[m
[1mindex 0000000..51d3676[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/assets/expo.icon/Assets/expo-symbol 2.svg[m	
[36m@@ -0,0 +1,3 @@[m
[32m+[m[32m<svg width="652" height="606" viewBox="0 0 652 606" fill="none" xmlns="http://www.w3.org/2000/svg">[m
[32m+[m[32m<path d="M353.554 0H298.446C273.006 0 249.684 14.6347 237.962 37.9539L4.37994 502.646C-1.04325 513.435 -1.45067 526.178 3.2716 537.313L22.6123 582.918C34.6475 611.297 72.5404 614.156 88.4414 587.885L309.863 222.063C313.34 216.317 319.439 212.826 326 212.826C332.561 212.826 338.659 216.317 342.137 222.063L563.559 587.885C579.46 614.156 617.352 611.297 629.388 582.918L648.728 537.313C653.451 526.178 653.043 513.435 647.62 502.646L414.038 37.9539C402.316 14.6347 378.994 0 353.554 0Z" fill="white"/>[m
[32m+[m[32m</svg>[m
[1mdiff --git a/Fakeflix/assets/expo.icon/Assets/grid.png b/Fakeflix/assets/expo.icon/Assets/grid.png[m
[1mnew file mode 100644[m
[1mindex 0000000..eefea24[m
Binary files /dev/null and b/Fakeflix/assets/expo.icon/Assets/grid.png differ
[1mdiff --git a/Fakeflix/assets/expo.icon/icon.json b/Fakeflix/assets/expo.icon/icon.json[m
[1mnew file mode 100644[m
[1mindex 0000000..7a2c33c[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/assets/expo.icon/icon.json[m
[36m@@ -0,0 +1,40 @@[m
[32m+[m[32m{[m
[32m+[m[32m  "fill" : {[m
[32m+[m[32m    "automatic-gradient" : "extended-srgb:0.00000,0.47843,1.00000,1.00000"[m
[32m+[m[32m  },[m
[32m+[m[32m  "groups" : [[m
[32m+[m[32m    {[m
[32m+[m[32m      "layers" : [[m
[32m+[m[32m        {[m
[32m+[m[32m          "image-name" : "expo-symbol 2.svg",[m
[32m+[m[32m          "name" : "expo-symbol 2",[m
[32m+[m[32m          "position" : {[m
[32m+[m[32m            "scale" : 1,[m
[32m+[m[32m            "translation-in-points" : [[m
[32m+[m[32m              1.1008400065293245e-05,[m
[32m+[m[32m              -16.046875[m
[32m+[m[32m            ][m
[32m+[m[32m          }[m
[32m+[m[32m        },[m
[32m+[m[32m        {[m
[32m+[m[32m          "image-name" : "grid.png",[m
[32m+[m[32m          "name" : "grid"[m
[32m+[m[32m        }[m
[32m+[m[32m      ],[m
[32m+[m[32m      "shadow" : {[m
[32m+[m[32m        "kind" : "neutral",[m
[32m+[m[32m        "opacity" : 0.5[m
[32m+[m[32m      },[m
[32m+[m[32m      "translucency" : {[m
[32m+[m[32m        "enabled" : true,[m
[32m+[m[32m        "value" : 0.5[m
[32m+[m[32m      }[m
[32m+[m[32m    }[m
[32m+[m[32m  ],[m
[32m+[m[32m  "supported-platforms" : {[m
[32m+[m[32m    "circles" : [[m
[32m+[m[32m      "watchOS"[m
[32m+[m[32m    ],[m
[32m+[m[32m    "squares" : "shared"[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/Fakeflix/assets/images/background.jpg b/Fakeflix/assets/images/background.jpg[m
[1mnew file mode 100644[m
[1mindex 0000000..97c9946[m
Binary files /dev/null and b/Fakeflix/assets/images/background.jpg differ
[1mdiff --git a/Fakeflix/assets/images/icon.png b/Fakeflix/assets/images/icon.png[m
[1mnew file mode 100644[m
[1mindex 0000000..67c777a[m
Binary files /dev/null and b/Fakeflix/assets/images/icon.png differ
[1mdiff --git a/Fakeflix/assets/images/tabIcons/explore.png b/Fakeflix/assets/images/tabIcons/explore.png[m
[1mnew file mode 100644[m
[1mindex 0000000..73d8258[m
Binary files /dev/null and b/Fakeflix/assets/images/tabIcons/explore.png differ
[1mdiff --git a/Fakeflix/assets/images/tabIcons/explore@2x.png b/Fakeflix/assets/images/tabIcons/explore@2x.png[m
[1mnew file mode 100644[m
[1mindex 0000000..21b9bd2[m
Binary files /dev/null and b/Fakeflix/assets/images/tabIcons/explore@2x.png differ
[1mdiff --git a/Fakeflix/assets/images/tabIcons/explore@3x.png b/Fakeflix/assets/images/tabIcons/explore@3x.png[m
[1mnew file mode 100644[m
[1mindex 0000000..422202d[m
Binary files /dev/null and b/Fakeflix/assets/images/tabIcons/explore@3x.png differ
[1mdiff --git a/Fakeflix/assets/images/tabIcons/home.png b/Fakeflix/assets/images/tabIcons/home.png[m
[1mnew file mode 100644[m
[1mindex 0000000..ad5699c[m
Binary files /dev/null and b/Fakeflix/assets/images/tabIcons/home.png differ
[1mdiff --git a/Fakeflix/assets/images/tabIcons/home@2x.png b/Fakeflix/assets/images/tabIcons/home@2x.png[m
[1mnew file mode 100644[m
[1mindex 0000000..22a1f2c[m
Binary files /dev/null and b/Fakeflix/assets/images/tabIcons/home@2x.png differ
[1mdiff --git a/Fakeflix/assets/images/tabIcons/home@3x.png b/Fakeflix/assets/images/tabIcons/home@3x.png[m
[1mnew file mode 100644[m
[1mindex 0000000..f5d1f9a[m
Binary files /dev/null and b/Fakeflix/assets/images/tabIcons/home@3x.png differ
[1mdiff --git a/Fakeflix/nginx.conf b/Fakeflix/nginx.conf[m
[1mnew file mode 100644[m
[1mindex 0000000..637f971[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/nginx.conf[m
[36m@@ -0,0 +1,15 @@[m
[32m+[m[32mserver {[m
[32m+[m[32m    listen 80;[m
[32m+[m[32m    server_name localhost;[m
[32m+[m[32m    root /usr/share/nginx/html;[m
[32m+[m[32m    index index.html;[m
[32m+[m
[32m+[m[32m    location / {[m
[32m+[m[32m        try_files $uri $uri/ /index.html;[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {[m
[32m+[m[32m        expires 1y;[m
[32m+[m[32m        add_header Cache-Control "public, immutable";[m
[32m+[m[32m    }[m
[32m+[m[32m}[m
\ No newline at end of file[m
[1mdiff --git a/Fakeflix/package-lock.json b/Fakeflix/package-lock.json[m
[1mnew file mode 100644[m
[1mindex 0000000..ad564d8[m
[1m--- /dev/null[m
[1m+++ b/Fakeflix/package-lock.json[m
[36m@@ -0,0 +1,8521 @@[m
[32m+[m[32m{[m
[32m+[m[32m  "name": "fakeflix",[m
[32m+[m[32m  "version": "1.0.0",[m
[32m+[m[32m  "lockfileVersion": 3,[m
[32m+[m[32m  "requires": true,[m
[32m+[m[32m  "packages": {[m
[32m+[m[32m    "": {[m
[32m+[m[32m      "name": "fakeflix",[m
[32m+[m[32m      "version": "1.0.0",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@expo/ui": "~56.0.17",[m
[32m+[m[32m        "@expo/vector-icons": "^15.0.2",[m
[32m+[m[32m        "@react-native-async-storage/async-storage": "2.2.0",[m
[32m+[m[32m        "@react-navigation/bottom-tabs": "^7.16.2",[m
[32m+[m[32m        "@react-navigation/native": "^7.2.5",[m
[32m+[m[32m        "@react-navigation/native-stack": "^7.16.0",[m
[32m+[m[32m        "axios": "^1.16.1",[m
[32m+[m[32m        "expo": "~56.0.11",[m
[32m+[m[32m        "expo-av": "^16.0.8",[m
[32m+[m[32m        "expo-constants": "~56.0.16",[m
[32m+[m[32m        "expo-device": "~56.0.4",[m
[32m+[m[32m        "expo-font": "~56.0.5",[m
[32m+[m[32m        "expo-glass-effect": "~56.0.4",[m
[32m+[m[32m        "expo-image": "~56.0.11",[m
[32m+[m[32m        "expo-linear-gradient": "~56.0.4",[m
[32m+[m[32m        "expo-linking": "~56.0.14",[m
[32m+[m[32m        "expo-router": "~56.2.10",[m
[32m+[m[32m        "expo-splash-screen": "~56.0.10",[m
[32m+[m[32m        "expo-status-bar": "~56.0.4",[m
[32m+[m[32m        "expo-symbols": "~56.0.6",[m
[32m+[m[32m        "expo-system-ui": "~56.0.5",[m
[32m+[m[32m        "expo-video": "~56.1.3",[m
[32m+[m[32m        "expo-web-browser": "~56.0.5",[m
[32m+[m[32m        "react": "19.2.3",[m
[32m+[m[32m        "react-dom": "19.2.3",[m
[32m+[m[32m        "react-native": "0.85.3",[m
[32m+[m[32m        "react-native-gesture-handler": "~2.31.1",[m
[32m+[m[32m        "react-native-reanimated": "4.3.1",[m
[32m+[m[32m        "react-native-safe-area-context": "~5.7.0",[m
[32m+[m[32m        "react-native-screens": "4.25.2",[m
[32m+[m[32m        "react-native-svg": "15.15.4",[m
[32m+[m[32m        "react-native-web": "~0.21.0",[m
[32m+[m[32m        "react-native-worklets": "0.8.3"[m
[32m+[m[32m      },[m
[32m+[m[32m      "devDependencies": {[m
[32m+[m[32m        "@types/react": "~19.2.2",[m
[32m+[m[32m        "typescript": "~6.0.3"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@adobe/css-tools": {[m
[32m+[m[32m      "version": "4.5.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@adobe/css-tools/-/css-tools-4.5.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-6OzddxPio9UiWTCemp4N8cYLV2ZN1ncRnV1cVGtve7dhPOtRkleRyx32GQCYSwDYgaHU3USMm84tNsvKzRCa1Q==",[m
[32m+[m[32m      "license": "MIT"[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/code-frame": {[m
[32m+[m[32m      "version"