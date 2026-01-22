// components/onboarding/types.ts
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  documents: {
    idProof: File | null;
    addressProof: File | null;
    educationCert: File | null;
    experienceLetter: File | null;
    passport: File | null;
    photograph: File | null;
  };
  workEmail: string;
  systemAccess: string[];
  department: string;
  team: string;
  manager: string;
  designation: string;
  laptop: boolean;
  mouse: boolean;
  keyboard: boolean;
  monitor: boolean;
  headphones: boolean;
  accessCard: boolean;
  policyAcknowledgment: boolean;
  ndaSigned: boolean;
  securityTraining: boolean;
  toolsTraining: boolean;
}

export interface DocumentStatus {
  id: string;
  label: string;
  required: boolean;
  status: 'pending' | 'uploaded';
}