import { useState } from 'react';
import type { ResearchNetworkData } from '../../../shared/research-types';

export function useResearchNetwork() {
  const [networkData, setNetworkData] = useState<ResearchNetworkData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResearchNetwork = async (doi: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/research-network', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doi }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch research network data');
      }
      
      const data: ResearchNetworkData = await response.json();
      setNetworkData(data);
      console.log('Research network data loaded:', data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching research network:', err);
      
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setNetworkData(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    networkData,
    isLoading,
    error,
    fetchResearchNetwork,
    reset
  };
}