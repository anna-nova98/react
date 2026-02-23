import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  toggleTask,
  deleteTask,
  updateTask,
  setViewTask,
  setEditTask

}) {
  return (
    <motion.div layout className="task-list">
      <AnimatePresence>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
            setViewTask={setViewTask}
            setEditTask={setEditTask}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}