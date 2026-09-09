"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChefHat,
  Volume2,
} from "lucide-react";
import type { RecipeItem } from "@/types/cookbook";

interface CookModeModalProps {
  recipe: RecipeItem;
  onClose: () => void;
}

export function CookModeModal({ recipe, onClose }: CookModeModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const currentStep = recipe.instructions[currentStepIndex] || recipe.instructions[0];
  const initialTime = (currentStep?.timerMinutes || 3) * 60;
  
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerRunning, setTimerRunning] = useState(false);

  // Reset timer when step changes
  useEffect(() => {
    setTimeLeft((currentStep?.timerMinutes || 3) * 60);
    setTimerRunning(false);
  }, [currentStepIndex, currentStep?.timerMinutes]);

  // Timer countdown tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  const toggleStepDone = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  const isLastStep = currentStepIndex === recipe.instructions.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <ChefHat size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                  Interactive Cook Mode
                </span>
                <span className="text-xs text-amber-100">
                  Step {currentStepIndex + 1} of {recipe.instructions.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold truncate max-w-md">
                {recipe.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Cook Mode"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-cream-200 h-1.5 flex">
          {recipe.instructions.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 transition-all duration-300 ${
                idx <= currentStepIndex ? "bg-amber-500" : "bg-transparent"
              } ${idx < recipe.instructions.length - 1 ? "border-r border-white/50" : ""}`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Main Instruction Display */}
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                Step {currentStep.step}
              </span>
              <button
                type="button"
                onClick={() => toggleStepDone(currentStep.step)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium transition-all ${
                  completedSteps.includes(currentStep.step)
                    ? "bg-sage-600 text-white shadow-sm"
                    : "bg-white border border-cream-300 text-gray-600 hover:border-sage-400"
                }`}
              >
                <CheckCircle2 size={14} />
                <span>
                  {completedSteps.includes(currentStep.step)
                    ? "Marked as Done"
                    : "Mark Done"}
                </span>
              </button>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              {currentStep.title}
            </h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {currentStep.detail}
            </p>
          </div>

          {/* Integrated Interactive Step Timer */}
          <div className="bg-white border border-cream-200 shadow-sm rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Volume2 size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  Step Cooking Timer
                </h4>
                <p className="text-xs text-gray-500">
                  Suggested duration: ~{currentStep?.timerMinutes || 3} minutes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-mono text-3xl font-extrabold text-gray-900 px-4 py-1.5 bg-cream-100 rounded-xl border border-cream-200">
                {formatSeconds(timeLeft)}
              </div>
              <button
                type="button"
                onClick={() => setTimerRunning(!timerRunning)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-all ${
                  timerRunning
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-sage-600 hover:bg-sage-700"
                }`}
                aria-label={timerRunning ? "Pause timer" : "Start timer"}
              >
                {timerRunning ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimeLeft((currentStep?.timerMinutes || 3) * 60);
                }}
                className="w-11 h-11 rounded-xl border border-cream-300 hover:bg-cream-100 flex items-center justify-center text-gray-600 transition-colors"
                aria-label="Reset timer"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Chef tips badge */}
          {recipe.chefTips && recipe.chefTips.length > 0 && (
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
              <span className="text-amber-600 text-base">💡</span>
              <div>
                <span className="font-bold">Chef Pro-Tip: </span>
                {recipe.chefTips[0]}
              </div>
            </div>
          )}
        </div>

        {/* Footer Step Navigation */}
        <div className="px-6 py-4 bg-cream-50 border-t border-cream-200 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-cream-300 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-1.5">
            {recipe.instructions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? "bg-amber-500 scale-125"
                    : completedSteps.includes(idx + 1)
                    ? "bg-sage-500"
                    : "bg-cream-300 hover:bg-cream-400"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {isLastStep ? (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-sage-600 hover:bg-sage-700 shadow-md transition-all"
            >
              <CheckCircle2 size={16} />
              <span>Finish Cooking!</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                toggleStepDone(currentStep.step);
                setCurrentStepIndex((prev) => Math.min(recipe.instructions.length - 1, prev + 1));
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md transition-all"
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
