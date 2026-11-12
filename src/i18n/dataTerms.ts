/**
 * Hindi names for the fixed vocabulary that comes from the data pipeline
 * (categories, occupations, standard documents, states). Scheme names stay
 * in English until the data has verified Hindi names.
 */
export const CATEGORY_HI: Record<string, string> = {
  'Education & Learning': 'शिक्षा',
  'Agriculture & Farming': 'खेती-किसानी',
  'Women & Child Development': 'महिला और बच्चे',
  'Business & Entrepreneurship': 'व्यापार और उद्यम',
  'Health & Wellness': 'स्वास्थ्य',
  'Social Welfare & Empowerment': 'समाज कल्याण',
  'Disability & Rehabilitation': 'दिव्यांगजन',
  'Senior Citizens': 'बुज़ुर्ग',
  'Employment & Skills': 'रोज़गार और कौशल',
  'Housing & Shelter': 'घर और आवास',
}

/** Short English labels for categories (the full names are long on phones). */
export const CATEGORY_SHORT_EN: Record<string, string> = {
  'Education & Learning': 'Education',
  'Agriculture & Farming': 'Farming',
  'Women & Child Development': 'Women & Children',
  'Business & Entrepreneurship': 'Business',
  'Health & Wellness': 'Health',
  'Social Welfare & Empowerment': 'Social Welfare',
  'Disability & Rehabilitation': 'Disability',
  'Senior Citizens': 'Senior Citizens',
  'Employment & Skills': 'Jobs & Skills',
  'Housing & Shelter': 'Housing',
}

export const OCCUPATION_TERMS: Record<string, { en: string; hi: string }> = {
  student: { en: 'Students', hi: 'छात्र' },
  farmer: { en: 'Farmers', hi: 'किसान' },
  entrepreneur: { en: 'Entrepreneurs', hi: 'उद्यमी' },
  unemployed: { en: 'Job seekers', hi: 'नौकरी ढूँढने वाले' },
  artisan: { en: 'Artisans', hi: 'कारीगर' },
  construction_worker: { en: 'Construction workers', hi: 'निर्माण मज़दूर' },
}

export const AUDIENCE_TERMS: Record<string, { en: string; hi: string }> = {
  women: { en: 'Women & girls', hi: 'महिलाएँ और लड़कियाँ' },
  students: { en: 'Students', hi: 'छात्र' },
  farmers: { en: 'Farmers', hi: 'किसान' },
  workers: { en: 'Construction workers', hi: 'निर्माण मज़दूर' },
  business: { en: 'Entrepreneurs', hi: 'उद्यमी' },
  disability: { en: 'Persons with disability', hi: 'दिव्यांगजन' },
  senior: { en: 'Senior citizens', hi: 'बुज़ुर्ग' },
  scst: { en: 'SC / ST', hi: 'SC / ST' },
  bpl: { en: 'BPL families', hi: 'BPL परिवार' },
}

export const DOCUMENT_HI: Record<string, string> = {
  'Aadhaar Card': 'आधार कार्ड',
  'Bank Passbook / Account Details': 'बैंक पासबुक / खाते की जानकारी',
  'Income Certificate': 'आय प्रमाण पत्र',
  'Caste Certificate': 'जाति प्रमाण पत्र',
  'Domicile / Residence Certificate': 'निवास प्रमाण पत्र',
  'Ration Card / BPL Card': 'राशन कार्ड / BPL कार्ड',
  'Disability Certificate (UDID)': 'दिव्यांगता प्रमाण पत्र (UDID)',
  'Educational Certificate / Marksheet': 'शैक्षिक प्रमाण पत्र / मार्कशीट',
  'Land Records': 'ज़मीन के कागज़ (खसरा / खतौनी)',
  'Passport-size Photograph': 'पासपोर्ट साइज़ फ़ोटो',
  'Birth Certificate / Age Proof': 'जन्म प्रमाण पत्र / उम्र का प्रमाण',
  'Death Certificate': 'मृत्यु प्रमाण पत्र',
  'Marriage Certificate': 'विवाह प्रमाण पत्र',
  'Voter ID': 'वोटर आईडी',
  'PAN Card': 'पैन कार्ड',
  'Medical Certificate': 'मेडिकल प्रमाण पत्र',
  'Labour / Worker Registration Card': 'श्रमिक पंजीकरण कार्ड',
  'Application Form': 'आवेदन पत्र',
  'Self Declaration / Affidavit': 'स्व-घोषणा / शपथ पत्र',
  'Project Report / Business Plan': 'प्रोजेक्ट रिपोर्ट / बिज़नेस प्लान',
  'Mobile Number': 'मोबाइल नंबर',
}

export const STATE_HI: Record<string, string> = {
  'Andhra Pradesh': 'आंध्र प्रदेश', 'Arunachal Pradesh': 'अरुणाचल प्रदेश', Assam: 'असम', Bihar: 'बिहार',
  Chhattisgarh: 'छत्तीसगढ़', Goa: 'गोवा', Gujarat: 'गुजरात', Haryana: 'हरियाणा', 'Himachal Pradesh': 'हिमाचल प्रदेश',
  Jharkhand: 'झारखंड', Karnataka: 'कर्नाटक', Kerala: 'केरल', 'Madhya Pradesh': 'मध्य प्रदेश', Maharashtra: 'महाराष्ट्र',
  Manipur: 'मणिपुर', Meghalaya: 'मेघालय', Mizoram: 'मिज़ोरम', Nagaland: 'नागालैंड', Odisha: 'ओडिशा', Punjab: 'पंजाब',
  Rajasthan: 'राजस्थान', Sikkim: 'सिक्किम', 'Tamil Nadu': 'तमिलनाडु', Telangana: 'तेलंगाना', Tripura: 'त्रिपुरा',
  'Uttar Pradesh': 'उत्तर प्रदेश', Uttarakhand: 'उत्तराखंड', 'West Bengal': 'पश्चिम बंगाल',
  'Andaman and Nicobar Islands': 'अंडमान और निकोबार', Chandigarh: 'चंडीगढ़',
  'Dadra and Nagar Haveli and Daman and Diu': 'दादरा नगर हवेली और दमन दीव', Delhi: 'दिल्ली',
  'Jammu and Kashmir': 'जम्मू और कश्मीर', Ladakh: 'लद्दाख', Lakshadweep: 'लक्षद्वीप', Puducherry: 'पुडुचेरी',
}
