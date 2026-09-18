/**
 * Private documents. What gets stored on a record is an opaque API URL that
 * cannot be opened directly — it is exchanged here for a short-lived signed
 * link every time someone actually wants to read the file.
 */
import { api } from "@/lib/api";

export const documentsApi = {
  /** Signed link for a stored document URL, valid for ten minutes.
   *  403 when the document belongs to someone else, 404 when the URL is not
   *  a document at all. */
  link: (url: string) => api.post<{ url: string }>("/documents/link", { url }),
};
