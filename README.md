# Adapt Oakland Web
Adapt Oakland Web UI

## Description

Minimal React app built for Urban Biofilter's Adapt Oakland project. The aim is to present several years of urban design/environmental research through an interactive map that integrates with a varierty of charts, tables, case studies, and other information.

This data is grouped into many overlapping categories, so a system of 'tagging' is being used to arbitrarily relate the data. These tags are activated and deactivated by the UI menus to selectively query the content shown. 

Boilerplate borrowed (and modified/Reactified) from: [https://github.com/Hyra/Frickle/](https://github.com/Hyra/Frickle/).

## Installation

### MacOSX:

Sync AO_Website folder on Google Drive.

(This folder should contain a spreadsheet and relevant data to be read by the importer - see 'samples/master_spreadsheet.xlsx'):

Install Homebrew.

Install Node Version Manager (NVM).

Install Heroku Toolbelt.

Install Git (if you don't already have it).

Install MongoDB using Homebrew:

`brew install mongo`

copy and paste the first two lines Homebrew suggests to run Mongo on login (and to launch it now)

Install NodeJS 0.12.7 using NVM. Then clone the repo and install dependencies:
```
nvm install 0.12.7
git clone https://github.com/johnvf/adapt-web-ui.git
cd adapt-web-ui
npm install -g gulp-cli
npm install
```
Place a .env file in your folder that contains the following keys 

(if you aren't working on the AdaptOakland project but using this repo for your own purposes, you will need to create a google service account and obtain these keys. The value of GAPI_PRIVATE_KEY needs to be surrounded by double quotes in order for the .env file to work correctly):
- GAPI_PRIVATE_KEY_ID
- GAPI_PRIVATE_KEY
- GAPI_CLIENT_EMAIL
- GAPI_CLIENT_ID
- GAPI_TYPE

Add the following to your .bashrc, changing paths as needed:

```
alias adaptweb="cd ~/Projects/adapt-web-ui; git pull; heroku local"
alias adaptdata="cd ~/Projects/adapt-web-ui; node ~/Projects/adapt-web-ui/xlsx_2_db.js ~/Google\ Drive/Adapt\ Oakland/AO_Website/AO_Master_spreadsheet.xlsx"
```

To run, type: 
```
adaptweb
```
Visit [http://localhost:8080](http://localhost:8080)

To run the importer, type:
```
adaptdata
```
## Data Import

There is an importer - xlsx_2_db.js - which is set up to read a master spreadsheet .xlsx with pointers to relevant data on Google Drive and/or the user's file system to be imported to MongoDB. See 'samples' for examples of import data. Optionally, to load placeholder data, run seed_db. Both scripts will dump the entire MongoDB instance before running, so use them with caution.

Every tab in the master spreadsheet contains a 'tags' column that is used to create relationships between content. This puts the 'information architecture' of the site in the hands of the content creators, expediting development and making the UI code reusable for other projects.

The importer uses several different libraries/readers to consume content. These libraries/readers have some quirks that should be noted.

### Charts/Tables

- A Google Drive API key is needed (server key). To import data on Google Drive, the App needs to be given access to the relevant google sheets (through the e-mail address assigned when the API key is assigned).
- The App uses c3.js to generate charts from tabular data. The importer consumes JSON files that must comply with what c3 expects.

### Maps
- A Mapbox account is needed. The App uses MapboxGL, so map 'sources' and 'styles' are consumed separately. MapboxGL uses a JSON object to configure styles, rather than pre-generating tiles with a specific style in Mapbox studio. Consequently, the map importer consumes a collection of JSON files that have pointers to the relevant 'sources' through the mapbox id. 

### Text

- These URLs should be entered in the report text in Google Drive
- Hyperlinks in the report text are processed with the following substitutions: 'http://www.adaptoakland.org' -> '/' and '~' -> '#', to produce a relative URL while still permitting testing/debugging the text in Word. For some reason, MS Word strips the '#' off of URLs, and won't allow the user to set relative urls.EG:
  - http://www.adaptoakland.org/adapt/oakland/analyze/chart/direct_removal_of_air_pollution_by_trees_in_wind_tunnel_study
  - http://adaptoakland.org/toolbox~my_heading_title
- For some reason, a .docx dumped out by google drive initially causes the importer to error out. The workaround is:
  1. Open in MS Word.
  2. 'Select All' and then 'Cut' the entire report.
  3. Paste the entire report.
  4. Save the file.

### Images

- The importer can consume images that are defined in-line in the text. 
- There is also support for images to be launched in a detailed modal view. These images must be present on filesystem and pointed to in the master spreadsheet. The importer hosts images on Cloudinary and stores a pointer to the image in MongoDB. If the image has already been uploaded, it won't be re-uploaded (Cloudinary doesn't handle duplicates for you). A pointer will still be created to the already uploaded image.

## API

The REST API routes are auto-generated by mers: https://github.com/jspears/mers

- To seed the database, run node seed_db
- Check out the '/seeds' folder for sample data, or use Postman to explore the API.
- Mers has support for filtering resources. 
- The following resources are supported:
  - asset
  - map
  - mapstyle
  - tabular
  - tag
  - text
  - user
- Try out the following on the sample data for an example of how multiple tags in the UI state could be concatenated to change the output of queries. NOTE: It seems that MERS only supports filtering on strings. Only 1 filter works.
  - http://localhost:8080/api/text
  - http://localhost:8080/api/text?filter[tags]=one_tag

## Client

The client code is compiled by Gulp from the 'client' folder and placed in a folder called 'public'. This is then served statically by the server. Navigation in the UI is handled by React-Router and uses HTML5 History. The client code should be upgraded to the latest version of React and switched to Webpack and ES6 in the future.

## Code Documentation

Detailed documentation can be viewed by running 'npm run jsdoc'.
