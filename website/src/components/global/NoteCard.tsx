import sentimentOptions from "@/utils/sentiment-options";
import { truncateText } from "@/utils/strings";

interface NoteCardProps {
   note: {
      id?: string;
      text: string;
      sentiment: string;
      dateCreated: string;
   };
   onClick?: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
   // find the sentiment option that matches the note's sentiment
   const sentimentOption = sentimentOptions.find(
      (option) => option.value === note.sentiment
   );
   // fallback to neutral if sentiment not found
   const fallbackOption =
      sentimentOptions.find((option) => option.value === "neutral") ||
      sentimentOptions[0];

   const currentOption = sentimentOption || fallbackOption;

   return (
      <button
         className={`bg-white border border-neutral-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
            onClick ? "cursor-pointer hover:border-blue-300" : ""
         }`}
         onClick={onClick}
      >
         <div className="flex items-start justify-between gap-3">
            <span className="text-neutral-800 font-medium flex-1 leading-relaxed text-start">
               {truncateText(note.text, 100)}
            </span>

            {/* sentiment badge */}
            <div
               className={`flex items-center gap-x-1.5 px-2.5 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap ${currentOption.bgColor} ${currentOption.textColor}`}
            >
               <span className="text-sm">{currentOption.emoji}</span>
               <span>{currentOption.label}</span>
            </div>
         </div>

         {/* metadata row */}
         {(note.id || note.dateCreated) && (
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-100">
               {note.id && (
                  <span className="text-xs text-neutral-400">
                     ID: {note.id.slice(-8)}
                  </span>
               )}
               {note.dateCreated && (
                  <span className="text-xs text-neutral-500">
                     {new Date(note.dateCreated).toLocaleDateString()}
                  </span>
               )}
            </div>
         )}
      </button>
   );
}
