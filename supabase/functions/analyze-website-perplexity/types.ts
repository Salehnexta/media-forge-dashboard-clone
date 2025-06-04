
export interface CompanyData {
  name: string;
  description: string;
  industry: string;
  founded: string;
  location: string;
  size: string;
  website: string;
  services: string[];
  targetAudience: string;
}

export interface Competitor {
  name: string;
  website: string;
  strengths: string[];
}

export interface MarketAnalysis {
  marketSize: string;
  growthRate: string;
  trends: string[];
  opportunities: string[];
  challenges: string[];
  predictions: string[];
}

export interface DigitalPresence {
  socialMedia: string[];
  seoKeywords: string[];
  contentStrategy: string[];
  digitalChannels: string[];
}

export interface AnalysisResults {
  companyInfo?: CompanyData;
  competitors?: { competitors: Competitor[] };
  marketAnalysis?: MarketAnalysis;
  digitalPresence?: DigitalPresence;
}
