import { useEffect, useState } from "react";
import { Ship, Clock, Settings, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import VisshLogo from "@/components/ui/vissh-logo";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-maritime-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <VisshLogo size="lg" className="mr-3" />
            <h1 className="text-xl font-bold">I-FPM</h1>
            <span className="ml-2 text-sm opacity-80">Intelligent Fuel Performance Monitoring</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Signal className="h-4 w-4 text-success-green" />
              <span className="text-sm">Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {currentTime.toLocaleTimeString("en-US", { 
                  timeZone: "UTC", 
                  hour12: false 
                })} UTC
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
