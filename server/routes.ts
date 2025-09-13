import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Import PubMed service
  const { PubMedService } = await import('./pubmed');

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Fetch research network data from DOI
  app.post('/api/research-network', async (req, res) => {
    try {
      const { doi } = req.body;
      
      if (!doi) {
        return res.status(400).json({ error: 'DOI is required' });
      }

      console.log('Fetching research network for DOI:', doi);
      const networkData = await PubMedService.getResearchNetworkFromDoi(doi);
      
      if (!networkData) {
        return res.status(404).json({ error: 'Could not fetch research data for this DOI' });
      }

      res.json(networkData);
    } catch (error) {
      console.error('Error fetching research network:', error);
      res.status(500).json({ error: 'Internal server error while fetching research data' });
    }
  });

  // Convert DOI to PMID (utility endpoint)
  app.post('/api/doi-to-pmid', async (req, res) => {
    try {
      const { doi } = req.body;
      
      if (!doi) {
        return res.status(400).json({ error: 'DOI is required' });
      }

      const pmid = await PubMedService.doiToPmid(doi);
      
      if (!pmid) {
        return res.status(404).json({ error: 'Could not find PMID for this DOI' });
      }

      res.json({ doi, pmid });
    } catch (error) {
      console.error('Error converting DOI to PMID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
