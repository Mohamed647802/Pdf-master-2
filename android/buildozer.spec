[app]
title = PDF Master
package.name = pdfmaster
package.domain = org.pdfmaster
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 1.0

# requests اتشال: main.py مش بيستخدمه، ووجوده كان بيشغّل خطوة pip الفاشلة
requirements = python3,kivy,pyjnius,android

orientation = portrait
fullscreen = 0
android.permissions = INTERNET,READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE,MANAGE_EXTERNAL_STORAGE,CAMERA

android.minapi = 21
android.targetapi = 33
# معمارية واحدة: بتتجنب إنشاء الـ venv مرتين
android.archs = arm64-v8a
android.accept_sdk_license = True

android.icon.filename = %(source.dir)s/assets/icon.png
android.presplash.filename = %(source.dir)s/assets/splash.png

[buildozer]
log_level = 2
