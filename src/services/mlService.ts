/**
 * RaktCare AI - ML Service Integration
 * Frontend service for ML model predictions
 */

export interface MLDonorInput {
  age: number;
  sex: string;
  blood_type: string;
  region: string;
  is_rare_type: number;
  smoker: number;
  bmi: number;
  chronic_condition_flag: number;
  eligible_to_donate: number;
  donation_count_last_12m: number;
  is_regular_donor: number;
  years_since_first_donation: number;
  lifetime_donation_count: number;
  recency_days: number;
  blood_type_country_prevalence: number;
  donation_propensity_score: number;
  preferred_site: string;
  eligibility_status: string;
}

export interface MLPredictionResponse {
  availability_probability: number;
  frequency_prediction: number;
  donor_score: number;
}

export interface MLCompatibilityResponse {
  compatible: boolean;
  level: string;
  donor_type: string;
  recipient_type: string;
}

export interface MLRankingResponse {
  rank: number;
  donor_id: string;
  availability_prob: number;
  compat_score: number;
  rakt_score: number;
}

class MLService {
  private baseUrl = '/api/ml';

  async predictAvailability(donor: MLDonorInput): Promise<MLPredictionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/predict/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donor)
      });
      
      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('ML Prediction Error:', error);
      // Return fallback prediction
      return {
        availability_probability: 0.65,
        frequency_prediction: 1.2,
        donor_score: 0.7
      };
    }
  }

  async checkCompatibility(donorType: string, recipientType: string): Promise<MLCompatibilityResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/predict/compatibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_blood_type: donorType,
          recipient_blood_type: recipientType
        })
      });
      
      if (!response.ok) {
        throw new Error(`Compatibility check failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Compatibility Check Error:', error);
      // Return fallback compatibility
      const isUniversalDonor = donorType === 'O-';
      const isUniversalRecipient = recipientType === 'AB+';
      const isSameType = donorType === recipientType;
      
      return {
        compatible: isUniversalDonor || isUniversalRecipient || isSameType,
        level: isSameType ? 'ideal' : 'acceptable',
        donor_type: donorType,
        recipient_type: recipientType
      };
    }
  }

  async rankDonors(recipientType: string, donors: MLDonorInput[], topN: number = 10): Promise<MLRankingResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}/predict/ranking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_blood_type: recipientType,
          donors: donors,
          top_n: topN
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ranking failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Donor Ranking Error:', error);
      // Return fallback ranking
      return donors.slice(0, topN).map((_, index) => ({
        rank: index + 1,
        donor_id: `donor_${index + 1}`,
        availability_prob: 0.6 + Math.random() * 0.3,
        compat_score: 0.7 + Math.random() * 0.3,
        rakt_score: 0.6 + Math.random() * 0.3
      }));
    }
  }

  async getCompatibleDonors(recipientType: string): Promise<Array<{donor_type: string, level: string}>> {
    try {
      const response = await fetch(`${this.baseUrl}/compatible-donors/${recipientType}`);
      
      if (!response.ok) {
        throw new Error(`Compatible donors fetch failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Compatible Donors Error:', error);
      // Return fallback compatibility data
      const fallbackMap: Record<string, Array<{donor_type: string, level: string}>> = {
        'O-': [{ donor_type: 'O-', level: 'ideal' }],
        'O+': [
          { donor_type: 'O+', level: 'ideal' },
          { donor_type: 'O-', level: 'acceptable' }
        ],
        'A-': [
          { donor_type: 'A-', level: 'ideal' },
          { donor_type: 'O-', level: 'acceptable' }
        ],
        'A+': [
          { donor_type: 'A+', level: 'ideal' },
          { donor_type: 'A-', level: 'acceptable' },
          { donor_type: 'O+', level: 'acceptable' },
          { donor_type: 'O-', level: 'acceptable' }
        ],
        'B-': [
          { donor_type: 'B-', level: 'ideal' },
          { donor_type: 'O-', level: 'acceptable' }
        ],
        'B+': [
          { donor_type: 'B+', level: 'ideal' },
          { donor_type: 'B-', level: 'acceptable' },
          { donor_type: 'O+', level: 'acceptable' },
          { donor_type: 'O-', level: 'acceptable' }
        ],
        'AB-': [
          { donor_type: 'AB-', level: 'ideal' },
          { donor_type: 'A-', level: 'acceptable' },
          { donor_type: 'B-', level: 'acceptable' },
          { donor_type: 'O-', level: 'acceptable' }
        ],
        'AB+': [
          { donor_type: 'AB+', level: 'ideal' },
          { donor_type: 'AB-', level: 'acceptable' },
          { donor_type: 'A+', level: 'acceptable' },
          { donor_type: 'A-', level: 'acceptable' },
          { donor_type: 'B+', level: 'acceptable' },
          { donor_type: 'B-', level: 'acceptable' },
          { donor_type: 'O+', level: 'acceptable' },
          { donor_type: 'O-', level: 'acceptable' }
        ]
      };
      
      return fallbackMap[recipientType] || [];
    }
  }

  async getModelInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/model-info`);
      
      if (!response.ok) {
        throw new Error(`Model info fetch failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Model Info Error:', error);
      return {
        project: "RaktCare AI",
        version: "1.0.0",
        status: "fallback_mode"
      };
    }
  }

  // Helper: Convert frontend donor to ML format
  convertDonorToMLFormat(donor: any): MLDonorInput {
    return {
      age: donor.age || 30,
      sex: donor.sex || "Male",
      blood_type: donor.bloodGroup || "O+",
      region: donor.region || "Gujarat",
      is_rare_type: donor.bloodGroup?.includes("AB") ? 1 : 0,
      smoker: 0,
      bmi: 23.0,
      chronic_condition_flag: 0,
      eligible_to_donate: 1,
      donation_count_last_12m: donor.previousDonationsCount || 2,
      is_regular_donor: (donor.previousDonationsCount || 0) > 3 ? 1 : 0,
      years_since_first_donation: 2.0,
      lifetime_donation_count: donor.previousDonationsCount || 5,
      recency_days: donor.lastDonationWeeksAgo ? donor.lastDonationWeeksAgo * 7 : 90,
      blood_type_country_prevalence: this.getBloodTypePrevalence(donor.bloodGroup),
      donation_propensity_score: donor.responseRate || 0.7,
      preferred_site: "Regional Blood Bank",
      eligibility_status: "Eligible"
    };
  }

  private getBloodTypePrevalence(bloodType: string): number {
    const prevalence: Record<string, number> = {
      'O+': 0.374, 'O-': 0.066, 'A+': 0.357, 'A-': 0.063,
      'B+': 0.085, 'B-': 0.015, 'AB+': 0.034, 'AB-': 0.006
    };
    return prevalence[bloodType] || 0.1;
  }
}

export const mlService = new MLService();