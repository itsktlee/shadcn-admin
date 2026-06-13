import { ResourcesDeleteDialog } from './resources-delete-dialog'
import { ResourcesMutateDrawer } from './resources-mutate-drawer'
import { useResources } from './resources-provider'

export function ResourcesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useResources()

  return (
    <>
      <ResourcesMutateDrawer
        key='resource-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ResourcesMutateDrawer
            key={`resource-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ResourcesDeleteDialog
            key={`resource-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 300)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
