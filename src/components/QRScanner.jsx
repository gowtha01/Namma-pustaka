import { useEffect, useId } from "react";

export function QRScanner({ onScan }) {
  const scannerId = useId().replace(/:/g, "");

  useEffect(() => {
    let scanner;
    let active = true;

    async function mountScanner() {
      const { Html5QrcodeScanner } = await import("html5-qrcode");
      if (!active) {
        return;
      }

      scanner = new Html5QrcodeScanner(
        scannerId,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
        },
        false,
      );

      scanner.render(
        async (decodedText) => {
          await onScan(decodedText);
        },
        () => {},
      );
    }

    mountScanner();

    return () => {
      active = false;
      scanner?.clear?.().catch(() => {});
    };
  }, [scannerId, onScan]);

  return <div id={scannerId} />;
}
