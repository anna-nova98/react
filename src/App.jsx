import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
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
  if (!title.trim()) return;

  if (editTask) {
    // EDIT MODE
    setTasks(prev =>
      prev.map(t =>
        t.id === editTask.id
          ? {
              ...t,
              title,
              description,
              dueDate,
              priority
            }
          : t
      )
    );
  } else {
    // ADD MODE
    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      priority,
      createdAt: new Date(),
      dueDate
    };

    setTasks(prev => [newTask, ...prev]);
  }

  // 초기화
  setTitle("");
  setDescription("");
  setDueDate("");
  setPriority("medium");
  setEditTask(null);
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

  const updateTask = (id, newTitle) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, title: newTitle } : t
      )
    );
  };

  const filteredTasks = tasks
    .filter(t => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  const [showModal, setShowModal] = useState(false);
  const clearCompleted = () => {
      setTasks(prev => prev.filter(task => !task.completed));
    };

    useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setDueDate(editTask.dueDate || "");
      setPriority(editTask.priority);
      setShowModal(true);
    }
  }, [editTask]);
  return (
    <div className="app">
      <h1>Task Manager</h1>

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

      <motion.button
        className="add-button"
        onClick={() => setShowModal(true)}
        whileHover={{ y: -3, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        + Add Task
      </motion.button>
      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="filter-row">
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
        </div>
         <button
            className="clear-button"
            onClick={clearCompleted}
          >
            clear
          </button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Task</h3>

             <div className="input-section column">
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Task title..."
                />

                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Task description..."
                />

                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />

                <div className="input-row">
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            <div className="modal-actions">
             <button
                onClick={() => {
                  addTask();
                  setShowModal(false);
                }}
              >
                {editTask ? "Save Changes" : "Add Task"}
              </button>

              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
               {/* 👇 이게 반드시 있어야 함 */}
             
            </div>
          </div>
        </div>
      )}
      {viewTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Task Detail</h3>

            <div className="input-section column">
              <input value={viewTask.title} disabled />
              <textarea value={viewTask.description} disabled />
              <input type="date" value={viewTask.dueDate} disabled />

              <select value={viewTask.priority} disabled>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={() => setViewTask(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <TaskList
        tasks={filteredTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        updateTask={updateTask}
        setViewTask={setViewTask}
        setEditTask={setEditTask}
      />
    </div>
  );
}