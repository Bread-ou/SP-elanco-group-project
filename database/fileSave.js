const fs = require('fs')
const path = require('path')

// Function used to save the labels to a JSON file.
function saveLabels(sortedLabels, imageUrl, fileName) {
  const imageInfo = {
      labels: sortedLabels,
      imageUrl: imageUrl,
  }
  fs.readFile(fileName, (err, data) => {
    if (err) {
      fs.writeFile(fileName, JSON.stringify([imageInfo]), (err) => {
        if (err) {
          console.log(err)
        }
      });
    } else {
        const json = JSON.parse(data);
        json.push(imageInfo)
        fs.writeFile(fileName, JSON.stringify(json), (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
  })
}

// Function used to save the processed img to the processedImages folder
function saveProcessedImg(file, canvas){
  const processedImagePath = 'processedImages/processed' + path.basename(file.path)
  const out = fs.createWriteStream(processedImagePath)
  const stream = canvas.createJPEGStream()
  stream.pipe(out)
  out.on('finish', () => {
      console.log('Processed image saved.')
  })
  return processedImagePath
}

module.exports = {
    saveLabels,
    saveProcessedImg
}