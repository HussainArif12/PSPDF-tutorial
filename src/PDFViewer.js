import { useEffect, useRef } from "react";
import {
  createImageAnnotation,
  createImageBlob,
  createInkAnnotation,
  createTextAnnotation,
  loadPDF,
} from "./helperFunctions";
export default function PDFViewer(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit;
    (async function () {
      PSPDFKit = await import("pspdfkit");
      const instance = await loadPDF({
        PSPDFKit,
        container,
        document: props.document,
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
      });
      const url = "https://picsum.photos/536/354";

      const annotation = await createInkAnnotation({
        PSPDFKit,
        instance,
        x1: 5,
        y1: 5,
        x2: 100,
        y2: 100,
      });
      instance.setAnnotationCreatorName("Alice");
      createTextAnnotation({ PSPDFKit, instance });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
