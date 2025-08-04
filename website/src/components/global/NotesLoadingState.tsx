import LoadingSpinner from "./LoadingSpinner";

interface NotesLoadingStateProps {
   selectedSentiment?: string | null;
   className?: string;
}

export default function NotesLoadingState({
   selectedSentiment,
   className = "",
}: NotesLoadingStateProps) {
   const getLoadingText = () => {
      if (selectedSentiment) {
         return `Loading ${selectedSentiment} notes...`;
      }
      return "Loading notes...";
   };

   return (
      <div
         className={`w-full min-h-[400px] bg-white/50 rounded-lg border-white/60 backdrop-blur-sm flex items-center justify-center ${className}`}
      >
         <div className="text-center">
            <LoadingSpinner
               size="lg"
               color="blue"
               text={getLoadingText()}
               className="py-8"
            />
            <p className="text-sm text-gray-500 mt-4">
               {selectedSentiment
                  ? `Filtering by ${selectedSentiment} sentiment`
                  : "Fetching all your notes"}
            </p>
         </div>
      </div>
   );
}
