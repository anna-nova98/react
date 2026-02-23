export default function Stats({ tasks, clearCompleted }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  return (
    <div className="stats">
      <span>{active} tasks left</span>
      <span>{completed} completed</span>
      <button onClick={clearCompleted}>
        Clear Completed
      </button>
    </div>
  );
}