import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Adjust viewport height for iOS devices
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    return () => {
      window.removeEventListener("resize", setViewportHeight);
    };
  }, []);

  // Detect iOS and show install banner
  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.navigator.standalone;

    if (isIOS && !isInStandaloneMode) {
      setShowInstallBanner(true);
    }
  }, []);

  // Handle Scanner
  useEffect(() => {
    if (!isScannerVisible) return;

    const codeReader = new BrowserMultiFormatReader();
    const videoElement = document.getElementById("camera");

    codeReader.decodeFromVideoDevice(
      null,
      videoElement,
      (result, err) => {
        if (result) {
          const scannedCode = result.text;
          setItems((prevItems) =>
            prevItems.includes(scannedCode) ? prevItems : [...prevItems, scannedCode]
          );

          // Show success toast if the code is new
          if (!items.includes(scannedCode)) {
            setToastMessage(`${scannedCode} added to list`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }
        }
        if (err && !(err.name === "NotFoundException")) {
          setError(err.message || "Unknown error occurred.");
        }
      }
    );

    return () => {
      codeReader.reset();
    };
  }, [isScannerVisible, items]);

  return (
    <div
      className="d-flex flex-column"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header */}
      <header className="bg-primary text-white text-center py-3">
        <h1>Barcode Scanner</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column justify-content-start align-items-center py-3">
        {!isScannerVisible ? (
          <div className="w-100 text-center">
            <h2>Scanned Items</h2>
            {items.length === 0 ? (
              <p>No items scanned yet.</p>
            ) : (
              <ul className="list-group">
                {items.map((item, index) => (
                  <li key={index} className="list-group-item">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="text-center">
            <video
              id="camera"
              className="bg-secondary my-4"
              width="100%"
              height="200"
              autoPlay
            ></video>
            {error && <p className="text-danger">{error}</p>}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-light text-center py-3">
        <button
          className="btn btn-primary"
          onClick={() => setScannerVisible((prev) => !prev)}
        >
          {isScannerVisible ? "Back to List" : "Scan"}
        </button>
      </footer>

      {/* Success Toast */}
      {showToast && (
        <div
          className="toast position-fixed bottom-0 end-0 m-3 bg-success text-white show"
          style={{ zIndex: 1050 }}
        >
          <div className="toast-body">{toastMessage}</div>
        </div>
      )}

      {/* iOS Install Banner */}
      {showInstallBanner && (
        <div
          className="position-fixed bottom-0 start-0 w-100 bg-info text-white text-center py-2"
          style={{ zIndex: 1050 }}
        >
          <p className="mb-0">
            Tap <strong>Share</strong> and then <strong>"Add to Home Screen"</strong>{" "}
            to install this app.
          </p>
          <button
            className="btn btn-sm btn-light mt-2"
            onClick={() => setShowInstallBanner(false)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
