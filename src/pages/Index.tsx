import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DailyTimeline from "@/components/DailyTimeline";
import TodoList from "@/components/TodoList";
import WorkoutTracker from "@/components/WorkoutTracker";

const Index = () => {
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    const savedWallpaper = localStorage.getItem("wallpaper");
    if (savedWallpaper) {
      setBackgroundImage(savedWallpaper);
    }
  }, []);

  const handleEditTimeline = () => {
    setIsEditingTimeline(!isEditingTimeline);
  };

  const handleWallpaperChange = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--background)), hsl(var(--card)))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      
      <div className="relative z-10">
        <Navbar 
          onEditTimeline={handleEditTimeline} 
          isEditingTimeline={isEditingTimeline}
          onWallpaperChange={handleWallpaperChange}
        />
        
        <main className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6 sm:space-y-8">
              {/* Daily Routine Section */}
              <DailyTimeline isEditing={isEditingTimeline} />
              
              {/* To-Do List Section */}
              <TodoList />
              
              {/* Workout Tracker Section */}
              <WorkoutTracker />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
