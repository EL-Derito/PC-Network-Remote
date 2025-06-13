import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, CheckCircle, Keyboard, Maximize, X } from "lucide-react";
import type { Computer } from "@shared/schema";

interface RemoteAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  computer: Computer | null;
}

export default function RemoteAccessModal({ isOpen, onClose, computer }: RemoteAccessModalProps) {
  const [connectionTime, setConnectionTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && computer) {
      // Simulate connection establishment
      setTimeout(() => {
        setIsConnected(true);
      }, 1000);
      
      // Start connection timer
      interval = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOpen, computer]);

  useEffect(() => {
    if (!isOpen) {
      setConnectionTime(0);
      setIsConnected(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendCtrlAltDel = () => {
    // Mock implementation - in real app this would send the key combination
    console.log("Sending Ctrl+Alt+Del to remote computer");
  };

  const handleToggleFullscreen = () => {
    // Mock implementation - in real app this would toggle fullscreen mode
    console.log("Toggling fullscreen mode");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionTime(0);
    onClose();
  };

  if (!computer) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DialogTitle className="text-lg font-medium text-gray-900">
                Remote Access - {computer.name}
              </DialogTitle>
              <span className="ml-2 text-gray-600">({computer.ipAddress})</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Connection Status */}
        <div className={`mb-4 p-3 rounded-md border ${
          isConnected 
            ? "bg-green-50 border-green-200" 
            : "bg-yellow-50 border-yellow-200"
        }`}>
          <div className="flex items-center">
            <CheckCircle className={`mr-2 h-4 w-4 ${
              isConnected ? "text-green-600" : "text-yellow-600"
            }`} />
            <span className={`text-sm font-medium ${
              isConnected ? "text-green-800" : "text-yellow-800"
            }`}>
              {isConnected ? "Connected to remote computer" : "Establishing connection..."}
            </span>
            {isConnected && (
              <span className="ml-auto text-xs text-gray-500">
                Connection time: {formatTime(connectionTime)}
              </span>
            )}
          </div>
        </div>

        {/* Remote Desktop Viewer */}
        <div className="border border-gray-300 rounded-lg bg-gray-900 relative flex-1 min-h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Monitor className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg mb-2">Remote Desktop Viewer</p>
              <p className="text-sm opacity-75">
                {isConnected 
                  ? "VNC connection would be displayed here" 
                  : "Connecting to remote computer..."
                }
              </p>
              <p className="text-xs opacity-50 mt-4">
                Implementation: Integrate noVNC or similar library
              </p>
              {isConnected && (
                <div className="mt-4 space-y-2">
                  <Badge variant="secondary" className="bg-gray-800 text-white">
                    Resolution: 1920x1080
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-800 text-white ml-2">
                    Color Depth: 32-bit
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          {/* Control Bar */}
          {isConnected && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendCtrlAltDel}
                    className="text-white hover:bg-white hover:bg-opacity-20 text-xs"
                  >
                    <Keyboard className="h-3 w-3 mr-1" />
                    Ctrl+Alt+Del
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFullscreen}
                    className="text-white hover:bg-white hover:bg-opacity-20 text-xs"
                  >
                    <Maximize className="h-3 w-3 mr-1" />
                    Fullscreen
                  </Button>
                </div>
                <div className="text-white text-xs space-x-4">
                  <span>Quality: <span className="text-green-400">High</span></span>
                  <span>Latency: <span className="text-green-400">15ms</span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600 flex items-center">
            <span className="text-blue-600 mr-1">ℹ</span>
            Use Ctrl+Alt+Shift to release cursor from remote session
          </div>
          <Button
            onClick={handleDisconnect}
            variant="destructive"
            size="sm"
          >
            <X className="h-4 w-4 mr-1" />
            Disconnect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
