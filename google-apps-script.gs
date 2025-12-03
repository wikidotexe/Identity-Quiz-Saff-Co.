// Google Apps Script - Deploy as Web App
// Instructions:
// 1. Go to https://script.google.com/
// 2. Create new project
// 3. Replace the default code with this script
// 4. Click Deploy > New deployment > Web app
// 5. Execute as: Your account
// 6. Who has access: Anyone
// 7. Copy the deployment URL
// 8. Replace YOUR_SCRIPT_ID in script.js with the ID from the URL

function doPost(e) {
  try {
    // Get the data from the request
    const data = JSON.parse(e.postData.contents);

    // Get or create the spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Quiz Results");

    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = ss.insertSheet("Quiz Results");
    }

    // Get the last row with data
    const lastRow = sheet.getLastRow();

    // If this is the first data entry, create headers
    if (lastRow === 0) {
      const headers = Object.keys(data);
      sheet.appendRow(headers);
    }

    // Append the new data row
    const values = Object.values(data);
    sheet.appendRow(values);

    // Format the sheet
    if (lastRow === 0) {
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, Object.keys(data).length);
      headerRange.setBackground("#4285f4");
      headerRange.setFontColor("white");
      headerRange.setFontWeight("bold");

      // Auto-resize columns
      sheet.autoResizeColumns(1, Object.keys(data).length);
    }

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data saved successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to manually trigger when testing
function testPost() {
  const testData = {
    Q1: "A",
    Q2: "Test Collection",
    Q3: "A",
    Q4: "A",
    Q5: "A",
    Q6: "A",
    ScoreA: 4,
    ScoreB: 0,
    ScoreC: 0,
    ScoreD: 0,
    ScoreE: 0,
    FinalCategory: "A",
    FinalCategoryName: "COZY & HOME",
    RollingList: "KIE RAHA (40%) | RAE NIRA (30%)",
    Timestamp: new Date().toLocaleString(),
  };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Quiz Results") || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Quiz Results");

  const headers = Object.keys(testData);
  sheet.appendRow(headers);
  sheet.appendRow(Object.values(testData));

  Logger.log("Test data added to sheet");
}
