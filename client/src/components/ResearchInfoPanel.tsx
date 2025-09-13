import type { ResearcherData, PaperData } from "../../../shared/research-types";

interface ResearchInfoPanelProps {
  researcher?: ResearcherData | null;
  publication?: PaperData | null;
  onClose: () => void;
}

export function ResearchInfoPanel({ researcher, publication, onClose }: ResearchInfoPanelProps) {
  if (!researcher && !publication) return null;

  const isResearcher = !!researcher;

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-95 text-white p-6 rounded-lg max-w-md max-h-96 overflow-y-auto border border-purple-500">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">
            {isResearcher ? "⭐" : "🪐"}
          </span>
          <h2 className="text-xl font-bold">
            {isResearcher ? "Researcher" : "Publication"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
      </div>
      
      {isResearcher && researcher && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">
              {researcher.name}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-300">Publications:</span>
              <p className="font-semibold text-yellow-200">{researcher.papers.length}</p>
            </div>
            <div>
              <span className="text-gray-300">Total Citations:</span>
              <p className="font-semibold text-yellow-200">{researcher.totalCitations}</p>
            </div>
            <div>
              <span className="text-gray-300">Star Intensity:</span>
              <p className="font-semibold text-yellow-200">
                {(researcher.starIntensity * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <span className="text-gray-300">Impact Level:</span>
              <p className="font-semibold text-yellow-200">
                {researcher.totalCitations > 500 ? 'High' : 
                 researcher.totalCitations > 100 ? 'Medium' : 'Emerging'}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <span className="text-gray-300">Recent Publications:</span>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {researcher.papers.slice(0, 5).map((paper) => (
                <div key={paper.pmid} className="text-sm bg-gray-800 p-2 rounded">
                  <p className="font-medium text-purple-300 line-clamp-2">
                    {paper.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {paper.journal} ({paper.year}) • {paper.citationCount} citations
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {!isResearcher && publication && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2 line-clamp-3">
              {publication.title}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-300">Year:</span>
              <p className="font-semibold text-purple-200">{publication.year}</p>
            </div>
            <div>
              <span className="text-gray-300">Citations:</span>
              <p className="font-semibold text-purple-200">{publication.citationCount}</p>
            </div>
            <div>
              <span className="text-gray-300">Authors:</span>
              <p className="font-semibold text-purple-200">{publication.authors.length}</p>
            </div>
            <div>
              <span className="text-gray-300">PMID:</span>
              <p className="font-semibold text-purple-200">{publication.pmid}</p>
            </div>
          </div>
          
          <div>
            <span className="text-gray-300">Journal:</span>
            <p className="font-semibold text-purple-200 mt-1">{publication.journal}</p>
          </div>
          
          <div>
            <span className="text-gray-300">DOI:</span>
            <p className="font-semibold text-purple-200 mt-1 text-xs break-all">
              {publication.doi}
            </p>
          </div>
          
          <div>
            <span className="text-gray-300">Authors:</span>
            <div className="mt-2 max-h-24 overflow-y-auto">
              <p className="text-sm text-purple-200">
                {publication.authors.map(author => author.fullName).join(', ')}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <span className="text-gray-300">Abstract:</span>
            <p className="mt-1 text-sm text-gray-200 leading-relaxed max-h-32 overflow-y-auto">
              {publication.abstract || 'No abstract available.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}