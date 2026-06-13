import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  const linkClassName = (isActive: boolean) =>
    `text-sm font-medium transition-colors hover:text-primary ${isActive ? '' : 'text-muted-foreground'}`

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='outline'
            className={cn('md:size-7 lg:hidden', className)}
          >
            <Menu />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start'>
          {links.map(({ title, href, isActive, disabled }) => (
            <DropdownMenuItem key={`${title}-${href}`} asChild>
              <a
                href={disabled ? undefined : href}
                aria-disabled={disabled || undefined}
                className={cn(
                  !isActive && 'text-muted-foreground',
                  disabled && 'pointer-events-none opacity-50'
                )}
                onClick={(event) => {
                  if (disabled) {
                    event.preventDefault()
                  }
                }}
              >
                {title}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <nav
        className={cn(
          'hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <a
            key={`${title}-${href}`}
            href={disabled ? undefined : href}
            aria-disabled={disabled || undefined}
            className={cn(
              linkClassName(isActive),
              disabled && 'pointer-events-none opacity-50'
            )}
            onClick={(event) => {
              if (disabled) {
                event.preventDefault()
              }
            }}
          >
            {title}
          </a>
        ))}
      </nav>
    </>
  )
}
