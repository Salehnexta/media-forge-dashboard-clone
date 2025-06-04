
export const createPrompts = (website: string) => ({
  companyInfo: `Analyze the company that owns the website ${website}. Return ONLY a JSON object with this exact structure (no extra text, no markdown):
{
  "name": "Company full name in Arabic",
  "description": "Business activity description in Arabic", 
  "industry": "Industry/sector in Arabic",
  "founded": "Founding year",
  "location": "Main headquarters and country in Arabic",
  "size": "Approximate number of employees or company size in Arabic",
  "website": "${website}",
  "services": ["Main services in Arabic"],
  "targetAudience": "Target audience in Arabic"
}`,

  competitors: `Find the top 5 competitors of the company that owns ${website}. Return ONLY a JSON object (no extra text, no markdown):
{
  "competitors": [
    {
      "name": "Competitor company name in Arabic",
      "website": "Their website URL",
      "strengths": ["Their key strengths in Arabic"]
    }
  ]
}`,

  marketAnalysis: `Analyze the market and industry for the company that owns ${website}. Return ONLY a JSON object (no extra text, no markdown):
{
  "marketSize": "Market size in Arabic",
  "growthRate": "Annual growth rate in Arabic",
  "trends": ["Latest trends and developments in Arabic"],
  "opportunities": ["Available opportunities in Arabic"],
  "challenges": ["Main challenges in Arabic"],
  "predictions": ["Future predictions in Arabic"]
}`,

  digitalPresence: `Analyze the digital presence of the company that owns ${website}. Return ONLY a JSON object (no extra text, no markdown):
{
  "socialMedia": ["Social media accounts in Arabic"],
  "seoKeywords": ["Important SEO keywords in Arabic"],
  "contentStrategy": ["Suggested content strategy in Arabic"],
  "digitalChannels": ["Suitable digital channels in Arabic"]
}`
});
