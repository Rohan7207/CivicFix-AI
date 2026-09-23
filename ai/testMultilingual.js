require("dotenv").config({
  path: "./ai/complaintAnalysis/.env",
});

const analyzeComplaint = require("./complaintAnalysis/analyzeComplaint");

const complaints = [
  "ಶಾಲೆಯ ಮುಂದೆ ದೊಡ್ಡ ಗುಂಡಿ ಇದೆ. ಬೈಕ್ ಸವಾರರು ಬೀಳುತ್ತಿದ್ದಾರೆ.",

  "स्कूल के सामने सड़क पर बड़ा गड्ढा है और बाइक वाले गिर रहे हैं।",

  "పాఠశాల ముందు పెద్ద గుంత ఉంది. బైక్ ప్రయాణికులు పడిపోతున్నారు.",

  "பள்ளிக்கு அருகில் பெரிய சாலை குழி உள்ளது. இருசக்கர வாகன ஓட்டிகள் விழுகின்றனர்.",
];

async function test() {
  for (const complaint of complaints) {
    const result = await analyzeComplaint(complaint);
  }
}

test();
