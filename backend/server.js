import express from "express";
import cors from "cors";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const creds = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY, // Fix Render stripping newlines
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

const SHEET_ID = "1gIqfm5UGf5eGpPEXICUBCB264YsWfDtztdBe-hROOho"; 
const doc = new GoogleSpreadsheet(SHEET_ID);


async function getGoogleSheet(sheetTitle) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  await doc.loadInfo();

  let sheet = doc.sheetsByTitle[sheetTitle];


  if (!sheet) {
    sheet = await doc.addSheet({
      title: sheetTitle,
      headerValues: ["User ID", "Timestamp", "Question 1", "Question 2", "Question 3", "Question 4"],
    });
    console.log(`Created new sheet: ${sheetTitle}`);
  }
  
  return sheet;
}

app.post("/submit-pre-survey", async (req, res) => {
  try {
    console.log("🔍 Received Pre-Test Data:", req.body);
    const { userId, formattedResponses } = req.body;
    const responses = formattedResponses;

    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Pre-Test Survey"); 

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString(),
      "Question 1": responses[0] || "N/A",
      "Question 2": responses[1] || "N/A",
      "Question 3": responses[2] || "N/A",
      "Question 4": responses[3] || "N/A",
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Pre-Test Data:", rowData);
    res.status(200).json({ success: true, message: "Pre-Test Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/submit-post-survey", async (req, res) => {
  try {
    console.log("🔍 Received Post-Test Data:", req.body);
    const { userId, responses } = req.body;

    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Post-Test Survey"); 

    const rowData = {
      "User ID": userId,
      Timestamp: new Date().toLocaleString(),
      "Question 1": responses[0] || "N/A",
      "Question 2": responses[1] || "N/A",
      "Question 3": responses[2] || "N/A",
      "Question 4": responses[3] || "N/A",
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Post-Test Data:", rowData);
    res.status(200).json({ success: true, message: "Post-Test Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;