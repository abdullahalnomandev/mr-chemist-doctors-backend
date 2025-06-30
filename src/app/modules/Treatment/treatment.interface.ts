export interface ITreatment {
  name: string;
  slug: string;
  description: string;
  questionsId?:string;
  isActive: boolean;
  logoUrl?: string | null;
}
