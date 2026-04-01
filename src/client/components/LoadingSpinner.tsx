interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({
  message = '검색 중...',
}: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12"
      data-testid="loading"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      <p className="mt-2 text-sm text-gray-500">
        법령, 판례, 해석례를 검색하고 있습니다
      </p>
    </div>
  )
}
