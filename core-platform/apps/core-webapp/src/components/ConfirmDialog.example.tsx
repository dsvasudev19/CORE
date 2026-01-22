/**
 * ConfirmDialog Usage Examples
 * 
 * This file demonstrates how to use the reusable ConfirmDialog component
 * in different scenarios throughout the application.
 */

import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { useConfirmDialog } from '../hooks/useConfirmDialog';

// ============================================
// Example 1: Using the hook (Recommended)
// ============================================
export const ExampleWithHook = () => {
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmDialog();

    const handleDeleteUser = async (userId: number, userName: string) => {
        // Show confirmation dialog and wait for user response
        const confirmed = await confirm({
            title: 'Delete User',
            message: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger'
        });

        if (confirmed) {
            // User clicked "Delete"
            console.log('Deleting user:', userId);
            // Perform delete operation here
        } else {
            // User clicked "Cancel" or closed the dialog
            console.log('Delete cancelled');
        }
    };

    return (
        <div>
            <button onClick={() => handleDeleteUser(1, 'John Doe')}>
                Delete User
            </button>

            {/* Add the ConfirmDialog component */}
            <ConfirmDialog
                isOpen={isOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title={options.title}
                message={options.message}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                variant={options.variant}
            />
        </div>
    );
};

// ============================================
// Example 2: Direct component usage
// ============================================
export const ExampleDirectUsage = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleConfirm = () => {
        console.log('Action confirmed');
        // Perform your action here
        setIsDialogOpen(false);
    };

    return (
        <div>
            <button onClick={() => setIsDialogOpen(true)}>
                Show Confirmation
            </button>

            <ConfirmDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirm}
                title="Confirm Action"
                message="Are you sure you want to proceed?"
                confirmText="Yes, Continue"
                cancelText="No, Cancel"
                variant="danger"
            />
        </div>
    );
};

// ============================================
// Example 3: Different variants
// ============================================
export const ExampleVariants = () => {
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmDialog();

    const showDangerDialog = async () => {
        const confirmed = await confirm({
            title: 'Delete Item',
            message: 'This will permanently delete the item.',
            variant: 'danger'
        });
        console.log('Danger dialog result:', confirmed);
    };

    const showWarningDialog = async () => {
        const confirmed = await confirm({
            title: 'Warning',
            message: 'This action may have unintended consequences.',
            variant: 'warning'
        });
        console.log('Warning dialog result:', confirmed);
    };

    const showInfoDialog = async () => {
        const confirmed = await confirm({
            title: 'Confirm Changes',
            message: 'Do you want to save these changes?',
            variant: 'info',
            confirmText: 'Save',
            cancelText: 'Discard'
        });
        console.log('Info dialog result:', confirmed);
    };

    return (
        <div className="space-x-2">
            <button onClick={showDangerDialog}>Danger</button>
            <button onClick={showWarningDialog}>Warning</button>
            <button onClick={showInfoDialog}>Info</button>

            <ConfirmDialog
                isOpen={isOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                {...options}
            />
        </div>
    );
};

// ============================================
// Example 4: With loading state
// ============================================
export const ExampleWithLoading = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        setIsDialogOpen(false);
        console.log('Action completed');
    };

    return (
        <div>
            <button onClick={() => setIsDialogOpen(true)}>
                Delete with Loading
            </button>

            <ConfirmDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirm}
                title="Delete Item"
                message="This will take a moment to complete."
                isLoading={isLoading}
                variant="danger"
            />
        </div>
    );
};

// ============================================
// Example 5: Real-world usage in a list
// ============================================
export const ExampleInList = () => {
    const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirmDialog();
    const [items, setItems] = useState([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
    ]);

    const handleDelete = async (id: number, name: string) => {
        const confirmed = await confirm({
            title: 'Delete Item',
            message: `Are you sure you want to delete "${name}"?`,
            confirmText: 'Delete',
            variant: 'danger'
        });

        if (confirmed) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    return (
        <div>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.name}
                        <button onClick={() => handleDelete(item.id, item.name)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <ConfirmDialog
                isOpen={isOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                {...options}
            />
        </div>
    );
};
