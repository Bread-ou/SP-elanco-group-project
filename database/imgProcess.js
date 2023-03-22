const { createCanvas, loadImage } = require('canvas')
const imgSave = require('./fileSave')


async function processImg (objects, file) {
    // Load image and draw borders and labels
    const originalImage = await loadImage(file.path)
    const canvas = createCanvas(originalImage.width, originalImage.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(originalImage, 0, 0)
    ctx.lineWidth = 3
    ctx.font = '16px sans-serif'
    ctx.fillStyle = 'red'

    objects.forEach(object => {
        ctx.beginPath()
        ctx.rect(object.boundingPoly.normalizedVertices[0].x * originalImage.width,
            object.boundingPoly.normalizedVertices[0].y * originalImage.height,
            (object.boundingPoly.normalizedVertices[2].x - object.boundingPoly.normalizedVertices[0].x) * originalImage.width,
            (object.boundingPoly.normalizedVertices[2].y - object.boundingPoly.normalizedVertices[0].y) * originalImage.height)
        ctx.stroke()
        ctx.fillText(object.name, object.boundingPoly.normalizedVertices[0].x * originalImage.width, object.boundingPoly.normalizedVertices[0].y * originalImage.height - 5)
    })
    return imgSave.saveLabels(file)

}

module.exports = {
    processImg
}