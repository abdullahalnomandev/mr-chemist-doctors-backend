import { Types } from 'mongoose';

export type QuestionType = 'yesNo' | 'text' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'date' | 'number' | 'checkboxGroup';

export interface IOption {
  id: number;
  value: string;
  label: string;
  position: number;
}

export interface IBaseQuestion {
  id: number;
  questionCode: string;
  type: QuestionType;
  question?: string;
  required?: boolean;
  description?: string;
  position: number;
  treatmentTypes?: string[];
}

export interface IQuestion extends IBaseQuestion {
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  label?: string;
  options?: IOption[];
  allowMultiple?: boolean;
  noneOption?: string;
  conditionalQuestions?: {
    yes?: IQuestion[];
    no?: IQuestion[];
  };
}

export interface IStep {
  id: number;
  stepCode: string;
  title: string;
  position: number;
  questions: IQuestion[];
  treatmentTypes?: string[];
}

export interface IConsultation {
  title: string;
  subtitle: string;
  estimatedTime?: number;
  steps: IStep[];
  treatment: Types.ObjectId;
  isActive: boolean;
}
