import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, BarChart3, ImageIcon, Menu, X } from "lucide-react";

interface NavbarProps {
  onEditTimeline: () => void;
  isEditingTimeline: boolean;
  onWallpaperChange: (imageUrl: string) => void;
}

const Navbar = ({ onEditTimeline, isEditingTimeline, onWallpaperChange }: NavbarProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedWallpaper = localStorage.getItem("wallpaper");
    if (savedWallpaper) {
      setBackgroundImage(savedWallpaper);
      onWallpaperChange(savedWallpaper);
    }
  }, [onWallpaperChange]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImage(result);
        localStorage.setItem("wallpaper", result);
        onWallpaperChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
    setIsMenuOpen(false);
  };

  const handleEditTimeline = () => {
    onEditTimeline();
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary animate-pulse" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              ProductivityFlow
            </h1>
          </div>
          
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              onClick={openFileDialog}
              variant="outline"
              className="transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Wallpaper
            </Button>
            
            <Button
              onClick={onEditTimeline}
              variant={isEditingTimeline ? "destructive" : "default"}
              className="transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditingTimeline ? "Save Timeline" : "Edit Timeline"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="outline"
              size="sm"
              className={`transition-all duration-500 ease-in-out hover:scale-110 active:scale-95 ${
                isMenuOpen ? 'rotate-180 bg-primary text-primary-foreground' : ''
              }`}
            >
              <div className={`transition-all duration-500 ${isMenuOpen ? 'rotate-180' : ''}`}>
                {isMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu with Animation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
        }`}>
          <div className="border-t border-border pt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <Button
                onClick={openFileDialog}
                variant="outline"
                className="w-full justify-start transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95 transform"
                style={{ animationDelay: '0.1s' }}
              >
                <ImageIcon className="h-4 w-4 mr-2 animate-bounce" />
                Wallpaper
              </Button>
              
              <Button
                onClick={handleEditTimeline}
                variant={isEditingTimeline ? "destructive" : "default"}
                className="w-full justify-start transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95 transform"
                style={{ animationDelay: '0.2s' }}
              >
                <Edit3 className="h-4 w-4 mr-2 animate-pulse" />
                {isEditingTimeline ? "Save Timeline" : "Edit Timeline"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </nav>
  );
};

export default Navbar;