import { useState } from "react";
import { motion } from "framer-motion";

export default function TaskItem({
  task,
  toggleTask,
  deleteTask,
  updateTask,
  setViewTask,
  setEditTask
  
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);

  const handleEdit = () => {
    updateTask(task.id, { title: value });
    setEditing(false);
  };

  const getPriorityColor = () => {
    if (task.priority === "high") return "#ef4444";
    if (task.priority === "medium") return "#f97316";
    return "#3b82f6";
  };

  const formattedDate = new Date(task.createdAt).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="task-card"
    >
      <div
        className="priority-bar"
        style={{ background: getPriorityColor() }}
      />

      <motion.div
        className={`check-box ${task.completed ? "checked" : ""}`}
        onClick={() => toggleTask(task.id)}
        whileTap={{ scale: 0.8 }}
      >
        {task.completed && "✓"}
      </motion.div>

      <div className="task-content">
        {editing ? (
          <input
            className="edit-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            autoFocus
          />
        ) : (
          <>
            <div
              className={`task-title ${
                task.completed ? "completed" : ""
              }`}
              onDoubleClick={() => setEditing(true)}
            >
              {task.title}
            </div>

            {task.description && (
              <div className="task-description">
                {task.description}
              </div>
            )}

            <div className="task-date">
              Created: {formattedDate}
            </div>
          </>
        )}
      </div>

      <div className="action-buttons">
        <button
          className="view-btn"
          onClick={() => setViewTask(task)}
        >
          👁
        </button>

        <button
          className="edit-btn"
           onClick={() => setEditTask(task)}
        >
          ✏
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteTask(task.id)}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}