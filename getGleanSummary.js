function getGleanSummary(jiraTicket) {
 const apiUrl = "https://<company_URL>.com/rest/api/v1/chat";
 const apiKey = getApiKey();

 const prompt = `
 Objective: Generate an executive technical summary for ${jiraTicket} by aggregating data from app:jira, app:github, and app:slack.
Per-App Instructions:
app:jira:
- Extract:
 - User impact description
 - Current status
- Identify:
 - Primary root cause
 - Contributing root causes

app:github:
- Search:
 - Pull requests referencing ${jiraTicket}
- Extract:
 - Files changed
 - Impact of changes
 - Added validations or fixes
 - Merged or reverted status
 - Timestamps of PR activities

Based on the extracted infromation above, please provide:
1. Root Cause: A brief explanation of the underlying problem but be concise to what the text you're processing and don't assume too much. If the root cause is not obvious, provide your analysis but mention it's not obvious or conclusive. If the ticket is still open and there's no root cause yet, provide an update instead (1-2 sentences)
2. Impact on Users: Describe how this issue potentially affected users (1-2 sentences)
3. Fix or Resolution Implemented: Explain the solution that was applied. If unclear, provide your analysis but mention it's not obvious or conclusive. (1-2 sentences)
4. Relative discussions:
app:slack:
- Search:
 - Threads mentioning ${jiraTicket} in the past 60 days only in public channels
- Extract:
 - Engineer hypotheses
 - Mitigation steps taken
 - Open questions
 - Key decisions made
 - Ongoing debates
 - Timestamps of messages
If there's anything dicuscussed in slack, mention the channel name here and provide a summary of that thread based on what you've analyzed for slack already. (1-2 sentences)


Format your response using these exact headings:
Executive Summary: Current status or last update. Are there next steps to look at from product enhancement based on Impact on Users.
Root Cause:
Impact on Users:
Fix or Resolution Implemented: link Github PR if available only
Relative discussions: link slack thread if available
 `;

 const payload = {
   messages: [{
     author: "USER",
     messageType: "CONTENT",
     fragments: [{ text: prompt }]
   }],
   agentConfig: {
     agent: "DEFAULT",
     mode: "DEFAULT"
   }
 };

 const options = {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${apiKey}`
   },
   payload: JSON.stringify(payload)
 };

 try {
   const response = UrlFetchApp.fetch(apiUrl, options);
   const json = JSON.parse(response.getContentText());
   return formatSummary(extractFragments(json), jiraTicket);
 } catch (error) {
   Logger.log("Error: " + error);
   return "Error fetching summary.";
 }
}

function extractFragments(json) {
 return (json.messages || [])
   .flatMap(message => message.fragments || [])
   .map(fragment => fragment.text)
   .join('\n')
   .trim();
}

function formatSummary(rawText, jiraTicket) {
 // Phase 1: Remove API artifacts
 const phase1 = rawText
   .replace(new RegExp(`${jiraTicket} app:\".+\"`, 'g'), '') // Remove search patterns
   .replace(/(Search(ing| for)|Reading|Writing):.*/gi, '')
   .replace(/undefined/g, '')
   .replace(/\n{3,}/g, '\n\n');

 // Phase 2: Structure content
 const sections = phase1.split(/(?=## )/).map(section => {
   return section
     .replace(/^Based on.*?\n/, '') // Remove template phrases
     .replace(/(## \w+.*?)\n+/g, '$1\n') // Compact headers
     .replace(/(•|-) /g, '  • ') // Standardize list items
     .trim();
 });

 // Phase 3: Final assembly
 return `# Jira Ticket Analysis: ${jiraTicket}\n\n${
   sections.join('\n\n')
     .replace(/\n{3,}/g, '\n\n')
     .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
 }`;
}

// Security functions
function getApiKey() {
 return PropertiesService.getScriptProperties().getProperty('API_KEY');
}

// Sheets integration
function summarizeJira(ticketNumber) {
 return getGleanSummary(ticketNumber.replace(/^=/, ''));
} 