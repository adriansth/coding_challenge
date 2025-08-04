import NoteCard from "@/components/global/NoteCard";

export default function NoteList({ notes }) {
   return (
      <div className="w-full min-h-[400px] bg-white/50 rounded-lg border-white/60 p-5 backdrop-blur-sm">
         {notes && notes?.length === 0 ? (
            <div className="text-center text-neutral-600">
               <p className="font-medium mb-2">No notes yet.</p>
               <p className="text-sm">Create your first note to get started!</p>
            </div>
         ) : (
            <div className="w-full flex flex-col gap-y-2">
               {notes &&
                  notes?.map((note) => <NoteCard key={note.id} note={note} />)}
            </div>
         )}
      </div>
   );
}
