export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  location: string;
  distanceKm: number;
  lastDonationDate: string;
  lastDonationWeeksAgo: number;
  previousDonationsCount: number;
  responseRate: number; // 0 to 1 scale
  availability: 'Available Now' | 'Within 24 Hours';
  phone: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  age: number;
  relationship: 'Father' | 'Mother' | 'Brother' | 'Sister' | 'Spouse' | 'Child' | 'Other';
  medicalNotes?: string;
  emergencyContact: string;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  hospital: string;
  urgency: 'Critical (Immediate)' | 'High (Within 6 Hrs)' | 'Standard (Within 24 Hrs)';
  unitsNeeded: number;
  timestamp: string;
  status: 'Pending' | 'Sourced' | 'Completed';
  matchedDonorsResultCount?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
