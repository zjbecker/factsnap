# FasctSnap

- Link to video presentation: https://youtu.be/DBCNUbPS8W8

## What is FactSnap?

Factsnap is an app for iOS / Android which allows users to get facts about landmarks they encounter.  Users upload photos to our service and receive information about any landmarks that are detected in the photos.  The user's upload history is also stored and the user can navigate through previous uploads and see the landmark facts that they received. 

## How was it made?

FactSnap was created as part of a Northcoders group project in April 2023.  Our team consists of Johnny, Tanzil, Zach, Kyle and Dave, and we went with the name Mainframe Systems for our group.  The app was made using agile development practices, and was conceived and built in 9 days.

The app was built using expo, and we used Firebase Auth, Storage and Realtime Database for a lot of the feautures.  For landmark detection it uses the Google Landmark API, and then uses the Wikipedia API to get facts for any detected landmarks.  We built an Express back end server which protects our Google API key.  When a user uploads a photo, our app uploads it to firebase storage, and then the backend passes this new image to the third-party APIs and returns with facts which are then uploaded to Realtime Database so that they can be accessed later. 

### Tech 
- React Native / Expo
- Firebase Auth, Realtime Database and Storage
- Express
- Google Landmark API
- Wikipedia API 
