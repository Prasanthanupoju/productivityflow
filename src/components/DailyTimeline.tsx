import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Dumbbell, GraduationCap, Code, Footprints, Moon } from "lucide-react";

interface TimelineItem {
  id: string;
  time: string;
  task: string;
  icon: string;
}

interface DailyTimelineProps {
  isEditing: boolean;
}

const iconMap = {
  gym: Dumbbell,
  college: GraduationCap,
  dev: Code,
  steps: Footprints,
  sleep: Moon,
  default: Clock,
};

const defaultTimeline: TimelineItem[] = [
  { id: "1", time: "5:00 AM", task: "Gym Session", icon: "gym" },
  { id: "2", time: "9:00 AM - 4:30 PM", task: "College", icon: "college" },
  { id: "3", time: "6:00 PM - 8:00 PM", task: "Web Development Study", icon: "dev" },
  { id: "4", time: "8:00 PM - 9:00 PM", task: "Evening Walk/Steps", icon: "steps" },
  { id: "5", time: "9:00 PM - 9:30 PM", task: "Sleep Preparation", icon: "sleep" },
];

const DailyTimeline = ({ isEditing }: DailyTimelineProps) => {
  const [timeline, setTimeline] = useState<TimelineItem[]>(defaultTimeline);

  useEffect(() => {
    const savedTimeline = localStorage.getItem("dailyTimeline");
    if (savedTimeline) {
      setTimeline(JSON.parse(savedTimeline));
    }
  }, []);

  useEffect(() => {
    if (!isEditing) {
      localStorage.setItem("dailyTimeline", JSON.stringify(timeline));
    }
  }, [timeline, isEditing]);

  const updateTimelineItem = (id: string, field: "time" | "task", value: string) => {
    setTimeline(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <section className="bg-gradient-card rounded-xl p-8 border border-border shadow-lg">
      <div className="flex items-center mb-6">
        <Clock className="h-6 w-6 text-primary mr-3" />
        <h2 className="text-2xl font-bold text-foreground">Daily Routine</h2>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-primary opacity-50" />
        
        <div className="space-y-6">
          {timeline.map((item, index) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || iconMap.default;
            
            return (
              <div
                key={item.id}
                className="relative flex items-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-timeline-pulse">
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                
                {/* Content */}
                <div className="ml-20 flex-1 bg-card-elevated rounded-lg p-4 border border-border hover:shadow-accent-glow transition-all duration-300">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={item.time}
                        onChange={(e) => updateTimelineItem(item.id, "time", e.target.value)}
                        className="bg-input border-border"
                        placeholder="Time"
                      />
                      <Input
                        value={item.task}
                        onChange={(e) => updateTimelineItem(item.id, "task", e.target.value)}
                        className="bg-input border-border"
                        placeholder="Task"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-medium text-primary mb-1">{item.time}</div>
                      <div className="text-foreground font-semibold">{item.task}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DailyTimeline;