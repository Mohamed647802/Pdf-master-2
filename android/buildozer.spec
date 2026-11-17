[app]
title = PDF Master
package.name = pdfmaster
package.domain = org.pdfmaster
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 1.0

requirements = python3,kivy,requests

orientation = portrait
fullscreen = 0
android.permissions = INTERNET,READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE,MANAGE_EXTERNAL_STORAGE,CAMERA

android.minapi = 21
android.targetapi = 33
android.archs = arm64-v8a, armeabi-v7a

android.icon.filename = %(source.dir)s/assets/icon.png
android.presplash.filename = %(source.dir)s/assets/splash.png

[buildozer]
log_level = 2
