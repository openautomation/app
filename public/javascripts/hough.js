
/**
 * Start of hough lib. Just hacks for now.
 */

function houghLines(drawingWidth, drawingHeight) {
  var numAngleCells = 360;
  var rhoMax = Math.sqrt(drawingWidth * drawingWidth + drawingHeight * drawingHeight);
  var accum = Array(numAngleCells);

  // Precalculate tables.
  var cosTable = Array(numAngleCells);
  var sinTable = Array(numAngleCells);
  for (var theta = 0, thetaIndex = 0; thetaIndex < numAngleCells; theta += Math.PI / numAngleCells, thetaIndex++) {
    cosTable[thetaIndex] = Math.cos(theta);
    sinTable[thetaIndex] = Math.sin(theta);
  }

  // Implementation with lookup tables.
  function houghAcc(x, y) {
    var rho;
    var thetaIndex = 0;
    x -= drawingWidth / 2;
    y -= drawingHeight / 2;
    for (; thetaIndex < numAngleCells; thetaIndex++) {
      rho = rhoMax + x * cosTable[thetaIndex] + y * sinTable[thetaIndex];
      rho >>= 1;
      if (accum[thetaIndex] == undefined) accum[thetaIndex] = [];
      if (accum[thetaIndex][rho] == undefined) {
        accum[thetaIndex][rho] = 1;
      } else {
        accum[thetaIndex][rho]++;
      }

      HSctx.beginPath();
      HSctx.fillRect(thetaIndex, rho, 1, 1);
      HSctx.closePath();
    }
  }
}

function toEdges() {
  // lets do some fun
  var image = document.getElementById('image');
  var canvas = document.getElementById('canvas');
  var gui,options,ctx,canvasWidth,canvasHeight;
  var img_u8;

  canvasWidth  = canvas.width;
  canvasHeight = canvas.height;
  ctx = canvas.getContext('2d');

  ctx.fillStyle = "rgb(0,255,0)";
  ctx.strokeStyle = "rgb(0,255,0)";

  img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8C1_t);

  ctx.drawImage(image, 0, 0, 640, 480);
  var imageData = ctx.getImageData(0, 0, 640, 480);
  jsfeat.imgproc.grayscale(imageData.data, img_u8.data);
  ctx.putImageData(imageData, 0, 0);

  var r = 3;
  var kernel_size = (r+1) << 1;

  jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
  jsfeat.imgproc.canny(img_u8, img_u8, 10, 20);

  // render result back to canvas
  var data_u32 = new Uint32Array(imageData.data.buffer);
  var alpha = (0xff << 24);
  var i = img_u8.cols*img_u8.rows, pix = 0;
  while(--i >= 0) {
    pix = img_u8.data[i];
    data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
  }
  
  ctx.putImageData(imageData, 0, 0);
}