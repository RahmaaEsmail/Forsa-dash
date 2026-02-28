import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { InputGroup } from '../../ui/input-group'
import CustomInput from '../../shared/CustomInput'
import { useForm } from 'react-hook-form'
import useCreateUnit from '../../../hooks/units/useAddUnit'

export default function AddUnitModal({ open, setOpen }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: {

        code: "",
        name: {
          en: "",
          ar: ""
        },
        symbol: "",
        is_active: true
      }
    }
  });
  const {mutate : add_unit , isPending , is_adding_unit} = useCreateUnit()

  function handleAddUnit(values) {
    console.log('values', values);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleAddUnit)}>
<div className='grid gi'></div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="default"
              // onClick={onSuccess}
              type="submit"
            >
              {/* {isLoading ? "Loading...." : "Update Status"} */}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}
