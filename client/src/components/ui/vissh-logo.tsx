import { cn } from "@/lib/utils";
import visshLogoImg from "@assets/png_1752382698223.png";

interface VisshLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function VisshLogo({ className, size = "md" }: VisshLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <img
      src={visshLogoImg}
      alt="VISSH Logo"
      className={cn("object-contain", sizeClasses[size], className)}
    />
  );
}

export default VisshLogo;