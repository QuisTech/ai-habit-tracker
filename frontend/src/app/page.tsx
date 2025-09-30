"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Completed / total count for progress bar
  const completedCount = habits.filter((h: any) => h.completed).length;
  const totalCount = habits.length;

  const fetchHabits = async () => {
    const res = await fetch("http://localhost:5000/habits");
    const data = await res.json();
    setHabits(data);
  };

  const addHabit = async () => {
    if (!name) return alert("Please enter a habit name");
    await fetch("http://localhost:5000/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setName("");
    setDescription("");
    fetchHabits();
  };

  const toggleHabit = async (id: number, completed: boolean) => {
    await fetch(`http://localhost:5000/habits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchHabits();
  };

  const deleteHabit = async (id: number) => {
    await fetch(`http://localhost:5000/habits/${id}`, { method: "DELETE" });
    fetchHabits();
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ease-in-out ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`flex justify-between items-center px-8 py-5 shadow-md transition-colors duration-700 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="text-blue-500">AI</span> Habit Tracker
        </h1>

        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
            darkMode
              ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
              : "bg-gray-100 border-gray-300 hover:bg-gray-200"
          }`}
        >
          <span
            className={`transition-transform duration-500 ${
              darkMode ? "rotate-180" : "rotate-0"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </span>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Main App */}
      <main className="flex flex-col items-center py-10 px-4">
        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            className={`border focus:ring-2 rounded-lg px-4 py-2 w-64 outline-none shadow-md transition-all duration-300 placeholder-gray-500 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-300"
            }`}
            placeholder="Habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className={`border focus:ring-2 rounded-lg px-4 py-2 w-64 outline-none shadow-md transition-all duration-300 placeholder-gray-500 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-300"
            }`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md"
            onClick={addHabit}
          >
            Add
          </button>
        </div>

        {/* Habit List */}
        <ul className="w-full sm:w-[600px] space-y-4">
          {habits.map((habit: any) => (
            <li
              key={habit.id}
              className={`flex justify-between items-center rounded-3xl shadow-lg p-6 border transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl ${
                habit.completed
                  ? darkMode
                    ? "bg-green-900 border-green-700"
                    : "bg-emerald-100 border-emerald-400"
                  : darkMode
                  ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                  : "bg-white border-gray-300 hover:border-blue-500"
              }`}
            >
              <div>
                <h3
                  className={`text-lg sm:text-xl font-extrabold mb-1 tracking-tight ${
                    habit.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : darkMode
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {habit.name}
                </h3>
                <p
                  className={`text-base sm:text-lg ${
                    habit.completed
                      ? "opacity-70"
                      : darkMode
                      ? "text-gray-300"
                      : "text-gray-800"
                  }`}
                >
                  {habit.description}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 shadow-sm ${
                    habit.completed
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={() => toggleHabit(habit.id, habit.completed)}
                >
                  {habit.completed ? "Undo" : "Done"}
                </button>

                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-sm"
                  onClick={() => deleteHabit(habit.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Progress Tracker */}
        {totalCount > 0 && (
          <div className="w-full sm:w-[600px] mt-8 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors duration-500">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Completed {completedCount} of {totalCount} habits 🎯
            </span>

            <div
              className="relative w-full sm:w-1/2 h-4 rounded-full overflow-hidden group"
              title={`${Math.round((completedCount / totalCount) * 100)}% completed`}
            >
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div
                className="h-4 rounded-full transition-all duration-700 ease-in-out"
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                }}
              />
              <span className="absolute right-0 -top-6 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
