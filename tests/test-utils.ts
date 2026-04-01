import { render, RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

// Custom render wrapper (add providers here later)
function AllTheProviders({ children }: { children: ReactNode }) {
  return null as unknown as ReactElement
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
export { customRender as render }
