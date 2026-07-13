import { Donor, BloodGroup, FamilyMember, EmergencyRequest } from "../types";

// High fidelity dataset of registered blood donors in the Anand & neighbouring state area
export const INITIAL_DONORS: Donor[] = [
  {
    id: "donor-1",
    name: "Rahul Patel",
    bloodGroup: "O+",
    age: 26,
    location: "Anand Town Hall",
    distanceKm: 1.2,
    lastDonationDate: "4 months ago",
    lastDonationWeeksAgo: 17,
    previousDonationsCount: 6,
    responseRate: 0.96,
    availability: "Available Now",
    phone: "+91 98765 43210"
  },
  {
    id: "donor-2",
    name: "Neha Shah",
    bloodGroup: "O-",
    age: 29,
    location: "Vallabh Vidyanagar",
    distanceKm: 2.5,
    lastDonationDate: "6 months ago",
    lastDonationWeeksAgo: 26,
    previousDonationsCount: 4,
    responseRate: 0.92,
    availability: "Available Now",
    phone: "+91 94281 81920"
  },
  {
    id: "donor-3",
    name: "Savan Mehta",
    bloodGroup: "B+",
    age: 32,
    location: "Karamsad",
    distanceKm: 4.8,
    lastDonationDate: "2 months ago",
    lastDonationWeeksAgo: 8, // Just eligible (exactly 8 weeks wait period)
    previousDonationsCount: 8,
    responseRate: 0.88,
    availability: "Available Now",
    phone: "+91 97255 12093"
  },
  {
    id: "donor-4",
    name: "Anjali Desai",
    bloodGroup: "A+",
    age: 24,
    location: "Mota Bazaar",
    distanceKm: 1.9,
    lastDonationDate: "1 month ago",
    lastDonationWeeksAgo: 4, // INELIGIBLE - Wait period is 56 days (8 weeks)
    previousDonationsCount: 2,
    responseRate: 0.85,
    availability: "Available Now",
    phone: "+91 99245 87612"
  },
  {
    id: "donor-5",
    name: "Amit Sharma",
    bloodGroup: "A-",
    age: 34,
    location: "Changa Road",
    distanceKm: 8.5,
    lastDonationDate: "5 months ago",
    lastDonationWeeksAgo: 21,
    previousDonationsCount: 5,
    responseRate: 0.82,
    availability: "Within 24 Hours",
    phone: "+91 96012 34567"
  },
  {
    id: "donor-6",
    name: "Priya Rao",
    bloodGroup: "AB+",
    age: 27,
    location: "Adas Road",
    distanceKm: 5.2,
    lastDonationDate: "8 months ago",
    lastDonationWeeksAgo: 34,
    previousDonationsCount: 3,
    responseRate: 0.79,
    availability: "Available Now",
    phone: "+91 98980 11223"
  },
  {
    id: "donor-7",
    name: "Vikram Singh",
    bloodGroup: "B-",
    age: 41,
    location: "Mogri",
    distanceKm: 3.6,
    lastDonationDate: "10 months ago",
    lastDonationWeeksAgo: 43,
    previousDonationsCount: 9,
    responseRate: 0.91,
    availability: "Available Now",
    phone: "+91 94255 00998"
  },
  {
    id: "donor-8",
    name: "Kunal Trivedi",
    bloodGroup: "O+",
    age: 30,
    location: "Bakrol Complex",
    distanceKm: 3.1,
    lastDonationDate: "3 months ago",
    lastDonationWeeksAgo: 13,
    previousDonationsCount: 12,
    responseRate: 0.94,
    availability: "Available Now",
    phone: "+91 81400 90901"
  },
  {
    id: "donor-9",
    name: "Aditi Joshi",
    bloodGroup: "O-",
    age: 23,
    location: "Lambhvel",
    distanceKm: 6.0,
    lastDonationDate: "Never",
    lastDonationWeeksAgo: 999, // fully eligible
    previousDonationsCount: 0,
    responseRate: 1.00, // Excited first-timer
    availability: "Within 24 Hours",
    phone: "+91 99049 88122"
  },
  {
    id: "donor-10",
    name: "Rajesh Vyas",
    bloodGroup: "AB-",
    age: 45,
    location: "Vadtal Road",
    distanceKm: 9.1,
    lastDonationDate: "4 months ago",
    lastDonationWeeksAgo: 18,
    previousDonationsCount: 7,
    responseRate: 0.84,
    availability: "Available Now",
    phone: "+91 94082 12110"
  },
  {
    id: "donor-11",
    name: "Darshan Gajiwala",
    bloodGroup: "A+",
    age: 31,
    location: "Ganesh Crossing",
    distanceKm: 0.8,
    lastDonationDate: "5 months ago",
    lastDonationWeeksAgo: 22,
    previousDonationsCount: 11,
    responseRate: 0.98,
    availability: "Available Now",
    phone: "+91 98251 77665"
  },
  {
    id: "donor-12",
    name: "Ishita Parekh",
    bloodGroup: "B+",
    age: 28,
    location: "Amul Dairy Road",
    distanceKm: 1.5,
    lastDonationDate: "2 weeks ago",
    lastDonationWeeksAgo: 2, // INELIGIBLE
    previousDonationsCount: 1,
    responseRate: 0.45,
    availability: "Available Now",
    phone: "+91 97120 44332"
  }
];

// Blood compatibility matrices
// Map key indicates candidate recipient blood type, value is list of acceptable donor types
export const CAN_RECEIVE_FROM: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-"],
  "O+": ["O+", "O-"],
  "A-": ["A-", "O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]
};

