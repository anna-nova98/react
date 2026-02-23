import { useState } from "react";
import { motion } from "framer-motion";

export default function TaskItem({
  task,
  toggleTask,
  deleteTask,
  updateTask
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.text);

  const handleEdit = () => {
    updateTask(task.id, value);
    setEditing(false);
  };

  const getPriorityColor = () => {
    if (task.priority === "high") return "#ef4444";
    if (task.priority === "medium") return "#f97316";
    return "#3b82f6";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}  // opacity로만 부드럽게 나타남
      animate={{ opacity: 1 }}  // opacity가 1로 변함
      exit={{ opacity: 0 }}     // exit 시 opacity 0
      transition={{ duration: 0.5 }}  // 부드러운 페이드 인/아웃
      className="task-card"
    >
      {/* priority bar */}
      <div
        className="priority-bar"
        style={{ background: getPriorityColor() }}
      />

      {/* checkbox */}
      <motion.div
        className={`check-box ${task.completed ? "checked" : ""}`}
        onClick={() => toggleTask(task.id)}
        whileTap={{ scale: 0.8 }}
      >
        {task.completed && "✓"}
      </motion.div>

      {/* text */}
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
        <span
          className={`task-text ${task.completed ? "completed" : ""}`}
          onDoubleClick={() => setEditing(true)}
        >
          {task.text}
        </span>
      )}

      {/* delete button */}
      <motion.button
        className="delete-floating"
        whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
        onClick={() => deleteTask(task.id)}
      >
        ✕
      </motion.button>
    </motion.div>
  );
}