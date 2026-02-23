import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskList from "./components/TaskList";
import ThemeToggle from "./components/ThemeToggle";
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 2000);
  };

  const addTask = () => {
  if (!title.trim()) return;

  const today = new Date().toISOString().split("T")[0];  //today

  // validation
  if (!dueDate) {
    alert("Please select a due date");
    return;
  }

  if (dueDate < today) {
    alert("Due date cannot be in the future");
    return;
  }

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
      createdAt: new Date().toISOString(),
      dueDate
    };

    setTasks(prev => [newTask, ...prev]);
  }

  setTitle("");
  setDescription("");
  setDueDate("");
  setPriority("medium");
  setEditTask(null);
  setShowModal(false);
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

  const updateTask = (id, newTaskData) => {
    setTasks(prev => 
      prev.map(t =>
        t.id === id ? { ...t, ...newTaskData } : t
      )
    );
  };

  const filteredTasks = tasks
  .filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  })
  .filter(t => {
    const keyword = search.toLowerCase();

    return (
      t.title.toLowerCase().includes(keyword) ||
      (t.description &&
        t.description.toLowerCase().includes(keyword))
    );
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortBy === "due") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    return 0;
  });



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
  const confirmDelete = () => {
    setTasks(prev => prev.filter(t => t.id !== deleteTaskId));
    setDeleteTaskId(null);
  };

  

  const taskToDelete = tasks.find(t => t.id === deleteTaskId);
  return (
    <div className="app">
      <div style={{display: "flex",justifyContent:"space-between"}}>
        <h1>Task Manager</h1>
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
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
        {/* <div className="filter-buttons">
        {["all", "active", "completed"].map(type => (
          <button
            key={type}
            className={filter === type ? "active" : ""}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
        </div> */}
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="sort-select"
            >
                <option value="all">all</option>
                <option value="active">active</option>
                <option value="completed">completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="due">Due Date</option>
                <option value="priority">Priority</option>
            </select>
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
            <h3>{editTask ? "Edit Task" : "Add Task"}</h3>

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
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}  //validation
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

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditTask(null);
                  setTitle("");
                  setDescription("");
                  setDueDate("");
                  setPriority("medium");
                  setViewTask(false);
                }}
              >
                Cancel
              </button>
              
             
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
              <button
              style={{color:'black'}}
                onClick={() => {
                  setShowModal(false);
                  setEditTask(null);
                  setTitle("");
                  setDescription("");
                  setDueDate("");
                  setPriority("medium");
                  setViewTask(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
     {deleteTaskId && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Delete Task</h3>

            <p>
              Are you sure you want to delete
              <strong> "{taskToDelete?.title}" </strong> ?
            </p>

            <div className="modal-actions">
              <button onClick={confirmDelete}>
                OK
              </button>

              <button onClick={() => setDeleteTaskId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <TaskList
        // tasks={filteredTasks}
        tasks={sortedTasks}
        toggleTask={toggleTask}
        deleteTask={setDeleteTaskId} 
        updateTask={updateTask}
        setViewTask={setViewTask}
        setEditTask={setEditTask}
      />
    </div>
  );
}