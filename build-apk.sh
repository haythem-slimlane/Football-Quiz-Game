#!/bin/bash
set -e

echo "=== 1. Building web application dist ==="
npm run build

echo "=== 2. Setting up directories and copying web assets ==="
mkdir -p tmp/apk-build/gen tmp/apk-build/bin tmp/apk-build/res/drawable tmp/apk-build/assets
cp public/icon-192.png tmp/apk-build/res/drawable/icon.png

# Copy all dist assets to APK assets folder
rm -rf tmp/apk-build/assets/*
cp -r dist/* tmp/apk-build/assets/
rm -f tmp/apk-build/assets/*.apk tmp/apk-build/assets/*.apk.idsig

ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"

echo "=== 3. Generating R.java ==="
aapt package -f -m \
  -J tmp/apk-build/gen \
  -M tmp/apk-build/AndroidManifest.xml \
  -S tmp/apk-build/res \
  -I "$ANDROID_JAR"

echo "=== 4. Compiling Java sources ==="
rm -rf tmp/apk-build/bin/*
javac -source 1.8 -target 1.8 \
  -bootclasspath "$ANDROID_JAR" \
  -cp "$ANDROID_JAR" \
  -d tmp/apk-build/bin \
  tmp/apk-build/gen/com/kooora/quiz/R.java \
  tmp/apk-build/src/com/kooora/quiz/MainActivity.java

echo "=== 5. Creating classes.dex ==="
dalvik-exchange --dex --output=tmp/apk-build/bin/classes.dex tmp/apk-build/bin

echo "=== 6. Packaging unaligned APK with embedded assets ==="
aapt package -f \
  -M tmp/apk-build/AndroidManifest.xml \
  -S tmp/apk-build/res \
  -A tmp/apk-build/assets \
  -I "$ANDROID_JAR" \
  -F tmp/apk-build/bin/unaligned.apk

echo "=== 7. Adding classes.dex to APK ==="
(cd tmp/apk-build/bin && aapt add unaligned.apk classes.dex)

echo "=== 8. Aligning APK ==="
zipalign -f -p 4 tmp/apk-build/bin/unaligned.apk tmp/apk-build/bin/aligned.apk

echo "=== 9. Signing APK ==="
if [ ! -f tmp/apk-build/release.keystore ]; then
  keytool -genkey -v \
    -keystore tmp/apk-build/release.keystore \
    -alias kooora \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass kooora123 \
    -keypass kooora123 \
    -dname "CN=Kooora Quiz, OU=Mobile, O=Kooora, L=Paris, C=FR"
fi

apksigner sign \
  --ks tmp/apk-build/release.keystore \
  --ks-pass pass:kooora123 \
  --key-pass pass:kooora123 \
  --out public/kooora-quiz.apk \
  tmp/apk-build/bin/aligned.apk

echo "=== 10. Verifying signed APK ==="
apksigner verify public/kooora-quiz.apk

# Copy to dist
if [ -d dist ]; then
  cp public/kooora-quiz.apk dist/kooora-quiz.apk
fi

ls -lh public/kooora-quiz.apk
echo "APK successfully built with complete standalone offline assets!"
