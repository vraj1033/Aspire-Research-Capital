import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  /** Named in the console so a failure points at a section, not at React. */
  name: string
  children: ReactNode
  /** Rendered in place of the section when it throws. Defaults to nothing. */
  fallback?: ReactNode
  onError?: (error: Error) => void
}

type State = { failed: boolean }

/**
 * Keeps one section's runtime error from taking the whole page down.
 *
 * A demo that blanks entirely because a third-party image URL changed shape,
 * or a browser lacks an API a decorative effect assumed, is worse than a demo
 * missing one section. Each section is wrapped in App.tsx; the failure is
 * logged with the section name so it can be found.
 */
export class SectionBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.name}] section failed to render`, error, info.componentStack)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
