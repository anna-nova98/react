import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 2000);
  };

  const addTask = () => {
    if (!input.trim()) {
      showStatus("error", "Task cannot be empty");
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      text: input,
      completed: false,
      priority
    };

    setTasks(prev => [newTask, ...prev]);
    setInput("");
    showStatus("success", "Task added");
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showStatus("success", "Task deleted");
  };

  const updateTask = (id, text) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, text } : t))
    );
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
    showStatus("success", "Completed cleared");
  };

  const filteredTasks = tasks
    .filter(t => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter(t =>
      t.text.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="app">
      <h1>Task Manager</h1>

      {/* STATUS */}
      <AnimatePresence>
        {status && (
          <motion.div
            className={`status ${status.type}`}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
          >
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT */}
      <div className="input-section">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Add task..."
        />

        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={addTask}
        >
          Add
        </motion.button>
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* FILTER + CLEAR */}
      <div className="filter-buttons">
        {["all", "active", "completed"].map(type => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}

        <span className="clear-link" onClick={clearCompleted}>
          Clear completed
        </span>
      </div>

      <TaskList
        tasks={filteredTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        updateTask={updateTask}
      />
    </div>
  );
}