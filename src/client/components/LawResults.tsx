interface Source {
  type: string
  title: string
  preview: string
  content?: string
}

interface LawResultsProps {
  answer: string
  sources: Source[]
  timestamp: string
}

export default function LawResults({
  answer,
  sources,
  timestamp,
}: LawResultsProps) {
  const getSourceIcon = (type: string): string => {
    switch (type) {
      case 'law':
        return '📜'
      case 'precedent':
        return '⚖️'
      case 'interpretation':
        return '📋'
      default:
        return '📄'
    }
  }

  const getSourceColor = (type: string): string => {
    switch (type) {
      case 'law':
        return 'bg-blue-50 border-blue-200'
      case 'precedent':
        return 'bg-purple-50 border-purple-200'
      case 'interpretation':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getSourceTypeLabel = (type: string): string => {
    switch (type) {
      case 'law':
        return '법령'
      case 'precedent':
        return '판례'
      case 'interpretation':
        return '해석례'
      default:
        return '기타'
    }
  }

  return (
    <div className="space-y-6" data-testid="search-results">
      {/* AI Response */}
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI 답변</h2>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(timestamp).toLocaleString('ko-KR')}
            </p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="text-gray-800 whitespace-pre-line leading-relaxed">
            {answer}
          </div>
        </div>
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            검색된 출처 ({sources.length}개)
          </h3>
          <div className="space-y-3">
            {sources.map((source, index) => (
              <div
                key={index}
                className={`card border-l-4 ${getSourceColor(source.type)}`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">{getSourceIcon(source.type)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{source.title}</h4>
                    <p className="text-xs text-gray-500 capitalize">
                      {getSourceTypeLabel(source.type)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {source.preview}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
