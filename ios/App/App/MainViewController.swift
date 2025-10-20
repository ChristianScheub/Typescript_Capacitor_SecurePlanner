import UIKit
import Capacitor

class MainViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Re-enable the WKWebView back/forward swipe gesture.
        bridge?.webView?.allowsBackForwardNavigationGestures = true
    }
}
