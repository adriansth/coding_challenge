import sentimentOptions from "@/utils/sentiment-options";

interface NoteViewProps {
   note: {
      id?: string;
      text: string;
      sentiment: string;
      dateCreated: string;
   };
   onClose: () => void;
}

export default function NoteView({ note, onClose }: NoteViewProps) {
   // find the sentiment option that matches the note's sentiment
   const sentimentOption = sentimentOptions.find(
      (option) => option.value === note.sentiment
   );
   // fallback to neutral if sentiment is not found
   const fallbackOption =
      sentimentOptions.find((option) => option.value === "neutral") ||
      sentimentOptions[0];

   const currentOption = sentimentOption || fallbackOption;

   return (
      <div className="w-full max-w-2xl mx-auto max-h-[500px] overflow-y-scroll">
         {/* content */}
         <div className="flex flex-col gap-y-5 mb-6">
            <p>{note.text}</p>
            <div
               className={`w-fit flex items-center gap-x-2 px-4 py-2 rounded-lg font-medium text-sm ${currentOption.bgColor} ${currentOption.textColor}`}
            >
               <span className="text-lg">{currentOption.emoji}</span>
               <span>{currentOption.label}</span>
            </div>
         </div>
      </div>
   );
}
