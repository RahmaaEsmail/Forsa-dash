import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { handleUpdateDeliveryNotes, handleUploadDeliveryNoteAttachment, handleDeleteDeliveryNoteAttachment } from '../../services/deliveryNotes';
import { toast } from 'sonner';

export default function useEditDeliveryNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body , id}) => handleUpdateDeliveryNotes({ body , id}),
    onSuccess: (res) => {
      if (res?.data?.success || res?.success) {
        toast.success(res?.data?.meta?.message || res?.meta?.message);
        queryClient.invalidateQueries({
          queryKey: ["delivery-notes"],
          exact: false
        })
      }
    },
    onError: (res) => {
      toast.error(res?.response?.data?.error?.message);
    }

  })
}

export function useUploadDeliveryNoteAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => handleUploadDeliveryNoteAttachment({ id, body }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Attachment uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["delivery-note", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["delivery-notes"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to upload attachment");
    }
  });
}

export function useDeleteDeliveryNoteAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, documentId }) => handleDeleteDeliveryNoteAttachment({ id, documentId }),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Attachment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["delivery-note", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["delivery-notes"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.response?.data?.error?.message || "Failed to delete attachment");
    }
  });
}
