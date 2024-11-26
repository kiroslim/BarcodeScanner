import React, {useState, useEffect, useCallback} from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Handle Scanned Code
  const handleScannedCode = useCallback(
    (scannedCode) => {
      if (!items.includes(scannedCode)) {
        setItems((prevItems) => [...prevItems, scannedCode]);
        setToastMessage(`${scannedCode} added to list`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    },
    [items] // Dependencies
  );

  // Handle Hardware Scanner Input
  const handleInputChange = (event) => {
    if (event.key === "Enter") {
      const scannedCode = event.target.value.trim();
      if (scannedCode) {
        handleScannedCode(scannedCode);
        event.target.value = ""; // Clear the input field
      }
    }
  };

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

  // Handle Camera Scanner
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
          handleScannedCode(scannedCode);
        }
        if (err && !(err.name === "NotFoundException")) {
          setError(err.message || "Unknown error occurred.");
        }
      }
    );

    return () => {
      codeReader.reset();
    };
  }, [isScannerVisible, handleScannedCode]);

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
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="w-100 text-center">
                  {/* Hardware Scanner Input */}

                  <div className="input-group">
                    <span className="input-group-text">&#128269;</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Scan a barcode"
                      onKeyDown={handleInputChange}
                      autoFocus
                    />

                  </div>
                  <h2 className="mt-4">Scanned Items</h2>
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
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="text-center">
                  <video
                    id="camera"
                    className="bg-black my-4"
                    width="100%"
                    height="200"
                    autoPlay
                  ></video>
                  {error && <p className="text-danger">{error}</p>}
                </div>
              </div>
            </div>
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
          className="toast position-fixed bottom-0 start-50 translate-middle-x bg-success text-white show"
          style={{ zIndex: 1050, marginBottom: "4rem", paddingInline: "1rem" }}
        >
          <div className="toast-body text-center">{toastMessage}</div>
        </div>
      )}


      {/* iOS Install Banner */}
      {showInstallBanner && (
        <div
          className="position-fixed bottom-0 start-0 w-100 bg-info text-white text-center py-2"
          style={{ zIndex: 1050 }}
        >
          <p className="mb-0">
            Tap <strong>Share</strong> and then <strong>"Add to Home Screen"</strong> to
            install this app.
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
