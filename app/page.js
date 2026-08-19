"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const timeoutRef = useRef(null);

  async function fetchSuggestions(userQuery) {
    setLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`error ${response.status}`);
      }
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(userQuery) {
    setQuery(userQuery);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (userQuery.trim()) {
        fetchSuggestions(userQuery);
      } else {
        setSuggestions([]);
      }
    }, 500);
  }

  function handleSuggestionClick(suggestion) {
    setQuery(suggestion);
    setSuggestions([]);
  }

  return (
    <main
      className={`${darkMode ? "dark" : ""} min-h-screen bg-slate-50 px-4 py-6 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-10`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl flex-col justify-center">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              AI-powered search
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Find what you need,
              <span className="block text-emerald-600 dark:text-emerald-400">
                before you finish typing.
              </span>
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Search naturally and let intelligent suggestions guide your next
              step.
            </p>
          </div>

          <button
            type="button"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={() => setDarkMode(!darkMode)}
            className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white dark:focus:ring-emerald-950"
          >
            {darkMode ? (
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="3.5" />
                <path
                  strokeLinecap="round"
                  d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z"
                />
              </svg>
            )}
          </button>
        </header>

        <section className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
          <div className="relative flex items-center">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-5 h-5 w-5 text-slate-400 dark:text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search for anything..."
              aria-label="Search for anything"
              aria-controls="search-suggestions"
              aria-busy={loading}
              className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pl-13 pr-14 text-base text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-emerald-400 dark:focus:ring-emerald-950"
            />
            {loading && (
              <span
                className="absolute right-5 flex items-center"
                role="status"
                aria-label="Loading suggestions"
              >
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500 dark:border-slate-700 dark:border-t-emerald-400" />
                <span className="sr-only">Loading suggestions...</span>
              </span>
            )}
          </div>

          {suggestions.length > 0 && (
            <ul
              id="search-suggestions"
              className="mt-2 space-y-1 p-1"
              aria-label="Search suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  className="animate-[fade-up_220ms_ease-out_both]"
                >
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-slate-700 transition duration-200 hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:text-slate-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-100 dark:focus:bg-emerald-950/50 dark:focus:ring-emerald-900"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-emerald-500 dark:text-slate-500 dark:group-hover:text-emerald-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path strokeLinecap="round" d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                    <span className="min-w-0 flex-1 truncate">
                      {suggestion}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
          Suggestions are generated in real time
        </p>
      </div>
    </main>
  );
}
