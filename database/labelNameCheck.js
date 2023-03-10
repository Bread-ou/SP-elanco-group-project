// File used to iterate through the animals csv and create a set to compare labels with.
const csv = require('csv-parser')
const fs = require('fs')

// Read the CSV file and create a set of label names.
const labelNamesSet = new Set()
fs.createReadStream('./animals.csv')
  .pipe(csv())
  .on('data', (row) => {
    labelNamesSet.add(row.Animals)
  })
  .on('end', () => {
    console.log('CSV file read')
  })

// Function used to filter the labels.
function filterLabels(labels){
  const filteredLabels = []
  labels.forEach((label) => {
    //console.log('label.description:', label.description)
    labelNamesSet.forEach((animalName) => {
    //console.log('animalName:', animalName)
      if (label.description.includes(animalName)) {
        filteredLabels.push(label)
      }
    })
  })
    return filteredLabels
}

function seperateLabels(newLabels, oldLabels){
  const unfilteredLabels = []
  oldLabels.forEach((oldLabel) =>{
    newLabels.forEach((newLabel) => {
      if (!(oldLabel.description.includes(newLabel.description))) {
        unfilteredLabels.push(oldLabel)
      }
    })
  })
    return unfilteredLabels
}

module.exports = {
    labelNamesSet,
    filterLabels,
    seperateLabels
}