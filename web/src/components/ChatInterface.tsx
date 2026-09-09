"use client";

import React, { useEffect, useRef } from "react";
import { ChefHat, User, Utensils } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { RecipeCard } from "@/components/RecipeCard";
import type { RecipeMessage } from "@/types";

interface ChatInterfaceProps {
  messages: RecipeMessage[];
  isLoading: boolean;
}

// ─────────────────────────────────────────────────────────────
// Empty state illustration
// ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center select-none">
      {/* SVG plate illustration */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        aria-hidden="true"
        className="mb-5 opacity-70"
      >
        <circle cx="48" cy="48" r="44" fill="#f4f7f2" stroke="#cdddc8" strokeWidth="2" />
        <circle cx="48" cy="48" r="32" fill="white" stroke="#cdddc8" strokeWidth="1.5" />
        {/* Fork */}
        <line x1="38" y1="30" x2="38" y2="66" stroke="#82a67a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="30" x2="34" y2="42" stroke="#82a67a" strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="30" x2="38" y2="42" stroke="#82a67a" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="30" x2="42" y2="42" stroke="#82a67a" strokeWidth="2" strokeLinecap="round" />
        {/* Knife */}
        <line x1="58" y1="30" x2="58" y2="66" stroke="#82a67a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M58 30 C62 34 62 44 58 46" stroke="#82a67a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Dot center */}
        <circle cx="48" cy="48" r="4" fill="#cdddc8" />
      </svg>

      <h3 className="text-base font-semibold text-gray-600 mb-1">
        Your recipe will appear here
      </h3>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
        Add ingredients to your pantry, set your preferences, and hit{" "}
        <span className="text-amber-500 font-medium">Cook It!</span>
      </p>

      {/* Feature hints */}
      <div className="mt-6 flex flex-col gap-2 text-left w-full max-w-xs">
        {[
          "🥕  Add any pantry ingredients you have",
          "🌿  Filter by dietary restrictions",
          "⏱️  Set your cooking time limit",
          "👨‍🍳  Get a personalized recipe instantly",
        ].map((hint) => (
          <p key={hint} className="text-xs text-gray-400 flex items-start gap-1">
            {hint}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Loading shimmer rows
// ─────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div
      className="p-5 animate-fade-in"
      role="status"
      aria-live="polite"
      aria-label="Generating your recipe…"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
          <ChefHat size={16} className="text-sage-500" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-sage-600 font-medium animate-pulse">
            Your chef is crafting your recipe…
          </span>
        </div>
      </div>

      {/* Shimmer lines */}
      <div className="space-y-2.5 ml-11">
        {[100, 85, 90, 70, 80].map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-full shimmer"
            style={{ width: `${w}%` }}
            aria-hidden="true"
          />
        ))}
        <div className="h-3 rounded-full shimmer w-[55%]" aria-hidden="true" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Individual message bubbles
// ─────────────────────────────────────────────────────────────

function UserBubble({ message }: { message: RecipeMessage }) {
  return (
    <div className="flex justify-end gap-2 px-4 py-2 animate-slide-up">
      <div className="max-w-[80%]">
        <div className="bg-sage-500 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
          {message.content}
        </div>
        <p className="text-right text-xs text-gray-400 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <User size={15} className="text-sage-600" aria-hidden="true" />
      </div>
    </div>
  );
}

function AssistantBubble({ message }: { message: RecipeMessage }) {
  return (
    <div className="flex gap-3 px-4 py-3 animate-slide-up">
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <ChefHat size={15} className="text-amber-600" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div
          id="recipe-response-container"
          className="bg-white rounded-2xl rounded-tl-sm shadow-card border border-cream-200 px-5 py-4 max-h-[500px] overflow-y-auto chat-scroll recipe-response-container"
          tabIndex={0}
          aria-label="Generated recipe content"
        >
          <RecipeCard raw={message.content} />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ChatInterface — main export
// ─────────────────────────────────────────────────────────────

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);

  // Scroll into view on new messages or loading state
  useEffect(() => {
    if (isLoading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <section
      aria-label="Recipe chat"
      aria-live="polite"
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-200 bg-white rounded-t-2xl">
        <Utensils size={17} className="text-amber-500" aria-hidden="true" />
        <h2 className="font-semibold text-gray-800 text-sm">Recipe Assistant</h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" aria-hidden="true" />
          Powered by IBM watsonx
        </span>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto chat-scroll py-2"
        role="log"
        aria-label="Recipe conversation"
      >
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isLatest = idx === messages.length - 1;
              return (
                <div key={msg.id} ref={isLatest ? latestMessageRef : undefined}>
                  {msg.role === "user" ? (
                    <UserBubble message={msg} />
                  ) : (
                    <AssistantBubble message={msg} />
                  )}
                </div>
              );
            })}
            {isLoading && <LoadingState />}
          </>
        )}
        {/* Scroll anchor */}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </section>
  );
}
