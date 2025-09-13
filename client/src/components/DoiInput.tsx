import { useState } from "react";

interface DoiInputProps {
  onSubmit: (doi: string) => void;
  isLoading?: boolean;
}

export function DoiInput({ onSubmit, isLoading = false }: DoiInputProps) {
  const [doi, setDoi] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic DOI validation
    const doiPattern = /^10\.\d{4,9}\/[-._;()\/:A-Za-z0-9]+$/;
    if (!doi.trim()) {
      setError('Please enter a DOI');
      return;
    }
    
    if (!doiPattern.test(doi.trim())) {
      setError('Please enter a valid DOI (e.g., 10.1038/nature12373)');
      return;
    }
    
    setError(null);
    onSubmit(doi.trim());
  };

  const exampleDois = [
    '10.1038/nature12373',
    '10.1126/science.1260419',
    '10.1016/j.cell.2018.01.029'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-black bg-opacity-80 rounded-lg border border-purple-500">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        🌌 Research Citation Galaxy Explorer
      </h2>
      
      <p className="text-gray-300 text-center mb-6">
        Enter a research paper's DOI to explore its citation network as an interactive galaxy
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="doi" className="block text-white font-medium mb-2">
            DOI (Digital Object Identifier)
          </label>
          <input
            id="doi"
            type="text"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="e.g., 10.1038/nature12373"
            className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Fetching Research Network...
            </div>
          ) : (
            'Explore Citation Galaxy'
          )}
        </button>
      </form>
      
      <div className="mt-6">
        <p className="text-gray-400 text-sm mb-3">Try these example DOIs:</p>
        <div className="space-y-2">
          {exampleDois.map((exampleDoi) => (
            <button
              key={exampleDoi}
              onClick={() => setDoi(exampleDoi)}
              className="block w-full text-left px-3 py-2 text-purple-300 hover:text-purple-100 hover:bg-purple-900 hover:bg-opacity-30 rounded transition-colors text-sm"
              disabled={isLoading}
            >
              {exampleDoi}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>
          ⭐ Researchers appear as golden stars (brightness = citation count)
        </p>
        <p>
          🪐 Publications appear as purple planets (size = impact)
        </p>
      </div>
    </div>
  );
}