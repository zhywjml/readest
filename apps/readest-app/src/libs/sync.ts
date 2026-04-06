import { Book, BookConfig, BookNote, BookDataRecord } from '@/types/book';

export type SyncType = 'books' | 'configs' | 'notes';
export type SyncOp = 'push' | 'pull' | 'both';

interface BookRecord extends BookDataRecord, Book {}
interface BookConfigRecord extends BookDataRecord, BookConfig {}
interface BookNoteRecord extends BookDataRecord, BookNote {}

export interface SyncResult {
  books: BookRecord[] | null;
  notes: BookNoteRecord[] | null;
  configs: BookConfigRecord[] | null;
}

export type SyncRecord = BookRecord & BookConfigRecord & BookNoteRecord;

export interface SyncData {
  books?: Partial<BookRecord>[];
  notes?: Partial<BookNoteRecord>[];
  configs?: Partial<BookConfigRecord>[];
}

// Local-only mode - cloud sync disabled
export class SyncClient {
  async pullChanges(): Promise<SyncResult> {
    return {
      books: [],
      configs: [],
      notes: [],
    };
  }

  async pushChanges(): Promise<SyncResult> {
    return {
      books: [],
      configs: [],
      notes: [],
    };
  }
}
