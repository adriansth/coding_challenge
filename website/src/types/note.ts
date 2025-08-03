export enum Sentiment {
   HAPPY = "happy",
   SAD = "sad",
   NEUTRAL = "neutral",
   ANGRY = "angry",
}

export interface Note {
   id: string;
   text: string;
   sentiment: Sentiment;
   createdAt: string; // ISO 8601 date string (AWSDateTime format)
}

export interface NoteQueryResults {
   items: Note[];
   nextToken?: string | null;
   scannedCount: number;
}

// for creating new notes (without id and createdAt)
export interface CreateNoteInput {
   text: string;
   sentiment: Sentiment;
}

// for the GraphQL mutation response
export interface CreateNoteResponse {
   createNote: Note;
}

// for the GraphQL query response
export interface GetNotesResponse {
   getNotes: NoteQueryResults;
}
