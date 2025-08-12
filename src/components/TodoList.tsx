import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, CheckCircle, Clock, Download } from "lucide-react";
import jsPDF from "jspdf";

interface TodoItem {
  id: string;
  time: string;
  task: string;
  completed: boolean;
  createdAt: Date;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTime, setNewTime] = useState("");
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
      checkForAutoExport(parsedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const checkForAutoExport = (todoList: TodoItem[]) => {
    if (todoList.length === 0) return;
    
    const oldestTodo = todoList.reduce((oldest, todo) => 
      todo.createdAt < oldest.createdAt ? todo : oldest
    );
    
    const daysDiff = Math.floor((Date.now() - oldestTodo.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 10) {
      exportToPDF(todoList);
      setTodos([]);
      localStorage.removeItem("todos");
    }
  };

  const addTodo = () => {
    if (newTime.trim() && newTask.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        time: newTime,
        task: newTask,
        completed: false,
        createdAt: new Date()
      };
      setTodos(prev => [...prev, newTodo]);
      setNewTime("");
      setNewTask("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const exportToPDF = (todoList: TodoItem[]) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Todo List Report", 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 50);
    
    let yPosition = 70;
    todoList.forEach((todo, index) => {
      const status = todo.completed ? "✓" : "○";
      const text = `${status} ${todo.time} - ${todo.task}`;
      doc.text(text, 20, yPosition);
      yPosition += 10;
      
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 30;
      }
    });
    
    doc.save(`todo-list-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <section className="bg-gradient-card rounded-xl p-8 border border-border shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-accent mr-3" />
          <h2 className="text-2xl font-bold text-foreground">To-Do List</h2>
        </div>
        <Button
          onClick={() => exportToPDF(todos)}
          variant="outline"
          size="sm"
          className="hover:shadow-accent-glow transition-all duration-300"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Time (e.g., 2:00 PM)"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="bg-input border-border"
          />
          <Input
            placeholder="Task description"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="bg-input border-border md:col-span-2"
          />
        </div>
        <Button
          onClick={addTodo}
          className="w-full bg-gradient-accent hover:shadow-accent-glow transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          todos.map((todo, index) => (
            <div
              key={todo.id}
              className="flex items-center space-x-4 p-4 bg-card-elevated rounded-lg border border-border hover:shadow-md transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <div className="flex-1">
                <div className="text-sm text-primary font-medium">{todo.time}</div>
                <div className={`text-foreground ${todo.completed ? 'line-through opacity-60' : ''}`}>
                  {todo.task}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {todos.length > 0 && (
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Auto-export to PDF after 10 days • {todos.length} task(s)
        </div>
      )}
    </section>
  );
};

export default TodoList;