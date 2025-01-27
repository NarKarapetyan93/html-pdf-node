export interface FileInput {
    content?: string;
    url?: string;
    [key: string]: unknown;
  }
  
export interface PdfOutput extends Omit<FileInput, 'content'> {
    buffer: Buffer;
  }
  
export type CallbackFunction = (error: Error | null, result?: Buffer | PdfOutput[]) => void;