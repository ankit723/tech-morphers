'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: {
    id: string;
    fullName: string;
    email: string;
    documentsCount?: number;
    estimatorsCount?: number;
  };
  onDelete: () => void;
}

export default function DeleteClientModal({ isOpen, onClose, client, onDelete }: DeleteClientModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/clients?id=${client.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Client "${client.fullName}" has been deleted successfully`,
          {
            description: `All associated data has been permanently removed.`,
            duration: 5000,
          }
        );
        onDelete();
        onClose();
      } else {
        toast.error('Failed to delete client', {
          description: data.error || 'An error occurred while deleting the client',
        });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client', {
        description: 'Network error occurred',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <DialogTitle className="text-red-600">Delete Client</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. All data associated with this client will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 dark:text-red-400 mb-2">Client to be deleted:</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {client.fullName}</p>
              <p><span className="font-medium">Email:</span> {client.email}</p>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">What will be deleted:</h4>
            <ul className="text-sm space-y-1 text-amber-700 dark:text-amber-300">
              <li>• Client account and login credentials</li>
              <li>• All associated documents and files</li>
              <li>• Payment records and transaction history</li>
              <li>• Project assignments and progress data</li>
              <li>• All estimator submissions</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 