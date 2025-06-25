# Jira Ticket Executive Summary Generator

This script automates the generation of executive technical summaries for Jira tickets by aggregating and synthesizing information from Jira, GitHub, and Slack. It is designed for use in Google Apps Script environments, such as Google Sheets, and leverages an external API to process and summarize data.

## Features
- Aggregates data from Jira, GitHub, and Slack for a given Jira ticket.
- Extracts user impact, root causes, PR details, and relevant Slack discussions.
- Formats the output as a structured executive summary.
- Integrates with Google Sheets for easy ticket analysis.

## File Overview
- **getGleanSummary.js**: Main script containing all logic for API interaction, data extraction, formatting, and Google Sheets integration.

## Setup Instructions

### 1. Add the Script to Google Apps Script
1. Open your Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Create a new script file (e.g., `getGleanSummary.js`) and paste the contents of `getGleanSummary.js` into it.

### 2. Set the API Key Property
The script requires an API key to authenticate with the external summarization API. Store this key securely using Google Apps Script Properties:

1. In the Apps Script editor, click on the gear icon (⚙️) in the left sidebar and select **Project properties**.
2. Go to the **Script properties** tab.
3. Click **Add row**.
4. Enter `API_KEY` as the **Name** and paste your API key as the **Value**.
5. Click **Save**.

Alternatively, you can set the property programmatically:
```js
// In the Apps Script editor, run this function once with your API key
function setApiKey() {
  PropertiesService.getScriptProperties().setProperty('API_KEY', 'YOUR_API_KEY_HERE');
}
```
Replace `'YOUR_API_KEY_HERE'` with your actual API key and run the function.

### 3. Usage in Google Sheets
You can use the `summarizeJira` function directly in your Google Sheet:

```
=summarizeJira("JIRA-1234")
```
This will return a formatted executive summary for the specified Jira ticket.

## Security Notes
- The API key is stored securely in script properties and is not exposed in the code.
- Ensure you do not share your API key or expose it in public repositories.

## Customization & Extensibility
- To support additional data sources or change the summary format, consider modularizing the prompt and extraction logic in `getGleanSummary.js`.
- For advanced formatting, integrate a markdown library or enhance the `formatSummary` function.

## Troubleshooting
- If you see `Error fetching summary.`, check that your API key is set correctly and that the external API is reachable.
- Use the Apps Script **Logger** for debugging by viewing logs via **View > Logs** in the Apps Script editor.

## License
This script is provided as-is for internal use. Adapt and extend as needed for your organization. 