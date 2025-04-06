import { ReactElement, ReactNode } from 'react';
import { ToastActionElement } from './toast';

declare module '@/components/ui/use-toast' {
    interface ToastProps {
        title?: ReactNode;
        description?: ReactNode;
        action?: ToastActionElement;
        variant?: 'default' | 'destructive' | 'success' | 'info';
    }

    function toast(props: ToastProps): {
        id: string;
        dismiss: () => void;
        update: (props: ToastProps) => void;
    };
} 