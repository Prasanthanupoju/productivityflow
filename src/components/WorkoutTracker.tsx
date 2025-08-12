import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Dumbbell, Download } from "lucide-react";
import jsPDF from "jspdf";

interface WorkoutEntry {
  id: string;
  date: string;
  day: string;
  split: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  createdAt: Date;
}

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    split: "",
    exercise: "",
    sets: "",
    reps: "",
    weight: ""
  });

  useEffect(() => {
    const savedWorkouts = localStorage.getItem("workouts");
    if (savedWorkouts) {
      const parsedWorkouts = JSON.parse(savedWorkouts).map((workout: any) => ({
        ...workout,
        createdAt: new Date(workout.createdAt)
      }));
      setWorkouts(parsedWorkouts);
      checkForAutoExport(parsedWorkouts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const checkForAutoExport = (workoutList: WorkoutEntry[]) => {
    if (workoutList.length === 0) return;
    
    const oldestWorkout = workoutList.reduce((oldest, workout) => 
      workout.createdAt < oldest.createdAt ? workout : oldest
    );
    
    const daysDiff = Math.floor((Date.now() - oldestWorkout.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 10) {
      exportToPDF(workoutList);
      setWorkouts([]);
      localStorage.removeItem("workouts");
    }
  };

  const addWorkout = () => {
    if (Object.values(formData).every(value => value.trim())) {
      const newWorkout: WorkoutEntry = {
        id: Date.now().toString(),
        date: formData.date,
        day: formData.day,
        split: formData.split,
        exercise: formData.exercise,
        sets: parseInt(formData.sets),
        reps: parseInt(formData.reps),
        weight: parseFloat(formData.weight),
        createdAt: new Date()
      };
      setWorkouts(prev => [...prev, newWorkout]);
      setFormData({
        date: "",
        day: "",
        split: "",
        exercise: "",
        sets: "",
        reps: "",
        weight: ""
      });
    }
  };

  const exportToPDF = (workoutList: WorkoutEntry[]) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Workout Log Report", 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    let yPosition = 70;
    workoutList.forEach((workout) => {
      const text = `${workout.date} (${workout.day}) - ${workout.split}`;
      doc.text(text, 20, yPosition);
      yPosition += 8;
      
      const exerciseText = `${workout.exercise}: ${workout.sets} sets × ${workout.reps} reps @ ${workout.weight}kg`;
      doc.text(exerciseText, 25, yPosition);
      yPosition += 15;
      
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 30;
      }
    });
    
    doc.save(`workout-log-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="bg-gradient-card rounded-xl p-6 sm:p-8 border border-border shadow-lg overflow-hidden">
      {/* Header with responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Dumbbell className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Workout Tracker</h2>
        </div>
        <Button
          onClick={() => exportToPDF(workouts)}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto hover:shadow-glow transition-all duration-300"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Form Section */}
      <div className="space-y-4 mb-6">
        {/* First row - Date, Day, Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="Day (e.g., Monday)"
            value={formData.day}
            onChange={(e) => handleInputChange("day", e.target.value)}
            className="bg-input border-border"
          />
          <div className="sm:col-span-1 lg:col-span-1">
            <Select value={formData.split} onValueChange={(value) => handleInputChange("split", value)}>
              <SelectTrigger className="bg-input border-border w-full">
                <SelectValue placeholder="Split" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="pull">Pull</SelectItem>
                <SelectItem value="legs">Legs</SelectItem>
                <SelectItem value="upper">Upper</SelectItem>
                <SelectItem value="lower">Lower</SelectItem>
                <SelectItem value="full-body">Full Body</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Exercise Name"
            value={formData.exercise}
            onChange={(e) => handleInputChange("exercise", e.target.value)}
            className="bg-input border-border"
          />
        </div>
        
        {/* Second row - Sets, Reps, Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Input
            type="number"
            placeholder="Sets"
            value={formData.sets}
            onChange={(e) => handleInputChange("sets", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            type="number"
            placeholder="Reps"
            value={formData.reps}
            onChange={(e) => handleInputChange("reps", e.target.value)}
            className="bg-input border-border"
          />
          <Input
            type="number"
            step="0.5"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            className="bg-input border-border"
          />
        </div>
        
        <Button
          onClick={addWorkout}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Workout
        </Button>
      </div>

      {/* Workouts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {workouts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm sm:text-base">No workouts logged yet. Start tracking your progress!</p>
          </div>
        ) : (
          workouts.map((workout, index) => (
            <div
              key={workout.id}
              className="p-3 sm:p-4 bg-card-elevated rounded-lg border border-border hover:shadow-md transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-primary font-medium truncate">
                    {workout.date} • {workout.day}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {workout.split.toUpperCase()} DAY
                  </div>
                </div>
              </div>
              <div className="text-foreground font-semibold text-sm sm:text-base truncate">{workout.exercise}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
              </div>
            </div>
          ))
        )}
      </div>
      
      {workouts.length > 0 && (
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Auto-export to PDF after 10 days • {workouts.length} workout(s) logged
        </div>
      )}
    </section>
  );
};

export default WorkoutTracker;