
import { MedicalRecord, RecordType } from './types';

export const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    date: '2023-01-15',
    type: RecordType.BLOOD_TEST,
    title: 'Baseline Thyroid Panel',
    description: 'Initial tests after noticing a neck lump.',
    results: [
      { marker: 'TSH', value: 4.2, unit: 'mIU/L', referenceRange: '0.4-4.0' },
      { marker: 'Free T4', value: 1.1, unit: 'ng/dL', referenceRange: '0.8-1.8' },
      { marker: 'Thyroglobulin', value: 45, unit: 'ng/mL' }
    ]
  },
  {
    id: '2',
    date: '2023-02-10',
    type: RecordType.IMAGING,
    title: 'Neck Ultrasound',
    description: 'Ultrasound of thyroid and lymph nodes.',
    imagingFindings: '2.4cm solid, hypoechoic nodule in left lobe. TIRADS 5. Multiple enlarged level VI lymph nodes.',
    isMajorEvent: true
  },
  {
    id: '3',
    date: '2023-03-05',
    type: RecordType.IMAGING,
    title: 'CT Chest/Neck',
    description: 'Staging scan prior to surgery.',
    imagingFindings: 'No distant metastasis. Confirmed primary nodule and suspicious lymphadenopathy.'
  },
  {
    id: '4',
    date: '2024-05-12',
    type: RecordType.SURGERY,
    title: 'Total Thyroidectomy',
    description: 'Total thyroidectomy with central neck dissection.',
    location: 'City Medical Center',
    provider: 'Dr. Sarah Chen',
    isMajorEvent: true
  },
  {
    id: '5',
    date: '2024-05-18',
    type: RecordType.PATHOLOGY,
    title: 'Pathology Report',
    description: 'Post-surgical tissue analysis.',
    pathologyStaging: 'pT2 N1a M0. Papillary Thyroid Carcinoma, Classic Variant.',
    isMajorEvent: true
  },
  {
    id: '6',
    date: '2024-05-25',
    type: RecordType.BLOOD_TEST,
    title: 'Post-Op Lab Work',
    description: 'First labs after surgery.',
    results: [
      { marker: 'TSH', value: 12.5, unit: 'mIU/L' },
      { marker: 'Thyroglobulin', value: 0.8, unit: 'ng/mL' },
      { marker: 'Calcium', value: 8.2, unit: 'mg/dL' }
    ]
  }
];

export const LAB_MARKERS = ['TSH', 'Free T4', 'Thyroglobulin', 'TgAb', 'Calcium'];
