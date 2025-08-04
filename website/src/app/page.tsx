"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Sentiment } from "@/types/note";
import { createNote, getNotes } from "@/lib/api/notes";
import Modal from "@/components/global/Modal";
import Header from "@/components/global/Header";
import NoteListHeader from "@/components/global/NoteListHeader";
import NoteList from "@/components/global/NoteList";
import CreateNoteForm from "@/components/create-note/CreateNoteForm";
import NoteView from "@/components/view-note/NoteView";
import NotesLoadingState from "@/components/global/NotesLoadingState";

export default function Home() {
   const queryClient = useQueryClient();
   const NOTES_PER_PAGE = 10;

   const [currentPage, setCurrentPage] = useState(1);
   const [pageTokens, setPageTokens] = useState<string[]>([]);
   const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | null>(
      null
   );
   const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
   const [isCreatingNote] = useState(false);
   const [selectedNote, setSelectedNote] = useState<any>(null);
   const [isNoteViewModalOpen, setIsNoteViewModalOpen] = useState(false);

   // fetch notes
   const { data: notesResponse, isLoading: isLoadingNotes } = useQuery({
      queryKey: ["notes", selectedSentiment, currentPage],
      queryFn: async () => {
         const tokenIndex = currentPage - 2;
         const nextToken = tokenIndex >= 0 ? pageTokens[tokenIndex] : null;
         const result = await getNotes(
            selectedSentiment,
            NOTES_PER_PAGE,
            nextToken
         );
         if (result?.nextToken && !pageTokens.includes(result.nextToken)) {
            setPageTokens((prev) => {
               const newTokens = [...prev];
               newTokens[currentPage - 1] = result.nextToken!;
               return newTokens;
            });
         }
         return result;
      },
      staleTime: 5 * 60 * 1000, // consider data as fresh for 5 min
      gcTime: 10 * 60 * 1000, // keep in cache for 10 min
   });

   const notesData = notesResponse?.items || [];
   const hasNextPage = !!notesResponse?.nextToken;
   const totalPages = hasNextPage ? currentPage + 1 : currentPage;
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
      onSuccess: () => {
         toast.success("Note created successfully");
         setCurrentPage(1);
         setPageTokens([]);
         queryClient.invalidateQueries({ queryKey: ["notes"] });
      },
      onError: () => {
         toast.error("Failed to create note");
      },
   });

   const handleSentimentChange = (sentiment: Sentiment | null) => {
      setSelectedSentiment(sentiment);
      setCurrentPage(1);
      setPageTokens([]);
   };

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   const handleCreateNote = () => {
      setIsCreateNoteModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsCreateNoteModalOpen(false);
   };

   const handleNoteClick = (note: any) => {
      setSelectedNote(note);
      setIsNoteViewModalOpen(true);
   };

   const handleCloseNoteView = () => {
      setIsNoteViewModalOpen(false);
      setSelectedNote(null);
   };

   const handleSubmitNote = async (text: string, sentiment: Sentiment) => {
      try {
         await createNoteMutation.mutateAsync({ text, sentiment });
         setIsCreateNoteModalOpen(false);
      } catch (err) {
         throw err; // re-throw so form can handle error
      }
   };

   return (
      <div>
         <main className="w-full min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col gap-y-10 items-center py-20 lg:py-32">
            {/* header */}
            <Header />
            {/* note list */}
            <div className="w-full lg:w-[1000px] flex flex-col gap-y-5 px-5 sm:px-10 lg:px-20">
               {/* note list header */}
               <NoteListHeader
                  selectedSentiment={selectedSentiment}
                  onSentimentChange={handleSentimentChange}
                  onCreateNote={handleCreateNote}
                  notesCount={notesData?.length ?? 0}
               />
               {/* notes will go here */}
               {isLoadingNotes ? (
                  <NotesLoadingState selectedSentiment={selectedSentiment} />
               ) : (
                  <NoteList
                     notes={notesData}
                     onNoteClick={handleNoteClick}
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={handlePageChange}
                     isLoading={isLoadingNotes}
                  />
               )}
            </div>
         </main>
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
         {/* note view modal */}
         <Modal
            isOpen={isNoteViewModalOpen}
            onClose={handleCloseNoteView}
            title="Note Details"
            size="lg"
         >
            {selectedNote && (
               <NoteView note={selectedNote} onClose={handleCloseNoteView} />
            )}
         </Modal>
      </div>
   );
}
