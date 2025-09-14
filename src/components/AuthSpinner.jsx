import { LoaderCircle } from 'lucide-react';

export default function AuthSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
