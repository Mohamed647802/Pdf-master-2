from kivy.app import App
from kivy.uix.webview import WebView  # android webview
from kivy.uix.boxlayout import BoxLayout
from kivy.core.window import Window


class PDFMasterApp(App):
    def build(self):
        Window.clearcolor = (0.059, 0.059, 0.102, 1)  # #0F0F1A
        layout = BoxLayout()
        # On Android, load the web UI
        wv = WebView(url="http://localhost:3000")
        layout.add_widget(wv)
        return layout


if __name__ == '__main__':
    PDFMasterApp().run()
