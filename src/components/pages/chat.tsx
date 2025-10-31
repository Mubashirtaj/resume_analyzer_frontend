"use client";

import { useFetchData } from "@/service/Get_data";
import React, { useEffect, useState } from "react";

interface ChatpageProps {
  id: string;
}

const Chatpage: React.FC<ChatpageProps> = ({ id }) => {
  const { data, isLoading, error } = useFetchData(
    `http://192.168.100.16:4000/resume/conversation/${id}`
  );

  const [inputValue, setInputValue] = useState("");

  // Scroll to top on reload
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    console.log("Submitted prompt:", inputValue);
    // TODO: send inputValue to your API
    setInputValue("");
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10">Error fetching data</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col space-y-6">
      {/* Conversation List */}
      <div className="space-y-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row border rounded-2xl overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Left Side: Prompt or ImprovedText */}
            <div className="w-full md:w-3/4 p-6 bg-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {item.prompt ? "Prompt" : "Improved Text"}
              </h2>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: item.prompt ?? item.improvedText,
                }}
              />
            </div>

            {/* Right Side: PDF Box */}
            <div className="w-full md:w-1/4 p-6 flex flex-col justify-center items-center bg-gray-50 border-l border-gray-200">
              <p className="font-semibold text-gray-800 mb-4 text-center">
                Your PDF is ready!
              </p>
              <a
                href={`http://192.168.100.16:4000/resume/pdf/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-4 mt-4 sticky bottom-0 bg-white p-4 rounded-xl shadow-md"
      >
        <input
          type="text"
          placeholder="Enter your prompt..."
          className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default Chatpage;
