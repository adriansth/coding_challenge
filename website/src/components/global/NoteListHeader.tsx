import { Sentiment } from "@/types/note";
import { Plus } from "lucide-react";
import sentimentOptions from "@/utils/sentiment-options";

interface NotesHeaderProps {
   selectedSentiment: Sentiment | null;
   onSentimentChange: (sentiment: Sentiment | null) => void;
   onCreateNote: () => void;
   notesCount?: number;
   className?: string;
}

export default function NoteListHeader({
   selectedSentiment,
   onSentimentChange,
   onCreateNote,
   notesCount,
   className = "",
}: NotesHeaderProps) {
   return (
      <div
         className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
      >
         {/* left side - create button and stats */}
         <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
               onClick={onCreateNote}
               className="w-fit flex items-center gap-x-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 cursor-pointer text-sm transition-all text-white font-medium"
            >
               <Plus size={16} />
               Create Note
            </button>
            {notesCount !== undefined && (
               <span className="text-neutral-600 text-sm">
                  {notesCount} {notesCount === 1 ? "note" : "notes"}
                  {selectedSentiment && `~ Filtered by ${selectedSentiment}`}
               </span>
            )}
         </div>
         {/* right side - sentiment filter buttons */}
         <div className="flex flex-wrap gap-2">
            {sentimentOptions.map((option) => {
               const isSelected = selectedSentiment === option.value;
               return (
                  <button
                     key={option.value}
                     className={`flex items-center gap-x-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer border border-neutral-300 ${
                        isSelected
                           ? `${option.selectedBg} ${option.selectedText}`
                           : `${option.bgColor} ${option.textColor} ${option.hoverColor}`
                     }`}
                  >
                     <span className="text-base">{option.emoji}</span>
                     <span>{option.label}</span>
                  </button>
               );
            })}
         </div>
      </div>
   );
}
