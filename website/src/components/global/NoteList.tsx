import NoteCard from "@/components/global/NoteCard";
import Pagination from "./Pagination";

interface NoteListProps {
   notes: any[];
   onNoteClick: (note: any) => void;
   currentPage?: number;
   totalPages?: number;
   onPageChange?: (page: number) => void;
   isLoading?: boolean;
}

export default function NoteList({
   notes,
   onNoteClick,
   currentPage = 1,
   totalPages = 1,
   onPageChange,
   isLoading = false,
}: NoteListProps) {
   return (
      <div className="w-full min-h-[400px] bg-white/50 rounded-lg border-white/60 p-5 backdrop-blur-sm">
         {notes && notes?.length === 0 ? (
            <div className="text-center text-neutral-600">
               <p className="font-medium mb-2">No notes yet.</p>
               <p className="text-sm">Create your first note to get started!</p>
            </div>
         ) : (
            <div className="w-full flex flex-col gap-y-4">
               {" "}
               {/* notes list */}
               <div className="w-full flex flex-col gap-y-2">
                  {notes &&
                     notes?.map((note) => (
                        <NoteCard
                           key={note?.id || Math.random()}
                           note={note}
                           onClick={
                              onNoteClick ? () => onNoteClick(note) : undefined
                           }
                        />
                     ))}
               </div>
               {/* pagination */}
               {totalPages > 1 && onPageChange && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                     <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        isLoading={isLoading}
                     />
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
