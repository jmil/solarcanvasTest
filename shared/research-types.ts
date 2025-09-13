// Shared TypeScript interfaces for research citation network data

export interface AuthorData {
  firstName: string;
  lastName: string;
  fullName: string;
  citationCount: number;
}

export interface PaperData {
  pmid: string;
  doi: string;
  title: string;
  abstract: string;
  authors: AuthorData[];
  journal: string;
  year: number;
  citationCount: number;
}

export interface ResearcherData {
  name: string;
  papers: PaperData[];
  totalCitations: number;
  starIntensity: number; // 0-1, determines brightness of star
}

export interface RelatedPapersData {
  citing: string[]; // PMIDs of papers citing this one
  references: string[]; // PMIDs of papers this one references
  similar: string[]; // PMIDs of similar papers
}

export interface ResearchNetworkData {
  rootPaper: PaperData;
  researchers: ResearcherData[];
  publications: PaperData[];
  relatedPapers: RelatedPapersData;
}

// API request/response types
export interface DoiRequest {
  doi: string;
}

export interface DoiToPmidResponse {
  doi: string;
  pmid: string;
}

export interface ApiError {
  error: string;
}