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

  const contentHtml = element.innerHTML;

  // 1. Primary Strategy: Open a clean, isolated popup print window
  // This guarantees Chrome/Edge has an actual rendered viewport and renders exactly 1 page
  const printWindow = window.open("", "_blank", "width=850,height=950,scrollbars=yes,status=no");

  if (printWindow && !printWindow.closed) {
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${documentTitle}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
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
            .window-print-bar {
              position: sticky;
              top: 0;
              left: 0;
              right: 0;
              background: #0f172a;
              color: #ffffff;
              padding: 12px 24px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 13px;
              font-weight: 600;
              box-shadow: 0 2px 8px rgba(0,0,0,0.18);
              z-index: 10000;
            }
            .window-print-bar button {
              cursor: pointer;
              font-weight: 700;
              border-radius: 8px;
              padding: 7px 16px;
              font-size: 12px;
              transition: all 0.2s;
            }
            .btn-print {
              background: #0d9488;
              color: #ffffff;
              border: none;
            }
            .btn-print:hover {
              background: #0f766e;
            }
            .btn-close {
              background: transparent;
              color: #94a3b8;
              border: 1px solid #334155;
              margin-left: 8px;
            }
            .btn-close:hover {
              color: #ffffff;
              border-color: #64748b;
            }
            @media print {
              .window-print-bar {
                display: none !important;
              }
            }
            .document-canvas {
              width: 100%;
              max-width: 800px;
              margin: 16px auto;
              background: #ffffff;
              padding: 16px;
            }
            @media print {
              .document-canvas {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="window-print-bar">
            <span>📄 ${documentTitle}</span>
            <div>
              <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
              <button class="btn-close" onclick="window.close()">✕ Close</button>
            </div>
          </div>
          <div class="document-canvas">
            ${contentHtml}
          </div>
        </body>
      </html>
    `);

    // Copy parent document stylesheets into the print window
    const parentStyles = document.querySelectorAll('link[rel="stylesheet"], style');
    parentStyles.forEach((node) => {
      try {
        printWindow.document.head.appendChild(node.cloneNode(true));
      } catch (err) {}
    });

    printWindow.document.close();

    // Trigger print once rendered
    const triggerWindowPrint = () => {
      printWindow.focus();
      printWindow.print();
    };

    if (printWindow.document.readyState === "complete") {
      setTimeout(triggerWindowPrint, 350);
    } else {
      printWindow.onload = () => {
        setTimeout(triggerWindowPrint, 350);
      };
      // Backup timer in case onload does not fire
      setTimeout(triggerWindowPrint, 600);
    }

    return;
  }

  // 2. Fallback Strategy: If window.open is blocked by strict browser popup rules,
  // use a real-sized off-screen iframe (900px wide, NOT 0x0)
  const oldFrame = document.getElementById("vitalsync-print-frame");
  if (oldFrame) {
    oldFrame.remove();
  }

  const iframe = document.createElement("iframe");
  iframe.id = "vitalsync-print-frame";
  iframe.style.position = "absolute";
  iframe.style.top = "-99999px";
  iframe.style.left = "-99999px";
  iframe.style.width = "900px";
  iframe.style.height = "1200px";
  iframe.style.border = "none";
  iframe.style.zIndex = "-9999";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${documentTitle}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
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
          .print-sheet {
            width: 100%;
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            padding: 8px;
          }
        </style>
      </head>
      <body>
        <div class="print-sheet">
          ${contentHtml}
        </div>
      </body>
    </html>
  `);

  const parentStyles = document.querySelectorAll('link[rel="stylesheet"], style');
  parentStyles.forEach((node) => {
    try {
      iframeDoc.head.appendChild(node.cloneNode(true));
    } catch (err) {}
  });

  iframeDoc.close();

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
      }, 3000);
    }
  }, 400);
}