// Map key indicates donor blood type, value is list of recipient types who can handle it
export const CAN_DONATE_TO: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"]
};

/**
 * AI-powered prediction and multi-criteria ranking model that calculates:
 * 1. Eligibility wait status (RBC must be restored, requires >= 8 weeks spacing)
 * 2. Simulated Random Forest/XGBoost Availability prediction probability score
 * 3. Final Multi-criteria rank score based on: Availability, Distance, Response Score, and Medical Safety Wait.
 */
export function predictDonorMetrics(donor: Donor, targetGroup: BloodGroup): {
  isMedicallyEligible: boolean;
  medicalEligibilityReason: string;
  responseProbability: number; // calculated machine learning model probability (0-100%)
  overallRankScore: number; // composite ML rating (0-100)
} {
  // 1. Check medical eligibility first
  // It takes 8 weeks (approx. 56 days) for RBC components to replenish fully.
  const isMedicallyEligible = donor.lastDonationWeeksAgo >= 8;
  const medicalEligibilityReason = isMedicallyEligible 
    ? "Fully prepared and medically safe to donate blood components." 
    : `Replenishing red blood cells. Requires ${8 - donor.lastDonationWeeksAgo} more weeks or customized medical approval.`;

  // 2. Machine Learning Response Probability (Simulating random forest tree classifier)
  // Evaluates factors: previousDonationsCount, pastResponseRate, distance, time since last donation
  let probability = donor.responseRate * 100;

  // Age factors (peak energetic donors weigh higher)
  if (donor.age >= 22 && donor.age <= 35) {
    probability += 4;
  } else {
    probability -= 2;
  }

  // Distance penalty (longer distances reduce quick-response likelihood during emergencies)
  const distancePenalty = donor.distanceKm * 1.5;
  probability -= distancePenalty;

  // Wait time premium (the longer they haven't donated, the more rested they are and ready to say yes)
  if (donor.lastDonationWeeksAgo > 16) {
    probability += 5;
  }

  // Bound to reasonable probability limits
  const responseProbability = Math.max(30, Math.min(99, Math.round(probability)));

  // 3. Multi-Criteria Smart Donor Ranking Score
  // Score = (Availability * 40) + (Distance Weight * 30) + (Response Probability Weight * 30)
  // Medically ineligible donors are penalized (reduced by 60% of total potential)
  const availabilityMultiplier = donor.availability === "Available Now" ? 1.0 : 0.5;
  const availabilityScorePart = availabilityMultiplier * 40;

  const distanceScorePart = Math.max(0, 1 - (donor.distanceKm / 15)) * 30;
  const probabilityScorePart = (responseProbability / 100) * 30;

  let totalScore = availabilityScorePart + distanceScorePart + probabilityScorePart;
  
  if (!isMedicallyEligible) {
    totalScore *= 0.3; // Medically unsafe donors rank very low
  }

  return {
    isMedicallyEligible,
    medicalEligibilityReason,
    responseProbability: isMedicallyEligible ? responseProbability : 15, // Low interaction likelihood if restricted
    overallRankScore: Math.round(totalScore)
  };
}

// LocalStorage loaders/savers for interactive customized persistence
export function getStoredFamilyMembers(): FamilyMember[] {
  const data = localStorage.getItem("lifeflow_family_vault");
  if (!data) {
    // Return standard preset
    const preset: FamilyMember[] = [
      {
        id: "fam-1",
        name: "Sanjay Patel",
        bloodGroup: "B+",
        age: 58,
        relationship: "Father",
        medicalNotes: "Hypertensive, controlled with beta-blockers",
        emergencyContact: "+91 98250 11223"
      },
      {
        id: "fam-2",
        name: "Minaxi Patel",
        bloodGroup: "O-",
        age: 54,
        relationship: "Mother",
        medicalNotes: "History of mild anemia",
        emergencyContact: "+91 98250 11224"
      },
      {
        id: "fam-3",
        name: "Karan Patel",
        bloodGroup: "A+",
        age: 21,
        relationship: "Brother",
        medicalNotes: "No chronic conditions",
        emergencyContact: "+91 99240 55667"
      }
    ];
    localStorage.setItem("lifeflow_family_vault", JSON.stringify(preset));
    return preset;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveFamilyMembers(members: FamilyMember[]) {
  localStorage.setItem("lifeflow_family_vault", JSON.stringify(members));
}

export function getStoredEmergencyRequests(): EmergencyRequest[] {
  const data = localStorage.getItem("lifeflow_emergency_requests");
  if (!data) {
    const preset: EmergencyRequest[] = [
      {
        id: "req-1",
        patientName: "Ramesh Bhai Patel",
        bloodGroup: "O-",
        hospital: "Krishna Shalby Hospital, Anand",
        urgency: "Critical (Immediate)",
        unitsNeeded: 3,
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hrs ago
        status: "Sourced"
      },
      {
        id: "req-2",
        patientName: "Meenaben Parmar",
        bloodGroup: "A+",
        hospital: "Zydus Hospital, Anand",
        urgency: "High (Within 6 Hrs)",
        unitsNeeded: 2,
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 hrs ago
        status: "Completed"
      }
    ];
    localStorage.setItem("lifeflow_emergency_requests", JSON.stringify(preset));
    return preset;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveEmergencyRequests(requests: EmergencyRequest[]) {
  localStorage.setItem("lifeflow_emergency_requests", JSON.stringify(requests));
}
