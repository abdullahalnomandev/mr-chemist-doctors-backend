import { Types } from 'mongoose';

export interface IAnswer {
  questionCode: string;
  value: string | number | boolean | object;
}

export interface IConsultationResponse {
  user: Types.ObjectId;
  treatment: Types.ObjectId;
  consultation: Types.ObjectId;
  product?: Types.ObjectId;
  answers: IAnswer[];
  rawFormData?: Record<string, string | number | boolean | object>;
  status: 'in-progress' | 'completed' | 'approved' | 'rejected';
  completedAt?: Date;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  notes?: string;
}
