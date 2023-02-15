const fs = require('fs')

function saveRawLabels(sortedLabels, imageUrl) {
  const imageInfo = {
      labels: sortedLabels,
      imageUrl: imageUrl,
  }
  fs.readFile('imageInfo.json', (err, data) => {
    if (err) {
      fs.writeFile('imageInfo.json', JSON.stringify([imageInfo]), (err) => {
        if (err) {
          console.log(err)
        }
      });
    } else {
        const json = JSON.parse(data);
        json.push(imageInfo)
        fs.writeFile('imageInfo.json', JSON.stringify(json), (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
  })
}

module.exports = {
    saveRawLabels
}