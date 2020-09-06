const functions = require('firebase-functions');
const admin = require('firebase-admin');

const fs = require('fs');
const os = require('os')
const path = require('path');
const {google} = require('googleapis');
const youtube = google.youtube('v3');

admin.initializeApp();



exports.YTUpload = functions.storage.object().onFinalize(async (object) => { //onFinalize is same as "on a db change"
      const filePath = object.name   //uploaded file's metadata
      const fileBucket = object.bucket
      const bucket = admin.storage().bucket(fileBucket);
      const fileName = path.basename(filePath);

      if (!object.contentType.startsWith('video/')) { //for non-video files
        console.log("File type is not a video.")
        return
      }

      if (object.resourceState === 'not_exists') { //in the case of immediate file deletion
        console.log("This is a deletion event.")
        return
      }

      const tempFilePath = path.join(os.tmpdir(), fileName); //creating a temp path in Firebase VM
      await bucket.file(filePath).download({destination: tempFilePath}); //downloading to temp path

      //Visit "Google Developers Console" and create an OAuth2 Key to obtain these details
      const oauth2 = new google.auth.OAuth2("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET", "YOUR_REDIRECT_URIS[0]");
      oauth2.setCredentials({
          refresh_token: "YOUR_REFRESH_TOKEN"
      })
      google.options({auth: oauth2});
      console.log('passed authentication phase')

      const res = await youtube.videos.insert( //adding video to youtube channel
        {
          part: 'id,snippet,status',
          notifySubscribers: false,
          requestBody: {
            snippet: {
              title: 'YOUR_VIDEO_TITLE',
              description: 'YOUR_VIDEO_DESCRIPTION',
            },
            status: {
              privacyStatus: 'YOUR_VIDEO_PRIVACY_STATUS',
            },
          },
          media: {
            body: fs.createReadStream(tempFilePath),
          },
        },
             {

        }
      );
      console.log('\n\n');
      console.log(res.data);
      fs.unlinkSync(tempFilePath)
      return res.data;

})
