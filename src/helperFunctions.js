async function loadPDF({ PSPDFKit, container, document, baseUrl }) {
  const instance = await PSPDFKit.load({
    // Container where PSPDFKit should be mounted.
    container,
    // The document to open.
    document,
    // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
    baseUrl,
  });
  return instance;
}
async function createInkAnnotation({ PSPDFKit, instance, x1, y1, x2, y2 }) {
  const { List } = PSPDFKit.Immutable;
  const { DrawingPoint, Rect } = PSPDFKit.Geometry;
  const { InkAnnotation } = PSPDFKit.Annotations;
  const annotation = new InkAnnotation({
    pageIndex: 0,
    boundingBox: new Rect({ width: 400, height: 100 }),
    strokeColor: new PSPDFKit.Color({ r: 255, b: 0, g: 255 }),
    lines: List([
      List([
        new DrawingPoint({ x: x1, y: y1 }),
        new DrawingPoint({ x: x2, y: y2 }),
      ]),
    ]),
  });
  const createdAnnotation = await instance.create(annotation);
  return createdAnnotation;
}
async function createImageAnnotation({ url, instance, PSPDFKit }) {
  const blob = await fetch(url).then((res) => res.blob());
  const imageAttachmentID = await instance.createAttachment(blob);
  const annotation = await new PSPDFKit.Annotations.ImageAnnotation({
    pageIndex: 0,
    contentType: "image/jpeg",
    imageAttachmentID,
    isSignature: true,
    description: "Example Image Annotation",
    boundingBox: new PSPDFKit.Geometry.Rect({
      left: 10,
      top: 20,
      width: 150,
      height: 150,
    }),
  });
  const createdAnnotation = await instance.create(annotation);

  return createdAnnotation;
}
async function createImageBlob(url) {
  const request = await fetch(url);
  const blob = await request.blob();
  return blob;
}
async function createTextAnnotation({ PSPDFKit, instance }) {
  const annotation = new PSPDFKit.Annotations.TextAnnotation({
    pageIndex: 0,
    text: "Welcome to\nPSPDFKit",
    font: "Helvetica",
    isBold: true,
    horizontalAlign: "center",
    boundingBox: new PSPDFKit.Geometry.Rect({
      left: 50,
      top: 200,
      width: 100,
      height: 80,
    }),
    fontColor: PSPDFKit.Color.BLUE,
  });
  const createdAnnotation = await instance.create(annotation);
  return createdAnnotation;
}

export {
  loadPDF,
  createInkAnnotation,
  createImageBlob,
  createImageAnnotation,
  createTextAnnotation,
};
