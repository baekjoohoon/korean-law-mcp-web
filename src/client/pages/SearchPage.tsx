import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import SearchBox from '../components/SearchBox'
import LawResults from '../components/LawResults'
import LoadingSpinner from '../components/LoadingSpinner'
import { useLawSearch } from '../hooks/useLawSearch'

export default function SearchPage() {
  const { logout } = useAuth()
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem('recent_searches')
    return stored ? JSON.parse(stored) : []
  })

  const { search, isLoading, error, result, clearError } = useLawSearch()

  const handleSearch = async (query: string) => {
    clearError()
    await search(query)

    // Update recent searches
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 10)
      localStorage.setItem('recent_searches', JSON.stringify(updated))
      return updated
    })
  }

  const handleClearHistory = () => {
    setRecentSearches([])
    localStorage.removeItem('recent_searches')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">법률 검색 - 서우넷</h1>
            <p className="text-xs text-gray-500 mt-1">AI 기반 대한민국 법령 검색</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
            data-testid="logout-button"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Box */}
        <SearchBox
          onSearch={handleSearch}
          isLoading={isLoading}
          recentSearches={recentSearches}
          onClearHistory={handleClearHistory}
        />

        {/* Error State */}
        {error && (
          <div className="card bg-red-50 border border-red-200 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">❌</span>
              <div>
                <h3 className="font-medium text-red-900">검색 오류</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Results */}
        {result && !isLoading && (
          <LawResults
            answer={result.answer}
            sources={result.sources}
            timestamp={result.timestamp}
          />
        )}

        {/* Empty State */}
        {!result && !isLoading && !error && (
          <div className="card text-center py-12">
            <span className="text-4xl mb-4 block">⚖️</span>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              법률 검색을 시작하세요
            </h2>
            <p className="text-gray-600">
              검색어를 입력하면 AI 가 법령, 판례, 해석례를 찾아드립니다
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                예: 관세법 제 38 조
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                예: 근로기준법 제 74 조
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                예: 부당해고 판례
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="text-xs text-gray-500 text-center">
            본 시스템은 AI 가 생성한 법률 정보를 제공하며, 법적 조언이 아닙니다.
          </p>
          <p className="text-xs text-gray-500 text-center mt-2">
            정확한 법적 조언은 변호사 등 전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </footer>
    </div>
  )
}
