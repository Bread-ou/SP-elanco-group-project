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
    //console.log('label.description:', label.description)
    labelNamesSet.forEach((animalName) => {
    //console.log('animalName:', animalName)
      if (label.description.includes(animalName)) {
        newLabels.push(label)
        found = true
      }
    })
    if (!found){
      sortedLabels.push(label)
    }
    found = false
  })
  return ({ newLabels, sortedLabels })
}

// -------Obsolete------
// function seperateLabels(newLabels, oldLabels){
//   newLabels.forEach((newLabel) =>{
//     oldLabels.forEach((oldLabel, index) => {
//     if (oldLabel.description === newLabel.description){
//       console.log(oldLabel)
//       oldLabels.splice(index, 1)
//     }
//   })
// })
// return oldLabels
// }


module.exports = {
    labelNamesSet,
    filterLabels
}