# CivicFix AI — Voice Analysis

## 1. Purpose

Processes optional citizen voice input and converts it into structured civic complaint information.

## 2. Input

```text
Audio file
```

Voice is optional.

## 3. Processing Flow

```text
Citizen Voice
      ↓
Speech-to-text
      ↓
Complaint Analysis
      ↓
Structured Complaint
```

The flow is intended to support multilingual spoken complaints.

## 4. Output

The processing result contains the voice transcription/language information together with the Complaint Analysis result, including:

```text
transcription
identified language
English translation
category
severity
safety risk
confidence
department
summary
```

## 5. Implementation Files

```text
ai/voiceAnalysis/
├── voicePrompt.js
├── transcribeVoice.js
├── processVoice.js
└── testVoice.js
```

## 6. Testing

Voice processing was successfully tested with a real audio input.

## 7. Current Status

**Implemented and tested.**

Backend integration is separate work.
