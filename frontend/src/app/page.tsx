"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";

// ✅ Define types
interface Habit {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

interface SuggestionResponse {
  suggestion: string;
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;

  const chartData = [
    { name: "Completed", value: completedCount },
    { name: "Remaining", value: totalCount - completedCount },
  ];

  const COLORS = ["#3b82f6", "#d1d5db"];

  // Pie label for Recharts
const pieLabel = (props: PieLabelRenderProps) => {
  const name = props.name;
  // Safely handle percent as number (it might be undefined)
  const percent = typeof props.percent === "number" ? props.percent : 0;
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

  const fetchHabits = async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:5000/habits");
      const data = await res.json();

      if (Array.isArray(data)) {
        setHabits(data);
      } else if (data?.rows && Array.isArray(data.rows)) {
        setHabits(data.rows);
      } else {
        console.error("Unexpected habits data:", data);
        setHabits([]);
      }
    } catch (err) {
      console.error("Failed to fetch habits:", err);
      setHabits([]);
    }
  };

  const fetchSuggestion = async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:5000/suggest-habit");
      const data: SuggestionResponse = await res.json();
      setSuggestion(data.suggestion);
    } catch (err) {
      console.error("Failed to fetch suggestion:", err);
    }
  };

  const addHabit = async (): Promise<void> => {
    if (!name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    try {
      await fetch("http://localhost:5000/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      setName("");
      setDescription("");
      fetchHabits();
    } catch (err) {
      console.error("Failed to add habit:", err);
    }
  };

  const toggleHabit = async (id: number, completed: boolean): Promise<void> => {
    try {
      await fetch(`http://localhost:5000/habits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchHabits();
    } catch (err) {
      console.error("Failed to update habit:", err);
    }
  };

  const deleteHabit = async (id: number): Promise<void> => {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    try {
      await fetch(`http://localhost:5000/habits/${id}`, { method: "DELETE" });
      fetchHabits();
    } catch (err) {
      console.error("Failed to delete habit:", err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
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

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
            darkMode
              ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
              : "bg-gray-100 border-gray-300 hover:bg-gray-200"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center py-10 px-4">
        {/* Add Habit Section */}
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
          <button
            className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md"
            onClick={fetchSuggestion}
          >
            Get Suggestion
          </button>
        </div>

        {suggestion && (
          <div className="mb-6 text-center text-blue-600 font-semibold">
            {suggestion}
          </div>
        )}

        {/* Habit List */}
        <ul className="w-full sm:w-[600px] space-y-4">
          {habits.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No habits yet. Add one above!
            </p>
          )}
          {habits.map((habit) => (
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

        {/* Progress + Chart */}
        {totalCount > 0 && (
          <>
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

            <div className="w-full sm:w-[600px] mt-8 p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                Progress Overview 📊
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={pieLabel}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
