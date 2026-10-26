import { Gift } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <Gift className="h-8 w-8 mr-4" />
        <h1 className="text-3xl font-bold font-headline">
          Santa's Little Helper
        </h1>
      </div>
    </header>
  );
}
