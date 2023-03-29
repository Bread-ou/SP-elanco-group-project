############# Elanco Group 1 Image Detection Web Application #############

############# Application Summary #############

This web application allows users to upload images and utilizes the Google Cloud Vision API to process these images. 
The application detects objects and labels within the images, highlights the objects, and filters the labels based on a list of predefined animal names. 
The processed images and the corresponding labels are then displayed to the user.

############# Application Features #############
- Multiple image upload
- Google Cloud Vision API integration
    - Object detection
    - Label detection
- Animal filtering system
- Border display Features

############# Complining the Application #############

Prerequisites: 

Node.js installed 
Google Cloud Vision API Key

Installation:

1. Clone the repository:
git clone https://github.com/Bread-ou/SP-elanco-group-project.git


2. Install dependencies:
npm install


3. Make all folders are available:
- Check to see if you have a processesdImages folder 
- Check to see if you have a images folder


4. Place your Google Cloud Vision API key file in the project root directory, and make sure it's called Key.json


5. Run the application: 
Use the command "node server" in the terminal


6. Open your browser and navigate to the URL below:
http://localhost:3000


############# File Structure #############

server.js : The main server file for setting up and running the Express.js application. 
            It configures the view engine, static file serving, and sets up the routes and middleware.

routes/upload.js : Route file for handling image uploads, Google Cloud Vision API requests, and calling all the nessecary functions for image processing.

database/fileSave.js : Module for saving all the labels to a JSON file.

database/imgProcess.js :  Module for processing images, drawing borders around detected objects, and saving the processed images.

database/labelNameChecker.js : Module for reading the animals CSV file, creating a set of animal names, and filtering labels based on these names.

views/inex.ejs : Main HTML template for the file upload form.

views/labels.ejs : HTML template for displaying the processed images and labels.


############# Libraries #############

- Node.js 
- Express.js : Web application framework
- EJS : Javascritp template engine
- Multer : Middleware for handling multipart/form-data
- Canvas : HTML5 API that allows for dynamic graphics
- Mongoose : MongoDB obkect modeling tool
- csv-parser : CSV parsing library
- Google Cloud Vision API : Image analysis and processing

############# Made By #############

Abdulaziz Marafi