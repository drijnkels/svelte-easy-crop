/**
 * @author Valentin Hervieu
 * https://codesandbox.io/s/y09komm059?file=/src/canvasUtils.js
 */

/**
 * Return an image object
 * @param {string} url
 * @returns {Promise<HTMLImageElement>}
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
  const image = new Image()
  image.addEventListener('load', () => resolve(image))
  image.addEventListener('error', (error) => reject(error))
  image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
  image.src = url
})

/**
 * Get the radian angle form a degree
 * @param {number} degreeValue
 * @returns {number}
 */
function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
* This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
* @param {String} imageSrc - Image File url
* @param {Number} zoom
* @param {Object} settings - pixelCrop Object provided by react-easy-crop
 * @param {number} settings.width
 * @param {number} settings.height
 * @param {number} settings.x
 * @param {number} settings.y
 * @param {string} settings.shape
* @param {number} rotation - optional rotation parameter
*/
export async function getCroppedImg(imageSrc, zoom, settings, rotation = 0) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // Largest side of the image
  const maxSize = Math.max(image.width * zoom, image.height * zoom)
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea
  canvas.height = safeArea

  // Something is wrong if we see any blue in the final crop
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, safeArea, safeArea);

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.translate(-safeArea / 2, -safeArea / 2)

  // draw image on rotated canvas
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  )

  // Store the current state of the canvas
  const savedContent = canvas.toDataURL();

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = settings.width // 361
  canvas.height = settings.height // 361

  // Create an image out of the dataUrl so that we can draw it back into the canvas
  const img = new Image();
  img.src = savedContent;

  if (settings.shape == 'round') {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
    ctx.clip();
  }

  ctx.drawImage(
    img,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - settings.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - settings.y)
  );

  // As Base64 string
  return canvas.toDataURL('image/png');

  // As a blob
  // return new Promise((resolve) => {
  //   canvas.toBlob((file) => {
  //     resolve(URL.createObjectURL(file))
  //   }, 'image/png')
  // })
}
