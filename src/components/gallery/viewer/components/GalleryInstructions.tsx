import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const GalleryInstructions = () => {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        Click an artwork to select it. Then:
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Click and drag to move artwork</li>
          <li>Hold Shift + drag to rotate</li>
          <li>Hold Alt + drag to move in/out</li>
          <li>Hold T + drag up/down to resize</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};