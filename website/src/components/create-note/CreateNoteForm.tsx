"use client";

import React, { useState } from "react";
import { Sentiment } from "@/types/note";
import sentimentOptions from "@/utils/sentiment-options";

interface CreateNoteFormProps {
   onSubmit: (text: string, sentiment: Sentiment) => Promise<void>;
   onCancel: () => void;
   isLoading?: boolean;
}

export default function CreateNoteForm({
   onSubmit,
   onCancel,
   isLoading = false,
}: CreateNoteFormProps) {
   const [text, setText] = useState("");
   const [sentiment, setSentiment] = useState<Sentiment>(Sentiment.NEUTRAL);
   const [errors, setErrors] = useState<{ text?: string }>({});

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // reset errors
      setErrors({});
      // validation
      if (!text.trim()) {
         setErrors({ text: "Please enter some text for your note." });
      }
      if (text.trim().length < 3) {
         setErrors({ text: "Note must be at least 3 characters long." });
      }
      if (text.trim().length > 500) {
         setErrors({ text: "Note must be less than 500 characters." });
      }
      try {
         await onSubmit(text.trim(), sentiment);
         // reset form on success
         setText("");
         setSentiment(Sentiment.NEUTRAL);
      } catch (err) {
         setErrors({ text: "Failed to create note. Please try again." });
      }
   };
   // filter out the "all" option for creation form
   const creationSentimentOptions = sentimentOptions.filter(
      (option) => option.value !== null
   );
   return (
      <form onSubmit={handleSubmit} className="space-y-5">
         {/* text input */}
         <div>
            <label
               htmlFor="note-text"
               className="block text-sm font-medium text-neutral-700 mb-2"
            >
               What's on your mind? <span className="text-red-500">*</span>
            </label>
            <textarea
               id="note-text"
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder="Share your thoughts, feelings or experiences..."
               className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-colors ${
                  errors.text ? "border-red-500" : "border-neutral-300"
               }`}
               rows={4}
               maxLength={500}
               disabled={isLoading}
            ></textarea>
            {/* character count */}
            <div className="flex justify-between items-center mt-1">
               {errors.text && (
                  <span className="text-sm text-red-600">{errors.text}</span>
               )}
               <span
                  className={`text-xs ml-auto ${
                     text.length > 450 ? "text-red-500" : "text-neutral-500"
                  }`}
               >
                  {text.length}/500
               </span>
            </div>
         </div>
         {/* sentiment selection */}
         <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
               How are you feeling? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
               {creationSentimentOptions.map((option) => (
                  <label
                     key={option.value}
                     className={`relative flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${
                        sentiment === option.value
                           ? `${option.selectedBg} ${option.selectedText} border-transparent`
                           : `${option.bgColor} ${option.textColor} border-neutral-300 ${option.hoverColor}`
                     }
                     ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                     <input
                        type="radio"
                        value={option.value}
                        checked={sentiment === option.value}
                        onChange={(e) =>
                           setSentiment(e.target.value as Sentiment)
                        }
                        className="sr-only"
                        disabled={isLoading}
                     />
                     <div className="flex items-center gap-2">
                        <span className="text-xl">{option.emoji}</span>
                        <span className="font-medium">{option.label}</span>
                     </div>
                  </label>
               ))}
            </div>
         </div>
         {/* form actions */}
         <div className="flex flex-col-reverse sm:flex-row gap-3 pt-5 border-t border-neutral-200">
            <button
               type="button"
               onClick={onCancel}
               disabled={isLoading}
               className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
               Cancel
            </button>
            <button
               type="submit"
               disabled={isLoading || !text.trim()}
               className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-blue-400 flex items-center justify-center gap-2 cursor-pointer"
            >
               {isLoading ? (
                  <>
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                        Creating...
                     </div>
                  </>
               ) : (
                  "Create Note"
               )}
            </button>
         </div>
      </form>
   );
}
