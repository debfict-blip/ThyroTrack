
export enum RecordType {
  BLOOD_TEST = 'BLOOD_TEST',
  IMAGING = 'IMAGING',
  SURGERY = 'SURGERY',
  PATHOLOGY = 'PATHOLOGY',
  APPOINTMENT = 'APPOINTMENT',
  MEDICATION = 'MEDICATION'
}

export interface LabResult {
  marker: string;
  value: number;
  unit: string;
  referenceRange?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: RecordType;
  title: string;
  description: string;
  location?: string;
  provider?: string;
  results?: LabResult[];
  imagingFindings?: string;
  pathologyStaging?: string;
  isMajorEvent?: boolean;
}

export interface PatientProfile {
  name: string;
  dob: string;
  age?: number;
  diagnosis: string;
  diagnosisDate: string;
  stage?: string;
}
