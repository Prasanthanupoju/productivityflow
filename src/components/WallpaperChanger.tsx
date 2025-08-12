import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

const WallpaperChanger = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedWallpaper = localStorage.getItem("wallpaper");
    if (savedWallpaper) {
      setBackgroundImage(savedWallpaper);
      document.body.style.backgroundImage = `url(${savedWallpaper})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImage(result);
        localStorage.setItem("wallpaper", result);
        
        // Apply to body background
        document.body.style.backgroundImage = `url(${result})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
      <Button
        onClick={openFileDialog}
        variant="outline"
        size="lg"
        className="bg-card/80 backdrop-blur-md border-border hover:shadow-glow transition-all duration-300 flex-col h-auto py-4 px-6"
      >
        <ImageIcon className="h-6 w-6 mb-2" />
        <span className="text-sm font-medium">Change Wallpaper</span>
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default WallpaperChanger;