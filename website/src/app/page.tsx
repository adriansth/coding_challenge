"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import NoteListHeader from "@/components/global/NoteListHeader";
import { Sentiment } from "@/types/note";
import { useState } from "react";
import Modal from "@/components/global/Modal";
import CreateNoteForm from "@/components/create-note/CreateNoteForm";
import { createNote, getNotes } from "@/lib/api/notes";
import toast from "react-hot-toast";
import AmplifyTest from "@/components/debug/AmplifyTest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Home() {
   const queryClient = useQueryClient();

   const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | null>(
      null
   );
   const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
   const [isCreatingNote, setIsCreatingNote] = useState(false);
   const [lastCreatedNote, setLastCreatedNote] = useState<any>(null); // for debugging

   // fetch notes
   const {
      data: notesData,
      isLoading: isLoadingNotes,
      error: notesError,
      refetch: refetchNotes,
   } = useQuery({
      queryKey: ["notes", selectedSentiment],
      queryFn: async () => {
         const result = await getNotes(selectedSentiment);
         if (result && result.items) {
            console.log(result.items);
            return result.items;
         } else {
            return [];
         }
      },
      staleTime: 5 * 60 * 1000, // consider data as fresh for 5 min
      gcTime: 10 * 60 * 1000, // keep in cache for 10 min
   });

   // mutation for creating notes
   const createNoteMutation = useMutation({
      mutationFn: async ({
         text,
         sentiment,
      }: {
         text: string;
         sentiment: Sentiment;
      }) => {
         const newNote = await createNote(text, sentiment);
         return newNote;
      },
      onSuccess: (newNote) => {
         toast.success("Note created successfully");
         queryClient.invalidateQueries({ queryKey: ["notes"] });
      },
      onError: (err) => {
         toast.error("Failed to create note");
      },
   });

   const handleSentimentChange = (sentiment: Sentiment | null) => {
      setSelectedSentiment(sentiment);
   };

   const handleCreateNote = () => {
      setIsCreateNoteModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsCreateNoteModalOpen(false);
   };

   const handleSubmitNote = async (text: string, sentiment: Sentiment) => {
      setIsCreatingNote(true);
      try {
         await createNoteMutation.mutateAsync({ text, sentiment });
         setIsCreateNoteModalOpen(false);
      } catch (err) {
         throw err; // re-throw so form can handle error
      } finally {
         setIsCreatingNote(false);
      }
   };

   return (
      <div>
         <main className="w-full min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col gap-y-10 items-center py-20 lg:py-32">
            {/* header */}
            <div className="w-full lg:w-[1000px] flex flex-col gap-y-5 items-start px-5 sm:px-10 lg:px-20">
               <h1 className="text-neutral-800 text-4xl font-medium">
                  Sentiment Notes
               </h1>
               <p className="text-neutral-700 font-medium">
                  Welcome to Sentiment Notes. This is a Coding Challenge
                  provided by{" "}
                  <Link
                     href="https://mipey.mx"
                     target="_blank"
                     className="text-blue-600 hover:underline cursor-pointer"
                  >
                     pey
                  </Link>{" "}
                  and made by{" "}
                  <Link
                     href="https://github.com/adriansth"
                     target="_blank"
                     className="text-blue-600 hover:underline cursor-pointer"
                  >
                     @adriansth
                  </Link>
                  .
               </p>
            </div>
            {/* note list */}
            <div className="w-full lg:w-[1000px] flex flex-col gap-y-5 px-5 sm:px-10 lg:px-20">
               {/* note list header */}
               <NoteListHeader
                  selectedSentiment={selectedSentiment}
                  onSentimentChange={handleSentimentChange}
                  onCreateNote={handleCreateNote}
                  notesCount={0}
               />
               {/* notes will go here */}
               <div className="w-full min-h-[400px] bg-white/50 rounded-lg border-white/60 p-5 backdrop-blur-sm">
                  <div className="text-center text-neutral-600">
                     <p className="font-medium mb-2">No notes yet.</p>
                     <p className="text-sm">
                        Create your first note to get started!
                     </p>
                  </div>
               </div>
            </div>
         </main>
         {/* debug: amplify */}
         <AmplifyTest />
         {/* create note modal */}
         <Modal
            isOpen={isCreateNoteModalOpen}
            onClose={handleCloseModal}
            title="Create New Note"
            size="md"
         >
            <CreateNoteForm
               onSubmit={handleSubmitNote}
               onCancel={handleCloseModal}
               isLoading={isCreatingNote}
            />
         </Modal>
      </div>
   );
}
