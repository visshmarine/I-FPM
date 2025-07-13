import { cn } from "@/lib/utils";

interface VisshLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function VisshLogo({ className, size = "md" }: VisshLogoProps) {
  const sizeClasses = {
    sm: "h-4 w-8",
    md: "h-6 w-12", 
    lg: "h-8 w-16",
    xl: "h-12 w-24"
  };

  return (
    <div className={cn("flex items-center", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 200 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* V Letter */}
        <path
          d="M20 15 L45 75 L70 15"
          stroke="#22C55E"
          strokeWidth="8"
          fill="#22C55E"
          strokeLinejoin="round"
        />
        
        {/* Leaf design */}
        <path
          d="M75 20 Q85 10 95 15 Q105 20 110 35 Q105 50 95 55 Q85 60 75 50 Q80 35 75 20 Z"
          fill="#22C55E"
        />
        
        {/* Leaf vein */}
        <path
          d="M80 25 Q90 30 100 45"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        
        {/* ISSH Text */}
        <text
          x="115"
          y="55"
          fontFamily="Arial, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="#22C55E"
        >
          ISSH
        </text>
      </svg>
    </div>
  );
}

export default VisshLogo;