'use client';
import { useState } from 'react';
import { useTransition } from 'react';
// import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { toast } from 'sonner';

const DeleteDialog = ({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await action(id);

      if (!res.success) {
        toast.error(res.message, {
          style: {
            background: "rgb(239 68 68)",
            color: "white",
            fontWeight: "600",
          },
          position: "top-center"
      }) }
      else {
        setOpen(false);
        toast(res.message, {
            position: "top-center"
        });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size='sm' variant='destructive' className='ml-2'>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant='destructive'
            size='sm'
            disabled={isPending}
            onClick={handleDeleteClick}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;