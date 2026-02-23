import { useState } from "react";
import { motion } from "framer-motion";

export default function TaskInput({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  };

  return (
    <motion.div
      className="input-wrapper"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <input
        placeholder="Add a new task"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && handleSubmit()
        }
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
      >
        Add Task
      </motion.button>
    </motion.div>
  );
}