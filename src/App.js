import React, { useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

function App() {
  const [view, setView] = useState("list"); // 'list' or 'scanner'
  const [items, setItems] = useState([]); // Scanned items list
  const [error, setError] = useState(""); // Error handling

  useEffect(() => {
    if (view === "scanner") {
      const codeReader = new BrowserMultiFormatReader();
      const videoElement = document.getElementById("camera");

      codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
        if (result) {
          const scannedCode = result.text;
          setItems((prevItems) =>
            prevItems.includes(scannedCode) ? prevItems : [...prevItems, scannedCode]
          );
        }
        if (err && !(err.name === "NotFoundException")) {
          setError(err.message || "Unknown error occurred.");
        }
      });

      return () => {
        codeReader.reset(); // Cleanup scanner
      };
    }
  }, [view]);

  return (
    <div className="d-flex flex-column">
      {/* Header */}
      <header className="bg-dark text-white py-3">
        <div className="container">
          <h1 className="text-center">Barcode Scanner</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container my-4 flex-grow-1">
        {view === "list" ? (
          <>
            <h2>Scanned Items</h2>
            <ul className="list-group">
              {items.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className="text-center">
              <video id="camera" width="300" height="200" autoPlay className="border"></video>
              {error && <p className="text-danger mt-3">{error}</p>}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-light py-3">
        <div className="container d-flex justify-content-between">
          <span>&copy; 2024 Kiril Iliev</span>
          <button
            className="btn btn-primary"
            onClick={() => setView(view === "list" ? "scanner" : "list")}
          >
            {view === "list" ? "Start Scanner" : "Back to List"}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
