from kivy.app import App
from kivy.core.window import Window
from kivy.uix.widget import Widget
from kivy.utils import platform

# غيّر العنوان ده لرابط التطبيق المنشور (يفضّل https).
# localhost على التليفون معناه التليفون نفسه، مش جهازك.
APP_URL = "https://YOUR-DEPLOYED-URL"

if platform == "android":
    from android.runnable import run_on_ui_thread
    from jnius import autoclass

    PythonActivity = autoclass("org.kivy.android.PythonActivity")
    WebView = autoclass("android.webkit.WebView")
    WebViewClient = autoclass("android.webkit.WebViewClient")
    LayoutParams = autoclass("android.view.ViewGroup$LayoutParams")
    Color = autoclass("android.graphics.Color")


class PDFMasterApp(App):
    webview = None

    def build(self):
        Window.clearcolor = (0.059, 0.059, 0.102, 1)  # #0F0F1A
        if platform == "android":
            Window.bind(on_keyboard=self.on_back)
            self.create_webview()
        return Widget()

    if platform == "android":

        @run_on_ui_thread
        def create_webview(self):
            activity = PythonActivity.mActivity
            wv = WebView(activity)
            settings = wv.getSettings()
            settings.setJavaScriptEnabled(True)
            settings.setDomStorageEnabled(True)
            wv.setBackgroundColor(Color.parseColor("#0F0F1A"))
            wv.setWebViewClient(WebViewClient())  # الروابط تفتح جوه التطبيق
            activity.addContentView(
                wv,
                LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT),
            )
            self.webview = wv
            if "YOUR-DEPLOYED-URL" in APP_URL:
                wv.loadData("Set APP_URL in android/main.py", "text/plain", "utf-8")
            else:
                wv.loadUrl(APP_URL)

        @run_on_ui_thread
        def go_back(self):
            if self.webview is not None and self.webview.canGoBack():
                self.webview.goBack()
            else:
                PythonActivity.mActivity.moveTaskToBack(True)

    def on_back(self, window, key, *args):
        if key == 27 and self.webview is not None:  # زر الرجوع
            self.go_back()
            return True
        return False


if __name__ == "__main__":
    PDFMasterApp().run()
