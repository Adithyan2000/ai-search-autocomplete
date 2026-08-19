"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [query, setquery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
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
    setquery(userQuery);
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
    setquery(suggestion);
    setSuggestions([]);
  }
  
  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search..."
        style={{ padding: "8px", width: "300px" }}
      />

      {loading && <p>Loading suggestions...</p>}

      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: "0", marginTop: "10px" }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
                marginBottom: "5px",
                borderRadius: "4px",
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}