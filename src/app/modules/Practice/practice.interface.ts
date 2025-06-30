import { Model } from 'mongoose';

export type IPractice = {
  nhsId: string;
  name: string;
  line1: string;
  line2: string;
  line3?: string;
  line4?: string;
  postcode: string;
  phone: string;
};

export type PracticeModel = Model<IPractice, Record<string, unknown>>;