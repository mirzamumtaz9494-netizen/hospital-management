/**
 * VitalSync HMS - Universal Print Service
 * Provides isolated, rock-solid document printing without blank pages,
 * page-overflow clipping, or background layout interference.
 */

export function printElement(
  element: HTMLElement | null,
  documentTitle: string = "VitalSync Official Document"
) {
  if (!element || typeof window === "undefined") {
    if (typeof window !== "undefined") {
      window.print();
    }
    return;
  }

  // Remove any stale print frame
  const oldFrame = document.getElementById("vitalsync-print-frame");
  if (oldFrame) {
    oldFrame.remove();
  }

  const iframe = document.createElement("iframe");
  iframe.id = "vitalsync-print-frame";
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  const clonedHtml = element.innerHTML;

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${documentTitle}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          .no-print {
            display: none !important;
          }
          /* High contrast print styling */
          .print-sheet {
            width: 100%;
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            padding: 4px;
          }
        </style>
      </head>
      <body>
        <div class="print-sheet">
          ${clonedHtml}
        </div>
      </body>
    </html>
  `);
  iframeDoc.close();

  // Copy all document stylesheets & Tailwind CSS rules into the isolated iframe
  const styleNodes = document.querySelectorAll('link[rel="stylesheet"], style');
  styleNodes.forEach((node) => {
    try {
      iframeDoc.head.appendChild(node.cloneNode(true));
    } catch (err) {
      // Ignore cross-origin policy exceptions
    }
  });

  // Brief delay to allow CSS rules and any QR code images to paint
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 300);
}
