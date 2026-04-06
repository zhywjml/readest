import { AppService } from '@/types/system';

// Cloud storage disabled - local-only mode
export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  usage: number;
  quota: number;
  usagePercentage: number;
  byBookHash: Array<{
    bookHash: string | null;
    fileCount: number;
    totalSize: number;
  }>;
}

export interface FileRecord {
  file_key: string;
  file_size: number;
  book_hash: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ListFilesParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'created_at' | 'updated_at' | 'file_size' | 'file_key';
  sortOrder?: 'asc' | 'desc';
  bookHash?: string;
  search?: string;
}

interface ListFilesResponse {
  files: FileRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface PurgeFilesResult {
  success: string[];
  failed: Array<{ fileKey: string; error: string }>;
  deletedCount: number;
  failedCount: number;
}

// Cloud storage functions disabled
export const uploadFile = async (): Promise<undefined> => {
  console.log('Cloud upload is disabled in local-only mode');
  return undefined;
};

export const batchGetDownloadUrls = async (): Promise<never[]> => {
  return [];
};

export const downloadFile = async (): Promise<Record<string, string> | null> => {
  console.log('Cloud download is disabled in local-only mode');
  return null;
};

export const deleteFile = async (): Promise<void> => {
  console.log('Cloud delete is disabled in local-only mode');
};

export const getStorageStats = async (): Promise<StorageStats> => {
  return {
    totalFiles: 0,
    totalSize: 0,
    usage: 0,
    quota: 0,
    usagePercentage: 0,
    byBookHash: [],
  };
};

export const listFiles = async (): Promise<ListFilesResponse> => {
  return {
    files: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  };
};

export const purgeFiles = async (): Promise<PurgeFilesResult> => {
  return {
    success: [],
    failed: [],
    deletedCount: 0,
    failedCount: 0,
  };
};
