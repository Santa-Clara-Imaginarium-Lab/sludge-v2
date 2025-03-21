import express from "express";
import cors from "cors";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dotenv from "dotenv";

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


async function getGoogleSheet(sheetTitle, headerValues) {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });
  await doc.loadInfo();

  let sheet = doc.sheetsByTitle[sheetTitle];

  if (!sheet) {
    // Create new sheet only if it doesn't exist
    sheet = await doc.addSheet({
      title: sheetTitle,
      headerValues: headerValues,
    });
    console.log(`Created new sheet: ${sheetTitle}`);
  } else {
    // Check if the required columns exist
    const existingHeaders = sheet.headerValues || [];
    const missingHeaders = headerValues.filter(header => !existingHeaders.includes(header));

    if (missingHeaders.length > 0) {
      // Combine existing headers with missing ones
      const updatedHeaders = [...existingHeaders, ...missingHeaders];

      // Update the header row manually
      await sheet.setHeaderRow(updatedHeaders);
    }
  }
  
  return sheet;
}

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.post("/maaslo1", async (req, res) => {
  try {
    console.log("🔍 Received Pre-Test Data:", req.body);
    const { userId, formattedResponses } = req.body;
    const responses = formattedResponses;

    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Everyday Attentional Failures", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7", "Statement 8", "Statement 9", "Statement 10", "Statement 11", "Statement 12", "Statement 13", "Statement 14", "Statement 15"]);

    const rowData = {
      "User ID": `'${userId}`,
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Statement 1": responses[0] || "N/A",
      "Statement 2": responses[1] || "N/A",
      "Statement 3": responses[2] || "N/A",
      "Statement 4": responses[3] || "N/A",
      "Statement 5": responses[4] || "N/A",
      "Statement 6": responses[5] || "N/A",
      "Statement 7": responses[6] || "N/A",
      "Statement 8": responses[7] || "N/A",
      "Statement 9": responses[8] || "N/A",
      "Statement 10": responses[9] || "N/A",
      "Statement 11": responses[10] || "N/A",
      "Statement 12": responses[11] || "N/A",
      "Statement 13": responses[12] || "N/A",
      "Statement 14": responses[13] || "N/A",
      "Statement 15": responses[14] || "N/A",
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Everyday Attentional Failures Data:", rowData);
    res.status(200).json({ success: true, message: "Everyday Attentional Failures Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/videoengagement", async (req, res) => {
  try {
    console.log("🔍 Received Video Engagement Data:", req.body);
    const { userId, responses } = req.body;

    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Video Engagement & Satisfaction", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3"]);

    const rowData = {
      "User ID": `'${userId}`, 
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Statement 1": responses[0] || "N/A",
      "Statement 2": responses[1] || "N/A",
      "Statement 3": responses[2] || "N/A"
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Video Engagement Data:", rowData);
    res.status(200).json({ success: true, message: "Video Engagement Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/social-media-habits-1", async (req, res) => {
  try {
    console.log("🔍 Received Social Media Habits Data:", req.body);
    const { userId, platforms } = req.body;

    if (!userId || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Social Media Habits", ["User ID", "Timestamp", "Platform", "Hours", "Reasons"]);

    const rowData = {
      "User ID": `'${userId}`, 
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      Platform: platforms.join(", ") || "N/A",
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Social Media Habits Data:", rowData);
    res.status(200).json({ success: true, message: "Social Media Habits submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/social-media-habits-2", async (req, res) => {
  try {
    console.log("🔍 Received Social Media Habits Data:", req.body);
    const { userId, hours } = req.body;

    if (!userId || !hours || !Array.isArray(hours) || hours.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Social Media Habits", ["User ID", "Hours"]);

    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; // Sort by Timestamp

    const rowData = {
      "User ID": `'${userId}`, 
      Hours: hours.join(", ") || "N/A",
    };

    if (latestRow) {
      latestRow.Hours = rowData.Hours;
      await latestRow.save();
      console.log("Successfully updated Social Media Habits Data:", rowData);
    } else {
      await sheet.addRow(rowData);
      console.log("Successfully stored new Social Media Habits Data:", rowData);
    }

    res.status(200).json({ success: true, message: "Social Media Habits submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/social-media-habits-3", async (req, res) => {
  try {
    console.log("🔍 Received Social Media Habits Data:", req.body);
    const { userId, reasons } = req.body;

    if (!userId || !reasons || !Array.isArray(reasons) || reasons.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Social Media Habits", ["User ID", "Reasons"]);

    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; // Sort by Timestamp

    const rowData = {
      "User ID": `'${userId}`, 
      Reasons: reasons.join(", ") || "N/A",
    };

    if (latestRow) {
      latestRow.Reasons = rowData.Reasons;
      await latestRow.save();
      console.log("Successfully updated Social Media Habits Data:", rowData);
    } else {
      await sheet.addRow(rowData);
      console.log("Successfully stored new Social Media Habits Data:", rowData);
    }

    res.status(200).json({ success: true, message: "Social Media Habits submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/submit-setup", async (req, res) => {
  try {
    console.log("🔍 Received Setup Data:", req.body);
    const { userId, setupData } = req.body;

    if (!userId || !setupData) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Setup Data", ["User ID", "Setup Data", "Timestamp"]);

    const existingHeaders = sheet.headerValues || [];
    const requiredHeaders = ["User ID", "Setup Data", "Timestamp"];
    const missingHeaders = requiredHeaders.filter(header => !existingHeaders.includes(header));

    if (missingHeaders.length > 0) {
      // Add missing headers
      await sheet.setHeaderRow(requiredHeaders);
      console.log(`Added missing headers to sheet: Setup Data`);
    }

    const rowData = {
      "User ID": `'${userId}`, 
      "Setup Data": setupData.join(", ") || "N/A",
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Setup Data:", rowData);
    res.status(200).json({ success: true, message: "Setup data submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/maaslo2", async (req, res) => {
  try {
    console.log("🔍 Received Additional Pre-Test Data:", req.body);
    const { userId, responses } = req.body;

    if (!userId || !responses || !Array.isArray(responses) || responses.length !== 5) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Everyday Attentional Failures", [
      "User ID", "Statement 6", "Statement 7", "Statement 8", "Statement 9", "Statement 10"
    ]);

    // Find the latest row with the given userId
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; // Sort by Timestamp

    if (latestRow) {
      // Update the existing row
      latestRow["Statement 6"] = responses[0] || "N/A";
      latestRow["Statement 7"] = responses[1] || "N/A";
      latestRow["Statement 8"] = responses[2] || "N/A";
      latestRow["Statement 9"] = responses[3] || "N/A";
      latestRow["Statement 10"] = responses[4] || "N/A";
      await latestRow.save();
      console.log("Successfully updated Additional Pre-Test Data:", latestRow);
    } else {
      console.error("No existing row found for userId:", userId);
      return res.status(404).json({ success: false, error: "No existing row found" });
    }

    res.status(200).json({ success: true, message: "Additional Pre-Test Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/maaslo3", async (req, res) => {
  try {
    console.log("🔍 Received Additional Pre-Test Data:", req.body);
    const { userId, responses } = req.body;

    if (!userId || !responses || !Array.isArray(responses) || responses.length !== 5) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Everyday Attentional Failures", [
      "User ID", "Statement 11", "Statement 12", "Statement 13", "Statement 14", "Statement 15"
    ]);

    // Find the latest row with the given userId
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; // Sort by Timestamp

    if (latestRow) {
      // Update the existing row
      latestRow["Statement 11"] = responses[0] || "N/A";
      latestRow["Statement 12"] = responses[1] || "N/A";
      latestRow["Statement 13"] = responses[2] || "N/A";
      latestRow["Statement 14"] = responses[3] || "N/A";
      latestRow["Statement 15"] = responses[4] || "N/A";
      await latestRow.save();
      console.log("Successfully updated Additional Pre-Test Data:", latestRow);
    } else {
      console.error("No existing row found for userId:", userId);
      return res.status(404).json({ success: false, error: "No existing row found" });
    }

    res.status(200).json({ success: true, message: "Additional Pre-Test Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/mews1", async (req, res) => {
  try {
    console.log("🔍 Received MEWS Data:", req.body);
    const { userId, formattedResponses } = req.body;
    const responses = formattedResponses;

    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Mind Excessively Wandering Scale", ["User ID", "Timestamp", "Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5", "Statement 6", "Statement 7", "Statement 8", "Statement 9", "Statement 10", "Statement 11", "Statement 12", "Statement 13", "Statement 14", "Statement 15"]);

    const rowData = {
      "User ID": `'${userId}`, 
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Statement 1": responses[0] || "N/A",
      "Statement 2": responses[1] || "N/A",
      "Statement 3": responses[2] || "N/A",
      "Statement 4": responses[3] || "N/A",
      "Statement 5": responses[4] || "N/A",
      "Statement 6": responses[5] || "N/A",
      "Statement 7": responses[6] || "N/A",
      "Statement 8": responses[7] || "N/A",
      "Statement 9": responses[8] || "N/A",
      "Statement 10": responses[9] || "N/A",
      "Statement 11": responses[10] || "N/A",
      "Statement 12": responses[11] || "N/A",
      "Statement 13": responses[12] || "N/A",
      "Statement 14": responses[13] || "N/A",
      "Statement 15": responses[14] || "N/A",
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Mind Excessively Wandering Scale Data:", rowData);
    res.status(200).json({ success: true, message: "Mind Excessively Wandering Scale Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/mews2", async (req, res) => {
  try {
    console.log("🔍 Received Additional MEWS Data:", req.body);
    const { userId, responses } = req.body;

    if (!userId || !responses || !Array.isArray(responses) || responses.length !== 5) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Mind Excessively Wandering Scale", [
      "User ID", "Statement 6", "Statement 7", "Statement 8", "Statement 9", "Statement 10"
    ]);

    // Find the latest row with the given userId
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; // Sort by Timestamp

    if (latestRow) {
      // Update the existing row
      latestRow["Statement 6"] = responses[0] || "N/A";
      latestRow["Statement 7"] = responses[1] || "N/A";
      latestRow["Statement 8"] = responses[2] || "N/A";
      latestRow["Statement 9"] = responses[3] || "N/A";
      latestRow["Statement 10"] = responses[4] || "N/A";
      await latestRow.save();
      console.log("Successfully updated Additional MEWS Data:", latestRow);
    } else {
      console.error("No existing row found for userId:", userId);
      return res.status(404).json({ success: false, error: "No existing row found" });
    }

    res.status(200).json({ success: true, message: "Additional MEWS Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/mews3", async (req, res) => {
  try {
    console.log("🔍 Received Additional MEWS Data:", req.body);
    const { userId, responses } = req.body;

    if (!userId || !responses || !Array.isArray(responses) || responses.length !== 5) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Mind Excessively Wandering Scale", [
      "User ID", "Statement 11", "Statement 12", "Statement 13", "Statement 14", "Statement 15"
    ]);

    // Find the latest row with the given userId
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; // Sort by Timestamp

    if (latestRow) {
      // Update the existing row
      latestRow["Statement 11"] = responses[0] || "N/A";
      latestRow["Statement 12"] = responses[1] || "N/A";
      latestRow["Statement 13"] = responses[2] || "N/A";
      latestRow["Statement 14"] = responses[3] || "N/A";
      latestRow["Statement 15"] = responses[4] || "N/A";
      await latestRow.save();
      console.log("Successfully updated Additional MEWS Data:", latestRow);
    } else {
      console.error("No existing row found for userId:", userId);
      return res.status(404).json({ success: false, error: "No existing row found" });
    }

    res.status(200).json({ success: true, message: "Additional MEWS Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.post('/mood', async (req, res) => {
  const { userId, mood } = req.body;

  try {
    const sheet = await getGoogleSheet("CurrentMood", ["User ID", "Timestamp", "Mood"]);
    const rowData = {
      "User ID": userId,
      "Timestamp": new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Mood": mood,
    };
    await sheet.addRow(rowData);
    res.status(200).send('Mood recorded successfully');
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).send('Error recording mood');
  }
});

app.post("/demographicques1", async (req, res) => {
  try {
    console.log("🔍 Received Demographic Data:", req.body);
    const { userId, gender } = req.body;

    if (!userId || !gender) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Demographics", ["User ID", "Timestamp", "Gender", "Age", "Ethnicity", "AcademicYear"]);

    const existingHeaders = sheet.headerValues || [];
    const requiredHeaders = ["User ID", "Timestamp", "Gender", "Age", "Ethnicity", "AcademicYear"];
    const missingHeaders = requiredHeaders.filter(header => !existingHeaders.includes(header));

    if (missingHeaders.length > 0) {
      // Add missing headers
      await sheet.setHeaderRow(requiredHeaders);
      console.log(`Added missing headers to sheet: ${missingHeaders.join(", ")}`);
    }

    const rowData = {
      "User ID": `'${userId}`, 
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      Gender: gender,
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Demographic Data:", rowData);
    res.status(200).json({ success: true, message: "Demographic data submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/demographicques2", async (req, res) => {
  try {
    console.log("🔍 Received Age Data:", req.body);
    const { userId, age } = req.body;

    if (!userId || !age) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Demographics", ["User ID", "Timestamp", "Gender", "Age", "Ethnicity", "AcademicYear"]);

    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0];

    if (latestRow) {
      latestRow.Age = age;
      await latestRow.save();
      console.log("Successfully updated Age Data:", latestRow);
    } else {
      console.error("No existing row found for userId:", userId);
      return res.status(404).json({ success: false, error: "No existing row found" });
    }

    res.status(200).json({ success: true, message: "Age data submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/demographicques3", async (req, res) => {
  try {
    console.log("🔍 Received Ethnicity Data:", req.body);
    const { userId, ethnicity } = req.body;

    if (!userId || !ethnicity) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Demographics", ["User ID", "Timestamp", "Gender", "Age", "Ethnicity", "AcademicYear"]);

    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; 

    if (latestRow) {
      latestRow.Ethnicity = ethnicity.join(", "); 
      await latestRow.save();
      console.log("Successfully updated Ethnicity Data:", latestRow);
    } else {
      console.error("No existing row found for userId:", userId);
      return res.status(404).json({ success: false, error: "No existing row found" });
    }

    res.status(200).json({ success: true, message: "Ethnicity data submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/demographicques4", async (req, res) => {
  try {
    console.log("🔍 Received Academic Year Data:", req.body);
    const { userId, academicYear } = req.body;

    if (!userId || !academicYear) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Demographics", ["User ID", "Timestamp", "Gender", "Age", "Ethnicity", "AcademicYear"]);

    // Find the latest row with the given userId
    const rows = await sheet.getRows();
    const existingRows = rows.filter(row => row["User ID"] === userId);
    console.log("Existing Rows for User ID:", existingRows); 

    const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0];
    console.log("Latest Row:", latestRow); 

    if (latestRow) {

      latestRow.AcademicYear = academicYear; 
      await latestRow.save();
      console.log("Successfully updated Academic Year Data:", latestRow);
    } else {
      console.error("No existing row found for userId:", userId);
      return res.status(404).json({ success: false, error: "No existing row found" });
    }

    res.status(200).json({ success: true, message: "Academic year data submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/popquiz', async (req, res) => {
    const { userId, answers, score } = req.body;

    try {
        const sheet = await getGoogleSheet("PopQuizNew", [
            "userId", 
            "Timestamp", 
            "Question 1", 
            "Question 2", 
            "Question 3", 
            "Question 4", 
            "Question 5", 
            "Question 6", 
            "Question 7", 
            "Question 8", 
            "Question 9", 
            "Score (Out of 8)"
        ]);

        // Prepare the row data
        const rowData = {
            "userId": `'${userId}`, 
            "Timestamp": new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
            ...answers.reduce((acc, answer, index) => {
                acc[`Question ${index + 1}`] = answer; 
                return acc;
            }, {}),
            "Score (Out of 8)": score,
        };

        // Add the row to the sheet
        await sheet.addRow(rowData);
        console.log("Quiz data saved successfully:", rowData);
        res.status(200).json({ success: true, message: "Quiz data saved successfully." });
    } catch (error) {
        console.error('Error saving quiz data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/popquiz2', async (req, res) => {
    const { userId, answer } = req.body;

    try {
        // Get the PopQuiz sheet
        const sheet = await getGoogleSheet("PopQuizNew", [
            "userId", 
            "Timestamp", 
            "Question 1", 
            "Question 2", 
            "Question 3", 
            "Question 4", 
            "Question 5", 
            "Question 6", 
            "Question 7", 
            "Question 8", 
            "Question 9", 
            "Score (Out of 8)"
        ]);

        // Find the latest row for the given userId
        const rows = await sheet.getRows();
        const existingRows = rows.filter(row => row.userId === userId);
        const latestRow = existingRows.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0]; // Sort by Timestamp

        if (latestRow) {
            // Update the latest row with the answer for Question 11
            latestRow["Question 9"] = answer;
            await latestRow.save();
            console.log("Question 9 updated successfully for userId:", userId);
            res.status(200).json({ success: true, message: "Question 9 updated successfully." });
        } else {
            console.error("No existing row found for userId:", userId);
            res.status(404).json({ success: false, error: "No existing row found for userId." });
        }
    } catch (error) {
        console.error('Error updating Question 9:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/socialmedia1", async (req, res) => {
  try {
    console.log("🔍 Received Social Media 1 Data:", req.body);
    const { userId, hours } = req.body;

    if (!userId || !hours || typeof hours !== 'object') {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Social Media New 1", [
      "User ID", "Timestamp", "YouTube", "Facebook", "Instagram", "Snapchat", "BeReal.", "X (Twitter)", "LinkedIn"
    ]);

    const rowData = {
      "User ID": `'${userId}`, 
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      YouTube: hours.YouTube,
      Facebook: hours.Facebook,
      Instagram: hours.Instagram,
      Snapchat: hours.Snapchat,
      "BeReal.": hours.BeReal,
      "X (Twitter)": hours.Twitter,
      LinkedIn: hours.LinkedIn
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Social Media 1 Data:", rowData);
    res.status(200).json({ success: true, message: "Social Media 1 data submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/socialmedia2", async (req, res) => {
  try {
    console.log("🔍 Received Social Media 2 Data:", req.body);
    const { userId, formattedResponses } = req.body;
    const responses = formattedResponses;

    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Social Media New 2", ["User ID", "Timestamp", "Social interaction", "Information seeking", "Passing time", "Entertainment", "Relaxation", "Expression of opinions", "Information sharing", "Knowledge of others", "Multitasking"]);

    const rowData = {
      "User ID": `'${userId}`, 
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Social interaction": responses[0] || "N/A",
      "Information seeking": responses[1] || "N/A",
      "Passing time": responses[2] || "N/A",
      "Entertainment": responses[3] || "N/A",
      "Relaxation": responses[4] || "N/A",
      "Expression of opinions": responses[5] || "N/A",
      "Information sharing": responses[6] || "N/A",
      "Knowledge of others": responses[7] || "N/A",
      "Multitasking": responses[8] || "N/A",
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Social Media Data:", rowData);
    res.status(200).json({ success: true, message: "Social Media Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/socialmedia2new", async (req, res) => {
  try {
    console.log("🔍 Received Social Media 2 New Data:", req.body);
    const { userId, formattedResponses } = req.body;
    const responses = formattedResponses;

    if (!userId || !responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("Invalid request format. Received:", req.body);
      return res.status(400).json({ success: false, error: "Invalid request format" });
    }

    const sheet = await getGoogleSheet("Social Media New 2", ["User ID", "Timestamp", "Interpersonal-Related Actions", "Intrapersonal-Related Actions", "Information-Related Actions"]);

    const rowData = {
      "User ID": `'${userId}`, 
      Timestamp: new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      "Interpersonal-Related Actions": responses[0] || "N/A",
      "Intrapersonal-Related Actions": responses[1] || "N/A",
      "Information-Related Actions": responses[2] || "N/A",
    };

    await sheet.addRow(rowData);
    console.log("Successfully stored Social Media New 2 Data:", rowData);
    res.status(200).json({ success: true, message: "Social Media 2 Survey submitted!" });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;