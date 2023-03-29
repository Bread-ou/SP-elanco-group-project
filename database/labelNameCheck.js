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
  const newLabels = []
  const sortedLabels = []
  let found = false
  labels.forEach((label) => {
    labelNamesSet.forEach((animalName) => {
      if (label.description.includes(animalName)) {
        newLabels.push(label)
        found = true
      }
    })
    // If the label is not a part of the list add it to the "unfiltered list"
    if (!found){
      sortedLabels.push(label)
    }
    found = false
  })
  return ({ newLabels, sortedLabels })
}

// Function to check if the objects found in the image are animals.
function isAnimal(object){
  return labelNamesSet.has(object.name)
}

module.exports = {
    labelNamesSet,
    filterLabels,
    isAnimal
}