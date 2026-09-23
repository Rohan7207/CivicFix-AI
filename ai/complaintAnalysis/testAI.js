const analyzeComplaint = require("./analyzeComplaint");

async function test() {
  const result = await analyzeComplaint(
    "ಶಾಲೆಯ ಮುಂದೆ ದೊಡ್ಡ ಗುಂಡಿ ಇದೆ. ಬೈಕ್ ಸವಾರರು ಬೀಳುತ್ತಿದ್ದಾರೆ.",
  );
}

test();
