import React, { useState } from 'react'
import type { Resource } from '@/contracts/resources'
import useDialogState from '@/hooks/use-dialog-state'

type ResourcesDialogType = 'create' | 'update' | 'delete'

type ResourcesContextType = {
  open: ResourcesDialogType | null
  setOpen: (value: ResourcesDialogType | null) => void
  currentRow: Resource | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Resource | null>>
}

const ResourcesContext = React.createContext<ResourcesContextType | null>(null)

export function ResourcesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ResourcesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Resource | null>(null)

  return (
    <ResourcesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ResourcesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useResources = () => {
  const resourcesContext = React.useContext(ResourcesContext)

  if (!resourcesContext) {
    throw new Error('useResources has to be used within <ResourcesContext>')
  }

  return resourcesContext
}
