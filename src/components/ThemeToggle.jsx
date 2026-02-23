import { motion } from "framer-motion";

export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <motion.button
      className="theme-toggle"
      onClick={() => setDarkMode(prev => !prev)}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      {darkMode ? "🌙" : "☀️"}
    </motion.button>
  );
}