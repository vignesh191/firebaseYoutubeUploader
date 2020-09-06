# firebaseYoutubeUploader
Backup Google Firebase Storage video files by uploading to YouTube, with this simple JavaScript Firebase Cloud Function.

## Purpose
While Firebase Storage provides a great backend system for website media content, uploading many large video files can be costly. Using this Cloud Function, whenever video files are uploaded to Firebase Storage, they will be also uploaded to a specified Youtube Channel authenticated through OAuth2. 

## What You'll Need
1. An initialized Firebase Project
2. A "functions" folder with an index.js file to store Firebase Cloud Functions in
3. OAuth2 Key file (.json) from: https://console.developers.google.com/apis/

## What to do
The video uplaoder function is provided in the "index.js" file of this repository. After downloading the specified dependencies from "npm" inside the "functions" folder, edit the Cloud Function with OAuth2 credentials and video details. 
Use: 'firebase deploy --only functions' inside your project folder and deploy the function to the Firebase project. 
