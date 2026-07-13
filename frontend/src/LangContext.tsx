import React, { createContext, useContext, useState } from "react";

export type Lang = "en" | "hi" | "gu";

export const translations = {
  en: {
    // App
    appName: "RaktCare AI",
    tagline: "SMART BLOOD DONOR ECOSYSTEM",

    // Nav
    dashboardHome: "Dashboard Home",
    donorFinder: "Smart Donor Finder",
    healthPassport: "Donor Health Passport",
    familyVault: "Family Emergency Vault",
    emergencySOS: "Active Emergency SOS",
    compatibility: "Compatibility Graph",
    awareness: "Awareness & Myths",
    analytics: "Diagnostic Analytics",
    assistant: "RaktCare Smart AI",

    // Landing
    scrollDashboard: "SCROLL DOWN TO DASHBOARD",
    returnSplash: "↑ Return to Splash",

    // Hero buttons
    findDonor: "Find Donor",
    sosRequest: "SOS Request",
    becomeDonor: "Become Donor",
    learnDonation: "Learn Donation",

    // Dashboard stats
    availableDonors: "Available Donors Today",
    clinicalDeficits: "Clinical Deficits",
    bioUnitsSourced: "Bio-Units Sourced",
    activeSOS: "Active SOS",

    // Home widgets
    emergencySOSList: "Emergency SOS List",
    configureSOS: "Configure SOS",
    compatibilityThresholds: "Compatibility Thresholds",
    exploreGraph: "Explore Graph",
    logEmergency: "LOG EMERGENCY SIGNAL",

    // Donor Search / Passport
    local: "Local (State)",
    global: "Global (All India)",
    bloodGroup: "Blood Group",
    state: "State",
    city: "City",
    allGroups: "All Groups",
    allCities: "All Cities",
    found: "Found",
    donors: "donors",
    searchName: "Search name...",
    requestDonor: "Request Donor",
    export: "Export",
    noMatchSearch: "No donors found. Try changing filters.",

    // Donor card stats
    raktScore: "RaktScore",
    hemoglobin: "Hb g/dL",
    weight: "Weight",
    donations: "Donations",
    eligible: "Eligible to Donate",
    notEligible: "Not Eligible",

    // Passport modal
    close: "Close",
    exportPassport: "Export Passport",

    // Dispatch modal
    abort: "Abort",
    confirmSourced: "Confirm Sourced",

    // Pagination
    page: "Page",
    of: "of",

    // Emergency Register
    activeEmergencyRequests: "Active Emergency Requests",
    logSosAlert: "LOG SOS ALERT",
    broadcastSOS: "Broadcast SOS",
    cancel: "Cancel",
    markSourced: "MARK SOURCED",
    markResolved: "MARK RESOLVED",
    reopenConflict: "REOPEN CONFLICT",
    compatibleDonorPool: "Compatible Donor Pool:",
    allClearSynced: "All queues clear & synchronized",

    // Family Vault
    familyEmergencyVault: "Family Emergency Vault",
    secureFiles: "SECURE FILES",
    protectRecord: "Protect Record",
    findDonors: "FIND DONORS",
    vaultEmpty: "Vault Empty & Decoupled",
    noFamilyRecords: "No family health records registered.",

    // Compatibility Chart
    bloodCompatibilityVisualizer: "Blood Compatibility Visualizer",
    canReceiveFrom: "CAN RECEIVE FROM",
    canDonateTo: "CAN DONATE TO",
    selectedType: "Selected Type",
    canDonateToSelected: "Can Donate to Selected",
    canReceiveFromSelected: "Can Receive from Selected",

    // Awareness Hub
    awarenessHub: "Awareness & Rehabilitation Hub",
    mythVsFact: "Myth vs Fact",
    bodyRecovery: "Body Recovery",
    animatedTimeline: "Animated Timeline",
    commonMyth: "COMMON MYTH",
    biologicalFact: "BIOLOGICAL FACT",
    prev: "Prev",
    nextFact: "Next Fact",
    recoveryRatio: "Recovery Ratio:",

    // Analytics Hub
    mlModelPerformance: "ML Model Performance",
    demandIndex: "Demand Index (Shortage %)",
    weeklyTrends: "Weekly Inflow/Outflow Trends",
    emergencyHotspot: "Emergency Hotspot Grid",
    systemForecast: "System Forecast",
    peakDemandGroup: "Peak Demand Group",
    weeklySourcingUnits: "Weekly Sourced Units",
    regionalActiveDonors: "Regional Active Donors",

    // Assistant Chat
    raktcoreCoreAI: "RaktCare Core AI",
    expertMedicalGrounding: "Expert Medical Grounding",
    askPlaceholder: "Ask RaktCare AI (e.g. Does medication disqualify me?)...",
    welcomeMessage: "Welcome to **RaktCare AI Assistant**. I am linked with your core clinic documentation. Ask me anything about biocompatibility thresholds, Red Cell (Erythropoietin) replacement rates, or donation general safety guidelines!",

    // Gamification
    donorGamificationHub: "Donor Gamification Hub",
    leaderboard: "🏆 Leaderboard",
    badges: "🎖️ Badges",
    donorsRanked: "Donors Ranked",
    championsPlus: "Champions+",
    streak: "streak",
    pts: "pts",

    // Post Donation Monitoring
    postDonationMonitoring: "Post-Donation Health Monitoring",
    donorRecoveryTracking: "Donor recovery tracking · 8-week re-donation safety",
    allDonors: "All Donors",
    critical: "Critical",
    monitoring: "Monitoring",
    recovering: "Recovering",
    safe: "Safe",
    nextEligible: "Next eligible:",
    readyNow: "Ready Now ✓",
    symptoms: "Symptoms",
    fatigue: "Fatigue:",
    dizziness: "Dizziness:",
    supplements: "Supplements",
    dietTips: "Diet Tips",
    scheduleFollowUp: "Schedule Follow-Up Call",

    // Shortage Forecasting
    bloodShortageForecasting: "Blood Shortage Forecasting",
    xgboostForecast: "XGBoost 7-day demand forecast · per blood group",
    criticalCount: "Critical",
    highRisk: "High Risk",
    stable: "Stable",
    day7Forecast: "Day 7 forecast:",
    units: "units",
    currentStock: "Current stock:",
    dailyDemand: "Daily demand:",

    // Notification Toast
    remoteIngressSOS: "REMOTE INGRESS SOS",
    newPushNotification: "New Push notification",
    matchDonorsNow: "Match Donors Now",
    dismiss: "Dismiss",
    simulateSOS: "Simulate SOS Ingress",
    closeControl: "Close Control",
  },

  hi: {
    appName: "रक्तकेयर AI",
    tagline: "स्मार्ट रक्तदाता पारिस्थितिकी तंत्र",

    dashboardHome: "डैशबोर्ड होम",
    donorFinder: "स्मार्ट डोनर खोजक",
    healthPassport: "डोनर स्वास्थ्य पासपोर्ट",
    familyVault: "पारिवारिक आपातकालीन वॉल्ट",
    emergencySOS: "सक्रिय आपातकालीन SOS",
    compatibility: "संगतता ग्राफ",
    awareness: "जागरूकता और मिथक",
    analytics: "डायग्नोस्टिक एनालिटिक्स",
    assistant: "रक्तकेयर स्मार्ट AI",

    scrollDashboard: "डैशबोर्ड तक स्क्रॉल करें",
    returnSplash: "↑ स्प्लैश पर वापस",

    findDonor: "डोनर खोजें",
    sosRequest: "SOS अनुरोध",
    becomeDonor: "डोनर बनें",
    learnDonation: "दान सीखें",

    availableDonors: "आज उपलब्ध डोनर",
    clinicalDeficits: "क्लिनिकल कमी",
    bioUnitsSourced: "बायो-यूनिट प्राप्त",
    activeSOS: "सक्रिय SOS",

    emergencySOSList: "आपातकालीन SOS सूची",
    configureSOS: "SOS कॉन्फ़िगर करें",
    compatibilityThresholds: "संगतता सीमाएं",
    exploreGraph: "ग्राफ देखें",
    logEmergency: "आपातकालीन संकेत दर्ज करें",

    local: "स्थानीय (राज्य)",
    global: "वैश्विक (पूरा भारत)",
    bloodGroup: "रक्त समूह",
    state: "राज्य",
    city: "शहर",
    allGroups: "सभी समूह",
    allCities: "सभी शहर",
    found: "मिले",
    donors: "डोनर",
    searchName: "नाम खोजें...",
    requestDonor: "डोनर अनुरोध",
    export: "निर्यात",
    noMatchSearch: "कोई डोनर नहीं मिला। फ़िल्टर बदलें।",

    raktScore: "रक्तस्कोर",
    hemoglobin: "Hb g/dL",
    weight: "वजन",
    donations: "दान",
    eligible: "दान के योग्य",
    notEligible: "योग्य नहीं",

    close: "बंद करें",
    exportPassport: "पासपोर्ट निर्यात करें",

    abort: "रद्द करें",
    confirmSourced: "स्रोत की पुष्टि करें",

    page: "पृष्ठ",
    of: "का",

    activeEmergencyRequests: "सक्रिय आपातकालीन अनुरोध",
    logSosAlert: "SOS अलर्ट दर्ज करें",
    broadcastSOS: "SOS प्रसारित करें",
    cancel: "रद्द करें",
    markSourced: "स्रोत चिह्नित करें",
    markResolved: "हल चिह्नित करें",
    reopenConflict: "पुनः खोलें",
    compatibleDonorPool: "संगत डोनर पूल:",
    allClearSynced: "सभी कतारें साफ और सिंक्रनाइज़",

    familyEmergencyVault: "पारिवारिक आपातकालीन वॉल्ट",
    secureFiles: "फ़ाइलें सुरक्षित करें",
    protectRecord: "रिकॉर्ड सुरक्षित करें",
    findDonors: "डोनर खोजें",
    vaultEmpty: "वॉल्ट खाली है",
    noFamilyRecords: "कोई पारिवारिक स्वास्थ्य रिकॉर्ड नहीं।",

    bloodCompatibilityVisualizer: "रक्त संगतता विज़ुअलाइज़र",
    canReceiveFrom: "से प्राप्त कर सकते हैं",
    canDonateTo: "को दान कर सकते हैं",
    selectedType: "चयनित प्रकार",
    canDonateToSelected: "चयनित को दान कर सकते हैं",
    canReceiveFromSelected: "चयनित से प्राप्त कर सकते हैं",

    awarenessHub: "जागरूकता और पुनर्वास केंद्र",
    mythVsFact: "मिथक बनाम तथ्य",
    bodyRecovery: "शरीर की रिकवरी",
    animatedTimeline: "एनिमेटेड टाइमलाइन",
    commonMyth: "सामान्य मिथक",
    biologicalFact: "जैविक तथ्य",
    prev: "पिछला",
    nextFact: "अगला तथ्य",
    recoveryRatio: "रिकवरी अनुपात:",

    mlModelPerformance: "ML मॉडल प्रदर्शन",
    demandIndex: "मांग सूचकांक (कमी %)",
    weeklyTrends: "साप्ताहिक प्रवाह/बहिर्वाह रुझान",
    emergencyHotspot: "आपातकालीन हॉटस्पॉट ग्रिड",
    systemForecast: "सिस्टम पूर्वानुमान",
    peakDemandGroup: "पीक डिमांड ग्रुप",
    weeklySourcingUnits: "साप्ताहिक स्रोत इकाइयां",
    regionalActiveDonors: "क्षेत्रीय सक्रिय डोनर",

    raktcoreCoreAI: "रक्तकेयर कोर AI",
    expertMedicalGrounding: "विशेषज्ञ चिकित्सा आधार",
    askPlaceholder: "रक्तकेयर AI से पूछें...",
    welcomeMessage: "**रक्तकेयर AI असिस्टेंट** में आपका स्वागत है। रक्त दान के बारे में कुछ भी पूछें!",

    donorGamificationHub: "डोनर गेमिफिकेशन हब",
    leaderboard: "🏆 लीडरबोर्ड",
    badges: "🎖️ बैज",
    donorsRanked: "डोनर रैंक किए गए",
    championsPlus: "चैंपियन+",
    streak: "स्ट्रीक",
    pts: "अंक",

    postDonationMonitoring: "दान के बाद स्वास्थ्य निगरानी",
    donorRecoveryTracking: "डोनर रिकवरी ट्रैकिंग · 8-सप्ताह पुनः दान सुरक्षा",
    allDonors: "सभी डोनर",
    critical: "गंभीर",
    monitoring: "निगरानी",
    recovering: "रिकवरी",
    safe: "सुरक्षित",
    nextEligible: "अगली पात्रता:",
    readyNow: "अभी तैयार ✓",
    symptoms: "लक्षण",
    fatigue: "थकान:",
    dizziness: "चक्कर:",
    supplements: "सप्लीमेंट",
    dietTips: "आहार सुझाव",
    scheduleFollowUp: "फॉलो-अप कॉल शेड्यूल करें",

    bloodShortageForecasting: "रक्त की कमी का पूर्वानुमान",
    xgboostForecast: "XGBoost 7-दिन मांग पूर्वानुमान · प्रति रक्त समूह",
    criticalCount: "गंभीर",
    highRisk: "उच्च जोखिम",
    stable: "स्थिर",
    day7Forecast: "दिन 7 पूर्वानुमान:",
    units: "इकाइयां",
    currentStock: "वर्तमान स्टॉक:",
    dailyDemand: "दैनिक मांग:",

    remoteIngressSOS: "रिमोट SOS",
    newPushNotification: "नई पुश अधिसूचना",
    matchDonorsNow: "अभी डोनर मिलाएं",
    dismiss: "खारिज करें",
    simulateSOS: "SOS सिमुलेट करें",
    closeControl: "नियंत्रण बंद करें",
  },

  gu: {
    appName: "રક્તકેર AI",
    tagline: "સ્માર્ટ રક્તદાતા ઇકોસિસ્ટમ",

    dashboardHome: "ડેશબોર્ડ હોમ",
    donorFinder: "સ્માર્ટ ડોનર શોધક",
    healthPassport: "ડોનર આરોગ્ય પાસપોર્ટ",
    familyVault: "પારિવારિક કટોકટી વૉલ્ટ",
    emergencySOS: "સક્રિય કટોકટી SOS",
    compatibility: "સુસંગતતા ગ્રાફ",
    awareness: "જાગૃતિ અને દંતકથાઓ",
    analytics: "ડાયગ્નોસ્ટિક એનાલિટિક્સ",
    assistant: "રક્તકેર સ્માર્ટ AI",

    scrollDashboard: "ડેશબોર્ડ સુધી સ્ક્રોલ કરો",
    returnSplash: "↑ સ્પ્લેશ પર પાછા",

    findDonor: "ડોનર શોધો",
    sosRequest: "SOS વિનંતી",
    becomeDonor: "ડોનર બનો",
    learnDonation: "દાન શીખો",

    availableDonors: "આજે ઉપલબ્ધ ડોનર",
    clinicalDeficits: "ક્લિનિકલ ઘટ",
    bioUnitsSourced: "બાયો-યુનિટ મેળવ્યા",
    activeSOS: "સક્રિય SOS",

    emergencySOSList: "કટોકટી SOS યાદી",
    configureSOS: "SOS ગોઠવો",
    compatibilityThresholds: "સુસંગતતા મર્યાદા",
    exploreGraph: "ગ્રાફ જુઓ",
    logEmergency: "કટોકટી સંકેત નોંધો",

    local: "સ્થાનિક (રાજ્ય)",
    global: "વૈશ્વિક (સમગ્ર ભારત)",
    bloodGroup: "રક્ત જૂથ",
    state: "રાજ્ય",
    city: "શહેર",
    allGroups: "બધા જૂથ",
    allCities: "બધા શહેર",
    found: "મળ્યા",
    donors: "ડોનર",
    searchName: "નામ શોધો...",
    requestDonor: "ડોનર વિનંતી",
    export: "નિકાસ",
    noMatchSearch: "કોઈ ડોનર મળ્યા નહીં. ફિલ્ટર બદલો.",

    raktScore: "રક્તસ્કોર",
    hemoglobin: "Hb g/dL",
    weight: "વજન",
    donations: "દાન",
    eligible: "દાન માટે પાત્ર",
    notEligible: "પાત્ર નથી",

    close: "બંધ કરો",
    exportPassport: "પાસપોર્ટ નિકાસ કરો",

    abort: "રદ કરો",
    confirmSourced: "સ્ત્રોત પુષ્ટિ કરો",

    page: "પૃષ્ઠ",
    of: "નો",

    activeEmergencyRequests: "સક્રિય કટોકટી વિનંતીઓ",
    logSosAlert: "SOS એલર્ટ નોંધો",
    broadcastSOS: "SOS પ્રસારિત કરો",
    cancel: "રદ કરો",
    markSourced: "સ્ત્રોત ચિહ્નિત કરો",
    markResolved: "ઉકેલ ચિહ્નિત કરો",
    reopenConflict: "ફરી ખોલો",
    compatibleDonorPool: "સુસંગત ડોનર પૂલ:",
    allClearSynced: "બધી કતારો સ્પષ્ટ અને સિંક્રનાઇઝ",

    familyEmergencyVault: "પારિવારિક કટોકટી વૉલ્ટ",
    secureFiles: "ફાઇલો સુરક્ષિત કરો",
    protectRecord: "રેકોર્ડ સુરક્ષિત કરો",
    findDonors: "ડોનર શોધો",
    vaultEmpty: "વૉલ્ટ ખાલી છે",
    noFamilyRecords: "કોઈ પારિવારિક આરોગ્ય રેકોર્ડ નથી.",

    bloodCompatibilityVisualizer: "રક્ત સુસંગતતા વિઝ્યુઅલાઇઝર",
    canReceiveFrom: "પ્રાપ્ત કરી શકે છે",
    canDonateTo: "દાન કરી શકે છે",
    selectedType: "પસંદ કરેલ પ્રકાર",
    canDonateToSelected: "પસંદ કરેલને દાન કરી શકે",
    canReceiveFromSelected: "પસંદ કરેલ પાસેથી મેળવી શકે",

    awarenessHub: "જાગૃતિ અને પુનર્વસન કેન્દ્ર",
    mythVsFact: "દંતકથા વિ. હકીકત",
    bodyRecovery: "શરીર પુનઃપ્રાપ્તિ",
    animatedTimeline: "એનિમેટેડ ટાઇમલાઇન",
    commonMyth: "સામાન્ય દંતકથા",
    biologicalFact: "જૈવિક હકીકત",
    prev: "પાછળ",
    nextFact: "આગળની હકીકત",
    recoveryRatio: "પુનઃપ્રાપ્તિ ગુણોત્તર:",

    mlModelPerformance: "ML મોડેલ પ્રદર્શન",
    demandIndex: "માંગ સૂચકાંક (ઘટ %)",
    weeklyTrends: "સાપ્તાહિક પ્રવાહ/બહિઃપ્રવાહ વલણ",
    emergencyHotspot: "કટોકટી હૉટસ્પૉટ ગ્રિડ",
    systemForecast: "સિસ્ટમ પૂર્વાનુમાન",
    peakDemandGroup: "પીક ડિમાન્ડ ગ્રૂપ",
    weeklySourcingUnits: "સાપ્તાહિક સ્ત્રોત એકમો",
    regionalActiveDonors: "પ્રાદેશિક સક્રિય ડોનર",

    raktcoreCoreAI: "રક્તકેર કોર AI",
    expertMedicalGrounding: "નિષ્ણાત તબીબી આધાર",
    askPlaceholder: "રક્તકેર AI ને પૂછો...",
    welcomeMessage: "**રક્તકેર AI આસિસ્ટન્ટ** માં આપનું સ્વાગત છે. રક્ત દાન વિશે કંઈ પણ પૂછો!",

    donorGamificationHub: "ડોનર ગેમિફિકેશન હબ",
    leaderboard: "🏆 લીડરબોર્ડ",
    badges: "🎖️ બેજ",
    donorsRanked: "ડોનર ક્રમાંકિત",
    championsPlus: "ચેમ્પિયન+",
    streak: "સ્ટ્રીક",
    pts: "પૉઇન્ટ",

    postDonationMonitoring: "દાન પછી આરોગ્ય નિગરાની",
    donorRecoveryTracking: "ડોનર પુનઃપ્રાપ્તિ ટ્રેકિંગ · 8-સપ્તાહ પુનઃ દાન સુરક્ષા",
    allDonors: "બધા ડોનર",
    critical: "ગંભીર",
    monitoring: "નિગરાની",
    recovering: "પુનઃપ્રાપ્તિ",
    safe: "સુરક્ષિત",
    nextEligible: "આગળની પાત્રતા:",
    readyNow: "હવે તૈયાર ✓",
    symptoms: "લક્ષણો",
    fatigue: "થાક:",
    dizziness: "ચક્કર:",
    supplements: "સપ્લિમેન્ટ",
    dietTips: "આહાર સૂચનો",
    scheduleFollowUp: "ફૉલો-અપ કૉલ શેડ્યૂલ કરો",

    bloodShortageForecasting: "રક્ત અછત પૂર્વાનુમાન",
    xgboostForecast: "XGBoost 7-દિવસ માંગ પૂર્વાનુમાન · પ્રતિ રક્ત જૂથ",
    criticalCount: "ગંભીર",
    highRisk: "ઉચ્ચ જોખમ",
    stable: "સ્થિર",
    day7Forecast: "દિવસ 7 પૂર્વાનુમાન:",
    units: "એકમો",
    currentStock: "વર્તમાન સ્ટૉક:",
    dailyDemand: "દૈનિક માંગ:",

    remoteIngressSOS: "રિમોટ SOS",
    newPushNotification: "નવી પુશ સૂચના",
    matchDonorsNow: "હવે ડોનર મેળવો",
    dismiss: "બરતરફ કરો",
    simulateSOS: "SOS સિમ્યુલેટ કરો",
    closeControl: "નિયંત્રણ બંધ કરો",
  },
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.en;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
