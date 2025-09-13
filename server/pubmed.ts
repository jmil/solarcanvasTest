// Using built-in fetch in Node.js 18+

// PubMed API service for fetching research citation data
export class PubMedService {
  private static readonly BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
  private static readonly ID_CONVERTER_URL = 'https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/';
  
  // Rate limiting: 3 requests/second without API key
  private static lastRequestTime = 0;
  private static readonly RATE_LIMIT_MS = 334; // ~3 requests per second

  private static async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.RATE_LIMIT_MS) {
      await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_MS - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  // Convert DOI to PMID
  static async doiToPmid(doi: string): Promise<string | null> {
    await this.rateLimit();
    
    try {
      const url = new URL('esearch.fcgi', this.BASE_URL);
      url.searchParams.set('db', 'pubmed');
      url.searchParams.set('term', doi);
      url.searchParams.set('retmode', 'json');
      url.searchParams.set('retmax', '1');
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.esearchresult?.idlist?.length > 0) {
        return data.esearchresult.idlist[0];
      }
      return null;
    } catch (error) {
      console.error('Error converting DOI to PMID:', error);
      return null;
    }
  }

  // Fetch paper metadata by PMID
  static async getPaperMetadata(pmid: string): Promise<PaperData | null> {
    await this.rateLimit();
    
    try {
      const url = new URL('efetch.fcgi', this.BASE_URL);
      url.searchParams.set('db', 'pubmed');
      url.searchParams.set('id', pmid);
      url.searchParams.set('retmode', 'xml');
      
      const response = await fetch(url);
      const xml = await response.text();
      
      return this.parseXmlToPaperData(xml, pmid);
    } catch (error) {
      console.error('Error fetching paper metadata:', error);
      return null;
    }
  }

  // Get related papers (citing papers, references, similar papers)
  static async getRelatedPapers(pmid: string): Promise<RelatedPapersData> {
    await this.rateLimit();
    
    try {
      const url = new URL('elink.fcgi', this.BASE_URL);
      url.searchParams.set('dbfrom', 'pubmed');
      url.searchParams.set('db', 'pubmed');
      url.searchParams.set('id', pmid);
      url.searchParams.set('retmode', 'json');
      url.searchParams.set('linkname', 'pubmed_pubmed_citedin,pubmed_pubmed_refs,pubmed_pubmed');
      
      const response = await fetch(url);
      const data = await response.json();
      
      return this.parseRelatedPapers(data);
    } catch (error) {
      console.error('Error fetching related papers:', error);
      return { citing: [], references: [], similar: [] };
    }
  }

  // Parse XML response to extract paper data
  private static parseXmlToPaperData(xml: string, pmid: string): PaperData | null {
    try {
      // Simple XML parsing for key fields
      const titleMatch = xml.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
      const abstractMatch = xml.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/);
      const doiMatch = xml.match(/<ArticleId IdType="doi">(.*?)<\/ArticleId>/);
      const yearMatch = xml.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/);
      
      // Extract authors
      const authorRegex = /<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/g;
      const authors: AuthorData[] = [];
      let authorMatch;
      while ((authorMatch = authorRegex.exec(xml)) !== null) {
        authors.push({
          lastName: authorMatch[1],
          firstName: authorMatch[2],
          fullName: `${authorMatch[2]} ${authorMatch[1]}`,
          citationCount: Math.floor(Math.random() * 1000), // Placeholder - real citation data would need additional API calls
        });
      }
      
      // Extract journal info
      const journalMatch = xml.match(/<Title>(.*?)<\/Title>/);
      const journal = journalMatch ? journalMatch[1] : 'Unknown Journal';
      
      return {
        pmid,
        doi: doiMatch ? doiMatch[1] : '',
        title: titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : 'Unknown Title',
        abstract: abstractMatch ? abstractMatch[1].replace(/<[^>]*>/g, '') : '',
        authors,
        journal,
        year: yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear(),
        citationCount: Math.floor(Math.random() * 50), // Placeholder
      };
    } catch (error) {
      console.error('Error parsing XML:', error);
      return null;
    }
  }

  // Parse related papers response
  private static parseRelatedPapers(data: any): RelatedPapersData {
    const result: RelatedPapersData = { citing: [], references: [], similar: [] };
    
    if (data.linksets && data.linksets.length > 0) {
      for (const linkset of data.linksets) {
        if (linkset.linksetdbs) {
          for (const linksetdb of linkset.linksetdbs) {
            const pmids = linksetdb.links || [];
            
            switch (linksetdb.linkname) {
              case 'pubmed_pubmed_citedin':
                result.citing = pmids.slice(0, 20); // Limit to 20 for performance
                break;
              case 'pubmed_pubmed_refs':
                result.references = pmids.slice(0, 20);
                break;
              case 'pubmed_pubmed':
                result.similar = pmids.slice(0, 10);
                break;
            }
          }
        }
      }
    }
    
    return result;
  }

  // Main method to get complete research network data from DOI
  static async getResearchNetworkFromDoi(doi: string): Promise<ResearchNetworkData | null> {
    try {
      // Step 1: Convert DOI to PMID
      const rootPmid = await this.doiToPmid(doi);
      if (!rootPmid) {
        console.error('Could not find PMID for DOI:', doi);
        return null;
      }

      // Step 2: Get root paper data
      const rootPaper = await this.getPaperMetadata(rootPmid);
      if (!rootPaper) {
        console.error('Could not fetch root paper data');
        return null;
      }

      // Step 3: Get related papers
      const relatedPapers = await this.getRelatedPapers(rootPmid);

      // Step 4: Fetch metadata for a subset of related papers (to avoid rate limits)
      const allRelatedPmids = [
        ...relatedPapers.citing.slice(0, 5),
        ...relatedPapers.references.slice(0, 5),
        ...relatedPapers.similar.slice(0, 3)
      ];

      const relatedPaperData: PaperData[] = [];
      for (const pmid of allRelatedPmids) {
        const paperData = await this.getPaperMetadata(pmid);
        if (paperData) {
          relatedPaperData.push(paperData);
        }
      }

      // Step 5: Build researcher network from author data
      const researcherMap = new Map<string, ResearcherData>();
      
      // Process root paper authors
      rootPaper.authors.forEach(author => {
        researcherMap.set(author.fullName, {
          name: author.fullName,
          papers: [rootPaper],
          totalCitations: author.citationCount,
          starIntensity: Math.min(author.citationCount / 100, 1), // Normalize to 0-1
        });
      });

      // Process related paper authors
      relatedPaperData.forEach(paper => {
        paper.authors.forEach(author => {
          if (researcherMap.has(author.fullName)) {
            const researcher = researcherMap.get(author.fullName)!;
            researcher.papers.push(paper);
            researcher.totalCitations += author.citationCount;
            researcher.starIntensity = Math.min(researcher.totalCitations / 100, 1);
          } else {
            researcherMap.set(author.fullName, {
              name: author.fullName,
              papers: [paper],
              totalCitations: author.citationCount,
              starIntensity: Math.min(author.citationCount / 100, 1),
            });
          }
        });
      });

      return {
        rootPaper,
        researchers: Array.from(researcherMap.values()),
        publications: [rootPaper, ...relatedPaperData],
        relatedPapers,
      };

    } catch (error) {
      console.error('Error building research network:', error);
      return null;
    }
  }
}

// Data type definitions
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