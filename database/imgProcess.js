// const { createCanvas, loadImage } = require('canvas')
// const path = require('path')
// const fs = require('fs')



// // Async function used to draw the borders around the objects in the image and save the processed image in the folder.
// async function processImg (objects, file) {
//     // Load image and draw borders and labels
//     const originalImage = await loadImage(file.buffer)
//     const canvas = createCanvas(originalImage.width, originalImage.height)
//     const ctx = canvas.getContext('2d')
//     ctx.drawImage(originalImage, 0, 0)
//     ctx.lineWidth = 3
//     ctx.font = '16px sans-serif'
//     ctx.fillStyle = 'red'

//     // Draw the boxes and text labels for each object.
//     objects.forEach(object => {
//         ctx.beginPath()
//         ctx.rect(object.boundingPoly.normalizedVertices[0].x * originalImage.width,
//             object.boundingPoly.normalizedVertices[0].y * originalImage.height,
//             (object.boundingPoly.normalizedVertices[2].x - object.boundingPoly.normalizedVertices[0].x) * originalImage.width,
//             (object.boundingPoly.normalizedVertices[2].y - object.boundingPoly.normalizedVertices[0].y) * originalImage.height)
//         ctx.stroke()
//         ctx.fillText(object.name, object.boundingPoly.normalizedVertices[0].x * originalImage.width, object.boundingPoly.normalizedVertices[0].y * originalImage.height - 5)
//     })

//     //saving images in buffer

//     const buffer = canvas.toBuffer('image/jpeg')

//     return buffer;
//     // // Save image in processedImages folder
//     // const processedImagePath = 'processedImages/processed' + path.basename(file.path)
//     // const out = fs.createWriteStream(processedImagePath)
//     // const stream = canvas.createJPEGStream()
//     // stream.pipe(out)
//     // out.on('finish', () => {
//     //     console.log('Processed image saved.')
//     // })
//     // return processedImagePath
// }

// module.exports = {
//     processImg
// }