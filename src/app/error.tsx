'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log all application errors in console.error
    console.error('Application error caught by root error boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-4">
      <div className="bg-destructive/10 text-destructive p-3 rounded-full">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold font-headline">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <Button onClick={() => reset()} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
