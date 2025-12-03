# Setup Guide: Send Quiz Results to Google Sheets

## Step-by-Step Setup

### 1. Create a Google Sheet
- Go to [Google Sheets](https://sheets.google.com/)
- Create a new spreadsheet
- Name it "SAFF & Co. Quiz Results" (or any name you prefer)

### 2. Create Google Apps Script
- Go to [Google Apps Script](https://script.google.com/)
- Click on "New project"
- Name it "SAFF Quiz Script"
- Replace all the default code with the code from `google-apps-script.gs`

### 3. Link the Script to Your Sheet
- In Google Apps Script, click on "Project Settings" (gear icon)
- Copy the "Script ID"
- Click on "Editor" tab
- At the top, select your Google Sheet from the dropdown (near the "<> Apps Script" title)
  - If you don't see it, go to your Sheet > Tools > Script editor > Create script

### 4. Deploy as Web App
- In Google Apps Script, click **Deploy** > **New deployment**
- Select type: **Web app**
- Execute as: **Your Google Account**
- Who has access: **Anyone** (important for the quiz form to access it)
- Click **Deploy**
- Copy the deployment URL - it will look like:
  ```
  https://script.google.com/macros/s/YOUR_SCRIPT_ID/userweb
  ```

### 5. Update Your Quiz Code
- Open `js/script.js`
- Find this line (around line 168):
  ```javascript
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb?v=1";
  ```
- Replace `YOUR_SCRIPT_ID` with the Script ID from your deployed web app
- The final URL should look like:
  ```javascript
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/userweb";
  ```

### 6. Test the Integration
- Open your quiz form in a browser
- Complete the quiz
- Click "Send to Google Sheets" button
- Go back to your Google Sheet - you should see the data added!

## What Data Gets Sent?

The following information is recorded for each quiz submission:
- Q1 - Q6: User's answers to all questions
- ScoreA - ScoreE: Points for each category
- FinalCategory: The winning category (A, B, C, D, or E)
- FinalCategoryName: The category title (e.g., "COZY & HOME")
- RollingList: The recommended products and their rolling percentages
- Timestamp: When the quiz was completed

## Troubleshooting

### Getting CORS errors?
- Make sure you set "Who has access" to **Anyone** when deploying

### Data not appearing in sheets?
- Check that the Sheet ID matches the one you linked in Apps Script
- Go back to Sheet > Tools > Script editor and verify it's the correct sheet
- In browser console, check for error messages

### Button doesn't appear?
- Complete the quiz fully (answer Q1, Q3-Q6, then click "See Result")
- Both export buttons should appear after results are calculated

### Want to auto-submit?
- Modify `calculateResult()` to automatically call `sendToGoogleSheets()` after calculating results
- Or add it to the success alert

## Optional Enhancements

### Auto-submit on result (add this to `calculateResult()` function):
```javascript
// Auto-send to Google Sheets
sendToGoogleSheets();
```

### Send without showing button:
Add this line after `window.quizExportData = {...}`:
```javascript
await sendToGoogleSheets(); // Add await if you want to wait for completion
```

### Customize Google Sheet formatting:
Edit the `doPost()` function in Google Apps Script to add:
- Data validation
- Conditional formatting
- Charts and visualization
- Filtering and sorting

---

**Need help?** Check the console (F12 > Console tab) for error messages while testing.
