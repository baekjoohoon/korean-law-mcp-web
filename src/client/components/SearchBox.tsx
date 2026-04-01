import { useState, FormEvent } from 'react'

interface SearchBoxProps {
  onSearch: (query: string) => void
  isLoading: boolean
  recentSearches: string[]
  onClearHistory: () => void
}

export default function SearchBox({
  onSearch,
  isLoading,
  recentSearches,
  onClearHistory,
}: SearchBoxProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery)
    onSearch(recentQuery)
  }

  return (
    <div className="card mb-6">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="search-query"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            법률 검색
          </label>
          <div className="flex gap-2">
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field flex-1"
              placeholder="예: 관세법 제 38 조, 근로기준법 제 74 조"
              disabled={isLoading}
              data-testid="search-input"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="btn-primary whitespace-nowrap"
              data-testid="search-button"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  검색 중...
                </>
              ) : (
                '검색'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">최근 검색어</h3>
            <button
              onClick={onClearHistory}
              className="text-xs text-gray-500 hover:text-gray-700"
              data-testid="clear-history-button"
            >
              전체 삭제
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentClick(search)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
                data-testid={`recent-search-${index}`}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
