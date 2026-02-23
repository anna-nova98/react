import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  toggleTask,
  deleteTask,
  updateTask
}) {
  return (
    <motion.div layout className="task-list">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}