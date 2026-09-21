import type { ElementType, ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  /** Wider measure for full-bleed editorial layouts. */
  wide?: boolean
}

/**
 * The page's single horizontal rhythm. Every section inherits its gutters from
 * here so nothing drifts out of alignment at any breakpoint.
 */
export function Container({ children, className = '', as: Tag = 'div', wide = false }: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${wide ? 'max-w-[1600px]' : 'max-w-[1380px]'} px-5 sm:px-8 lg:px-12 xl:px-16 ${className}`}
    >
      {children}
    </Tag>
  )
}
