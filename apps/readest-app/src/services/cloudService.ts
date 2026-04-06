import { AppService, FileSystem, BaseDir, DeleteAction } from '@/types/system';
import { Book } from '@/types/book';
import {
  getDir,
  getLocalBookFilename,
  getCoverFilename,
} from '@/utils/book';

// Cloud service has been removed - only handles local file operations
export async function deleteBook(
  fs: FileSystem,
  book: Book,
  deleteAction: DeleteAction,
): Promise<void> {
  if (deleteAction === 'local' || deleteAction === 'both') {
    const localDeleteFps =
      deleteAction === 'local'
        ? [getLocalBookFilename(book)]
        : [getLocalBookFilename(book), getCoverFilename(book)];
    for (const fp of localDeleteFps) {
      if (await fs.exists(fp, 'Books')) {
        await fs.removeFile(fp, 'Books');
      }
    }
    if (deleteAction === 'local') {
      book.downloadedAt = null;
    } else {
      book.deletedAt = Date.now();
      book.downloadedAt = null;
      book.coverDownloadedAt = null;
    }
  }
  // Cloud deletion removed - only local file operations
}

// Cloud upload/download functions disabled
export async function uploadFileToCloud(): Promise<void> {
  console.log('Cloud upload is disabled in local-only mode');
  return Promise.resolve();
}

export async function uploadBook(): Promise<void> {
  console.log('Cloud upload is disabled in local-only mode');
  return Promise.resolve();
}

export async function downloadCloudFile(): Promise<void> {
  console.log('Cloud download is disabled in local-only mode');
  return Promise.resolve();
}

export async function downloadBookCovers(): Promise<void> {
  console.log('Cloud download is disabled in local-only mode');
  return Promise.resolve();
}

export async function downloadBook(): Promise<void> {
  console.log('Cloud download is disabled in local-only mode');
  return Promise.resolve();
}
