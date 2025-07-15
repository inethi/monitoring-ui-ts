import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ButtonLoadingProps {
  disabled?: boolean;
}

const ButtonLoading = ({ disabled = false }: ButtonLoadingProps) => (
  <Button size="sm" disabled={disabled} className="w-full">
    <Loader2Icon className="animate-spin mr-2" />
    Please wait
  </Button>
);

export default ButtonLoading;
