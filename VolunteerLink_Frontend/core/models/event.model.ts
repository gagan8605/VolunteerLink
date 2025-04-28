export interface Event {
  id?: number;
  title: string;
  date: string | Date;
  description?: string | null;
  location?: string | null;
  createdById?: number;
  createdByName?: string | null;
  salary?: number | null;
  organizerPhoneNumber?: string | null;
  imagePath?: string; 
}