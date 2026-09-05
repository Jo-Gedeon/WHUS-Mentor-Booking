// Sets up authenticated access to the Google Calendar API.
//
//
// 1. Create a service account in Google Cloud Console, enable the
//    Calendar API, and download its JSON key.
// 2. Save that key file somewhere OUTSIDE of git (this repo's .gitignore
//    already excludes `server/*.json` except package files — see below).
// 3. Point GOOGLE_APPLICATION_CREDENTIALS (in server/.env) at that file's
//    path, or load the key JSON another way and pass it into GoogleAuth.
// 4. Share your actual Google Calendar with the service account's email
//    (found inside the key JSON, looks like
//    `xxx@xxx.iam.gserviceaccount.com`) with "See all event details"
//    (read) permission — that's what makes reads actually work.
//
// const { google } = require("googleapis");
//
// const auth = new google.auth.GoogleAuth({
//     // keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//     scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
// });
//
// const calendar = google.calendar({ version: "v3", auth });
//
// module.exports = { calendar };





module.exports = {
    // TODO: replace with a real, authenticated `calendar` client (see above).
    calendar: null,
};
