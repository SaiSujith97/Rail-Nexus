

import { Type } from "@google/genai";
import { Train, Conflict, OptimizedSchedule, ScenarioType } from '../types';

// This file mocks the Gemini API service. In a real application,
// this would use '@google/genai' to make network requests.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = <T,>(data: T, ms: number): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

/**
 * Mocks a call to the Gemini API to get an optimized train schedule.
 * The prompt would describe the current state of trains, tracks, and known conflicts,
 * asking for a conflict-free schedule that minimizes delays.
 */
export const getOptimizedSchedule = async (
  trains: Train[], 
  conflicts: Conflict[],
  language: string,
): Promise<OptimizedSchedule> => {
  console.log(`Simulating Gemini API call for schedule optimization in ${language}...`);

  /*
  // Example of a real API call structure:
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `
      ...
      Provide all explanations and reasons in the response in ${language}.
    `,
    ...
  });
  ...
  */
  
  const mockSchedule: OptimizedSchedule = {
    scheduleId: `OPT-${Date.now()}`,
    createdAt: new Date().toISOString(),
    entries: [
      { trainId: 'FREIGHT-01', stationId: 'WL', action: 'HALT', platform: 1, estimatedTime: new Date(Date.now() + 5 * 60000).toISOString(), reason: 'Allow 12604 to pass', recommendedTrack: 3 },
      { trainId: '12604', stationId: 'WL', action: 'PASS', estimatedTime: new Date(Date.now() + 6 * 60000).toISOString(), recommendedTrack: 1 },
      { trainId: '12759', stationId: 'ZN', action: 'HALT', platform: 2, estimatedTime: new Date(Date.now() + 15 * 60000).toISOString(), reason: 'Wait for UP track clearance', recommendedTrack: 2 },
      { trainId: '12728', stationId: 'ZN', action: 'PASS', estimatedTime: new Date(Date.now() + 16 * 60000).toISOString(), recommendedTrack: 6 },
    ],
    metrics: {
      totalDelayReduced: 25,
      averageTrainSpeed: 72,
      throughputIncrease: 15,
    },
  };

  return delay(mockSchedule, 2500);
};


/**
 * Mocks a call to the Gemini API for "what-if" scenario analysis.
 * The prompt would describe a base scenario and a disruption, asking for the impact
 * and a recommended mitigation plan.
 */
export const simulateScenario = async (
  trains: Train[], 
  scenarioType: ScenarioType, 
  details: Record<string, any>,
  language: string,
): Promise<OptimizedSchedule> => {
    console.log(`Simulating Gemini API call for scenario analysis in ${language}...`, { scenarioType, details });

    /*
    ...
    contents: `... Provide all explanations and reasons in the response in ${language}.`
    ...
    */
    
    // Mocked response
    const mockSimulationResult: OptimizedSchedule = {
        scheduleId: `SIM-${Date.now()}`,
        createdAt: new Date().toISOString(),
        entries: [
          { trainId: details.trainId || '12728', stationId: 'ZN', action: 'HALT', platform: 1, estimatedTime: new Date(Date.now() + 10 * 60000).toISOString(), reason: `Mitigation for ${scenarioType}: Hold for extended delay clearance.`, recommendedTrack: 6 },
          { trainId: '12759', stationId: 'WL', action: 'HALT', platform: 1, estimatedTime: new Date(Date.now() + 12 * 60000).toISOString(), reason: 'Rerouted to platform 1 due to congestion at ZN.', recommendedTrack: 1 },
          { trainId: 'FREIGHT-02', stationId: 'ZN', action: 'HALT', estimatedTime: new Date(Date.now() + 25 * 60000).toISOString(), reason: 'Delayed departure to accommodate priority traffic.', recommendedTrack: 4 },
        ],
        metrics: {
          totalDelayReduced: -45, // Negative value indicates delay increased but was minimized
          averageTrainSpeed: 55,
          throughputIncrease: -20, // Negative value indicates decrease
        },
    };
    
    return delay(mockSimulationResult, 3000);
};

/**
 * Mocks a call to the Gemini API to get a resolution for a specific conflict.
 */
export const resolveConflict = async (
  conflict: Conflict,
  trains: Train[],
  language: string,
): Promise<string> => {
  console.log(`Simulating Gemini API call for conflict resolution in ${language}...`);

  const involvedTrainDetails = trains.filter(t => conflict.involvedTrains.includes(t.id));
  /*
  contents: `... Provide the resolution in ${language}.`
  */

  const resolutions: Record<string, string> = {
      en: `Halt train ${conflict.involvedTrains[1]} at the next signal for 4 minutes to create a safe passing gap for ${conflict.involvedTrains[0]}.`,
      hi: `गाड़ी ${conflict.involvedTrains[0]} के लिए सुरक्षित पासिंग गैप बनाने के लिए अगली सिग्नल पर गाड़ी ${conflict.involvedTrains[1]} को 4 मिनट के लिए रोकें।`,
      te: `${conflict.involvedTrains[0]} కోసం సురక్షితమైన పాసింగ్ గ్యాప్ సృష్టించడానికి తదుపరి సిగ్నల్ వద్ద ${conflict.involvedTrains[1]} రైలును 4 నిమిషాల పాటు ఆపండి.`,
      ta: `${conflict.involvedTrains[0]} க்கு பாதுகாப்பான கடந்து செல்லும் இடைவெளியை உருவாக்க, அடுத்த சிக்னலில் ${conflict.involvedTrains[1]} ரயிலை 4 நிமிடங்கள் நிறுத்தவும்.`,
      kn: `${conflict.involvedTrains[0]} ಗಾಗಿ ಸುರಕ್ಷಿತ ಹಾದುಹೋಗುವ ಅಂತರವನ್ನು ರಚಿಸಲು ಮುಂದಿನ ಸಿಗ್ನಲ್‌ನಲ್ಲಿ ${conflict.involvedTrains[1]} ರೈಲನ್ನು 4 ನಿಮಿಷಗಳ ಕಾಲ ನಿಲ್ಲಿಸಿ.`,
      ml: `${conflict.involvedTrains[0]} ന് സുരക്ഷിതമായ കടന്നുപോകാനുള്ള വിടവ് സൃഷ്ടിക്കാൻ അടുത്ത സിഗ്നലിൽ ${conflict.involvedTrains[1]} ട്രെയിൻ 4 മിനിറ്റ് നിർത്തുക.`,
  }

  return delay(resolutions[language] || resolutions.en, 2000);
};


/**
 * Mocks a call to the Gemini API to get an explanation for a decision.
 */
export const getExplanationForDecision = async (
  decisionContext: string,
  language: string,
): Promise<string> => {
  console.log(`Simulating Gemini API call for decision explanation in ${language}...`, { decisionContext });

  /*
  contents: `... Explain the reasoning in ${language}.`
  */
  
  const explanations: Record<string, string> = {
      en: `The decision regarding '${decisionContext}' was based on three main factors:
1.  **Priority Mismatch:** An involved Express train (Priority 1) had scheduling precedence over a Freight train (Priority 5).
2.  **Track Occupancy:** Halting the lower priority train at a station with a loop line clears the main line, preventing a cascading delay for the express service.
3.  **Network Efficiency:** This action is calculated to reduce the total network delay by an estimated 15 minutes compared to the alternative of slowing down the express train.`,
      hi: `'${decisionContext}' से संबंधित निर्णय तीन मुख्य कारकों पर आधारित था:
1.  **प्राथमिकता का मेल नहीं खाना:** एक एक्सप्रेस ट्रेन (प्राथमिकता 1) को एक मालगाड़ी (प्राथमिकता 5) पर वरीयता दी गई थी।
2.  **ट्रैक का कब्ज़ा:** कम प्राथमिकता वाली ट्रेन को लूप लाइन वाले स्टेशन पर रोकने से मुख्य लाइन खाली हो जाती है, जिससे एक्सप्रेस सेवा के लिए देरी का सिलसिला रुक जाता है।
3.  **नेटवर्क दक्षता:** इस कार्रवाई से एक्सप्रेस ट्रेन को धीमा करने के विकल्प की तुलना में कुल नेटवर्क देरी में अनुमानित 15 मिनट की कमी आने का अनुमान है।`,
       te: `'${decisionContext}' కి సంబంధించిన నిర్ణయం మూడు ప్రధాన కారకాలపై ఆధారపడింది:
1.  **ప్రాధాన్యత అసమతుల్యత:** ఒక ఎక్స్‌ప్రెస్ రైలు (ప్రాధాన్యత 1) ఒక ఫ్రైట్ రైలు (ప్రాధాన్యత 5) కంటే షెడ్యూలింగ్ ప్రాధాన్యతను కలిగి ఉంది.
2.  **ట్రాక్ ఆక్యుపెన్సీ:** తక్కువ ప్రాధాన్యత గల రైలును లూప్ లైన్‌తో ఉన్న స్టేషన్‌లో ఆపడం వలన ప్రధాన లైన్ క్లియర్ అవుతుంది, ఎక్స్‌ప్రెస్ సేవకు క్యాస్కేడింగ్ ఆలస్యాన్ని నివారిస్తుంది.
3.  **నెట్‌వర్క్ సామర్థ్యం:** ఈ చర్య ఎక్స్‌ప్రెస్ రైలును నెమ్మది చేసే ప్రత్యామ్నాయంతో పోలిస్తే మొత్తం నెట్‌వర్క్ ఆలస్యాన్ని అంచనా ప్రకారం 15 నిమిషాలు తగ్గిస్తుందని లెక్కించబడింది.`,
      ta: `'${decisionContext}' தொடர்பான முடிவு மூன்று முக்கிய காரணிகளை அடிப்படையாகக் கொண்டது:
1.  **முன்னுரிமை பொருத்தமின்மை:** சம்பந்தப்பட்ட எக்ஸ்பிரஸ் ரயில் (முன்னுரிமை 1) சரக்கு ரயிலை (முன்னுரிமை 5) விட அட்டவணையில் முன்னுரிமை பெற்றது.
2.  **தடப் பயன்பாடு:** குறைந்த முன்னுரிமை கொண்ட ரயிலை ஒரு லூப் லைன் உள்ள நிலையத்தில் நிறுத்துவது பிரதான பாதையை ತೆரவு செய்கிறது, இது எக்ஸ்பிரஸ் சேவைக்கு தொடர் தாமதத்தை தடுக்கிறது.
3.  **நெட்வொர்க் செயல்திறன்:** இந்த நடவடிக்கை எக்ஸ்பிரஸ் ரயிலின் வேகத்தை குறைக்கும் மாற்று வழியை விட மொத்த நெட்வொர்க் தாமதத்தை சுமார் 15 நிமிடங்கள் குறைக்கும் என்று கணக்கிடப்பட்டுள்ளது.`,
      kn: `'${decisionContext}' ಕುರಿತಾದ ನಿರ್ಧಾರವು ಮೂರು ಮುಖ್ಯ ಅಂಶಗಳನ್ನು ಆಧರಿಸಿದೆ:
1.  **ಆದ್ಯತೆಯ ಹೊಂದಾಣಿಕೆಯಿಲ್ಲದಿರುವುದು:** ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರೈಲು (ಆದ್ಯತೆ 1) ಸರಕು ರೈಲು (ಆದ್ಯತೆ 5) ಗಿಂತ ವೇಳಾಪಟ್ಟಿಯಲ್ಲಿ ಆದ್ಯತೆ ಹೊಂದಿತ್ತು.
2.  **ಟ್ರ್ಯಾಕ್ ಆಕ್ಯುಪೆನ್ಸಿ:** ಲೂಪ್ ಲೈನ್ ಇರುವ ನಿಲ್ದಾಣದಲ್ಲಿ ಕಡಿಮೆ ಆದ್ಯತೆಯ ರೈಲನ್ನು ನಿಲ್ಲಿಸುವುದರಿಂದ ಮುಖ್ಯ ಲೈನ್ ಖಾಲಿಯಾಗುತ್ತದೆ, ಇದರಿಂದ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಸೇವೆಗೆ ಕ್ಯಾಸ್ಕೇಡಿಂಗ್ ವಿಳಂಬವನ್ನು ತಡೆಯಲಾಗುತ್ತದೆ.
3.  **ನೆಟ್‌ವರ್ಕ್ ದಕ್ಷತೆ:** ಈ ಕ್ರಮವು ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರೈಲನ್ನು ನಿಧಾನಗೊಳಿಸುವ ಪರ್ಯಾಯಕ್ಕೆ ಹೋಲಿಸಿದರೆ ಒಟ್ಟು ನೆಟ್‌ವರ್ಕ್ ವಿಳಂಬವನ್ನು ಅಂದಾಜು 15 ನಿಮಿಷಗಳಷ್ಟು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ ಎಂದು ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ.`,
      ml: `'${decisionContext}' സംബന്ധിച്ച തീരുമാനം മൂന്ന് പ്രധാന ഘടകങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്:
1.  **മുൻഗണനാ പൊരുത്തക്കേട്:** ഉൾപ്പെട്ട എക്സ്പ്രസ് ട്രെയിനിന് (മുൻഗണന 1) ചരക്ക് ട്രെയിനിനേക്കാൾ (മുൻഗണന 5) ഷെഡ്യൂളിംഗിൽ മുൻഗണനയുണ്ടായിരുന്നു.
2.  **ട്രാക്ക് ഒക്യുപെൻസി:** ലൂപ്പ് ലൈനുള്ള ഒരു സ്റ്റേഷനിൽ താഴ്ന്ന മുൻഗണനയുള്ള ട്രെയിൻ നിർത്തുന്നത് പ്രധാന ലൈൻ ക്ലിയർ ചെയ്യുന്നു, ഇത് എക്സ്പ്രസ് സർവീസിനുള്ള കാസ്കേഡിംഗ് കാലതാമസം തടയുന്നു.
3.  **നെറ്റ്‌വർക്ക് കാര്യക്ഷമത:** എക്സ്പ്രസ് ട്രെയിനിന്റെ വേഗത കുറയ്ക്കുന്നതിനുള്ള ബദലുമായി താരതമ്യപ്പെടുത്തുമ്പോൾ ഈ നടപടി മൊത്തം നെറ്റ്‌വർക്ക് കാലതാമസം ഏകദേശം 15 മിനിറ്റ് കുറയ്ക്കുമെന്ന് കണക്കാക്കപ്പെടുന്നു.`,
  };

  return delay(explanations[language] || explanations.en, 1500);
};

/**
 * Mocks a call to the Gemini API to generate a performance summary.
 */
export const getPerformanceSummary = async (
  delayData: any[],
  punctualityData: any[],
  language: string,
): Promise<string> => {
  console.log(`Simulating Gemini API call for performance summary in ${language}...`, { delayData, punctualityData });

  const summaries: Record<string, string> = {
    en: `**Overall Performance Summary:**

*   **Punctuality:** The section's punctuality is generally strong, staying above 85%. However, there's a noticeable dip to 85% around 18:00, which should be investigated. This could be due to peak evening traffic or crew changes.
*   **Delays:** Freight trains are the primary source of delays, with an average of 35 minutes. This is significantly higher than other train types and impacts overall network fluidity. Express trains have a moderate delay of 12 minutes.
*   **Strengths:** Local and Special services are performing exceptionally well with minimal delays, indicating efficient scheduling for these categories.
*   **Recommendation:** Focus on optimizing freight train paths, especially during the evening peak (around 18:00), to reduce their high delay times and mitigate the dip in overall punctuality. Consider scheduling non-essential freight movement during off-peak hours.`,
    hi: `**समग्र प्रदर्शन सारांश:**

*   **समय की पाबंदी:** अनुभाग की समय की पाबंदी आम तौर पर मजबूत है, जो 85% से ऊपर रहती है। हालांकि, 18:00 के आसपास 85% तक की एक उल्लेखनीय गिरावट है, जिसकी जांच की जानी चाहिए। यह शाम के पीक ट्रैफिक या क्रू परिवर्तन के कारण हो सकता है।
*   **देरी:** मालगाड़ियाँ देरी का मुख्य स्रोत हैं, जिनकी औसत देरी 35 मिनट है। यह अन्य प्रकार की ट्रेनों की तुलना में काफी अधिक है और समग्र नेटवर्क प्रवाह को प्रभावित करता है। एक्सप्रेस ट्रेनों में 12 मिनट की मामूली देरी होती है।
*   **ताकत:** स्थानीय और विशेष सेवाएं न्यूनतम देरी के साथ असाधारण रूप से अच्छा प्रदर्शन कर रही हैं, जो इन श्रेणियों के लिए कुशल समय-निर्धारण का संकेत देती है।
*   **सिफारिश:** मालगाड़ियों के रास्तों को अनुकूलित करने पर ध्यान केंद्रित करें, विशेष रूप से शाम के पीक (लगभग 18:00) के दौरान, ताकि उनकी उच्च देरी के समय को कम किया जा सके और समग्र समय की पाबंदी में गिरावट को कम किया जा सके। गैर-आवश्यक माल ढुलाई को ऑफ-पीक घंटों के दौरान निर्धारित करने पर विचार करें।`,
    te: `**మొత్తం పనితీరు సారాంశం:**

*   **సమయపాలన:** విభాగం యొక్క సమయపాలన సాధారణంగా బలంగా ఉంది, 85% కంటే ఎక్కువగా ఉంటుంది. అయితే, 18:00 గంటల ప్రాంతంలో 85%కి గమనించదగిన తగ్గుదల ఉంది, దీనిని పరిశోధించాలి. ఇది సాయంత్రం పీక్ ట్రాఫిక్ లేదా సిబ్బంది మార్పుల వల్ల కావచ్చు.
*   **ఆలస్యాలు:** సరుకు రవాణా రైళ్లు ఆలస్యానికి ప్రాథమిక మూలం, సగటున 35 నిమిషాలు. ఇది ఇతర రైలు రకాల కంటే చాలా ఎక్కువ మరియు మొత్తం నెట్‌వర్క్ ద్రవత్వతను ప్రభావితం చేస్తుంది. ఎక్స్‌ప్రెస్ రైళ్లు 12 నిమిషాల మధ్యస్థ ఆలస్యాన్ని కలిగి ఉంటాయి.
*   **బలాలు:** స్థానిక మరియు ప్రత్యేక సేవలు కనీస ఆలస్యంతో అనూహ్యంగా బాగా పనిచేస్తున్నాయి, ఈ వర్గాలకు సమర్థవంతమైన షెడ్యూలింగ్‌ను సూచిస్తాయి.
*   **సిఫార్సు:** సరుకు రవాణా రైలు మార్గాలను ఆప్టిమైజ్ చేయడంపై దృష్టి పెట్టండి, ముఖ్యంగా సాయంత్రం పీక్ (సుమారు 18:00) సమయంలో, వాటి అధిక ఆలస్య సమయాలను తగ్గించడానికి మరియు మొత్తం సమయపాలనలో తగ్గుదలను తగ్గించడానికి. అనవసరమైన సరుకు రవాణా కదలికలను ఆఫ్-పీక్ గంటలలో షెడ్యూల్ చేయడాన్ని పరిగణించండి.`,
    ta: `**ஒட்டுமொத்த செயல்திறன் சுருக்கம்:**

*   **நேரந்தவறாமை:** பிரிவின் நேரந்தவறாமை பொதுவாக வலுவாக உள்ளது, 85% க்கும் அதிகமாக உள்ளது. இருப்பினும், 18:00 மணியளவில் 85% ஆகக் குறிப்பிடத்தக்க சரிவு உள்ளது, இது விசாரிக்கப்பட வேண்டும். இது மாலை நேர உச்சக்கட்ட போக்குவரத்து அல்லது ஊழியர் மாற்றங்கள் காரணமாக இருக்கலாம்.
*   **தாமதங்கள்:** சரக்கு ரயில்களே தாமதங்களுக்கு முதன்மைக் காரணம், சராசரியாக 35 நிமிடங்கள். இது மற்ற ரயில் வகைகளை விட கணிசமாக அதிகமாகும் மற்றும் ஒட்டுமொத்த நெட்வொர்க் நெகிழ்வுத்தன்மையைப் பாதிக்கிறது. எக்ஸ்பிரஸ் ரயில்களுக்கு 12 நிமிடங்கள் மிதமான தாமதம் உள்ளது.
*   **பலங்கள்:** உள்ளூர் மற்றும் சிறப்பு சேவைகள் மிகக் குறைந்த தாமதங்களுடன் விதிவிலக்காக சிறப்பாக செயல்படுகின்றன, இது இந்த வகைகளுக்கு திறமையான திட்டமிடலைக் குறிக்கிறது.
*   **பரிந்துரை:** சரக்கு ரயில் பாதைகளை உகப்பாக்குவதில் கவனம் செலுத்துங்கள், குறிப்பாக மாலை நேர உச்சக்கட்டத்தின் போது (சுமார் 18:00), அவற்றின் அதிக தாமத நேரங்களைக் குறைக்கவும் மற்றும் ஒட்டுமொத்த நேரந்தவறாமையில் சரிவைக் குறைக்கவும். அத்தியாவசியமற்ற சரக்கு இயக்கத்தை உச்சக்கட்டமில்லாத நேரங்களில் திட்டமிடுவதைக் கவனியுங்கள்.`,
    kn: `**ಒಟ್ಟಾರೆ ಕಾರ್ಯಕ್ಷಮತೆ ಸಾರಾಂಶ:**

*   **ಸಮಯಪ್ರಜ್ಞೆ:** ವಿಭಾಗದ ಸಮಯಪ್ರಜ್ಞೆಯು ಸಾಮಾನ್ಯವಾಗಿ ಪ್ರಬಲವಾಗಿದೆ, 85% ಕ್ಕಿಂತ ಹೆಚ್ಚಿದೆ. ಆದಾಗ್ಯೂ, 18:00 ರ ಸುಮಾರಿಗೆ 85% ಕ್ಕೆ ಗಮನಾರ್ಹ ಕುಸಿತ ಕಂಡುಬಂದಿದೆ, ಇದನ್ನು ತನಿಖೆ ಮಾಡಬೇಕು. ಇದು ಸಂಜೆಯ ಗರಿಷ್ಠ ಸಂಚಾರ ಅಥವಾ ಸಿಬ್ಬಂದಿ ಬದಲಾವಣೆಯಿಂದಾಗಿರಬಹುದು.
*   **ವಿಳಂಬಗಳು:** ಸರಕು ಸಾಗಣೆ ರೈಲುಗಳು ವಿಳಂಬದ ಪ್ರಾಥಮಿಕ ಮೂಲವಾಗಿದ್ದು, ಸರಾಸರಿ 35 ನಿಮಿಷಗಳಾಗಿವೆ. ಇದು ಇತರ ರೈಲು ಪ್ರಕಾರಗಳಿಗಿಂತ ಗಮನಾರ್ಹವಾಗಿ ಹೆಚ್ಚಾಗಿದೆ ಮತ್ತು ಒಟ್ಟಾರೆ ನೆಟ್‌ವರ್ಕ್ ದ್ರವ್ಯತೆಯನ್ನು ಬಾಧಿಸುತ್ತದೆ. ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರೈಲುಗಳು 12 ನಿಮಿಷಗಳ ಮಧ್ಯಮ ವಿಳಂಬವನ್ನು ಹೊಂದಿವೆ.
*   **ಸಾಮರ್ಥ್ಯಗಳು:** ಸ್ಥಳೀಯ ಮತ್ತು ವಿಶೇಷ ಸೇವೆಗಳು ಕನಿಷ್ಠ ವಿಳಂಬಗಳೊಂದಿಗೆ ಅಸಾಧಾರಣವಾಗಿ ಉತ್ತಮವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ, ಇದು ಈ ವರ್ಗಗಳಿಗೆ ಸಮರ್ಥ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.
*   **ಶಿಫಾರಸು:** ಸರಕು ರೈಲು ಮಾರ್ಗಗಳನ್ನು ಆಪ್ಟಿಮೈಜ್ ಮಾಡುವುದರ ಮೇಲೆ ಗಮನಹರಿಸಿ, ವಿಶೇಷವಾಗಿ ಸಂಜೆಯ ಗರಿಷ್ಠ ಸಮಯದಲ್ಲಿ (ಸುಮಾರು 18:00), ಅವುಗಳ ಹೆಚ್ಚಿನ ವಿಳಂಬ ಸಮಯವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಮತ್ತು ಒಟ್ಟಾರೆ ಸಮಯಪ್ರಜ್ಞೆಯಲ್ಲಿನ ಕುಸಿತವನ್ನು ತಗ್ಗಿಸಲು. ಅತ್ಯಗತ್ಯವಲ್ಲದ ಸರಕು ಚಲನೆಯನ್ನು ಗರಿಷ್ಠವಲ್ಲದ ಸಮಯದಲ್ಲಿ ನಿಗದಿಪಡಿಸುವುದನ್ನು ಪರಿಗಣಿಸಿ.`,
    ml: `**മൊത്തത്തിലുള്ള പ്രകടന സംഗ്രഹം:**

*   **കൃത്യനിഷ്ഠ:** വിഭാഗത്തിന്റെ കൃത്യനിഷ്ഠ പൊതുവെ ശക്തമാണ്, 85% ന് മുകളിൽ നിൽക്കുന്നു. എന്നിരുന്നാലും, 18:00 ഓടെ 85% ലേക്ക് ശ്രദ്ധേയമായ ഒരു ഇടിവുണ്ട്, ഇത് അന്വേഷിക്കേണ്ടതാണ്. ഇത് വൈകുന്നേരത്തെ തിരക്കേറിയ ഗതാഗതം അല്ലെങ്കിൽ ജീവനക്കാരുടെ മാറ്റങ്ങൾ മൂലമാകാം.
*   **കാലതാമസം:** ചരക്ക് ട്രെയിനുകളാണ് കാലതാമസത്തിന്റെ പ്രധാന ഉറവിടം, ശരാശരി 35 മിനിറ്റ്. ഇത് മറ്റ് ട്രെയിൻ തരങ്ങളേക്കാൾ വളരെ കൂടുതലാണ് കൂടാതെ മൊത്തത്തിലുള്ള നെറ്റ്‌വർക്ക് ഫ്ലൂയിഡിറ്റിയെ ബാധിക്കുന്നു. എക്സ്പ്രസ് ട്രെയിനുകൾക്ക് 12 മിനിറ്റ് മിതമായ കാലതാമസമുണ്ട്.
*   **മികവുകൾ:** പ്രാദേശിക, പ്രത്യേക സേവനങ്ങൾ വളരെ കുറഞ്ഞ കാലതാമസത്തോടെ അസാധാരണമായി മികച്ച പ്രകടനം കാഴ്ചവയ്ക്കുന്നു, ഇത് ഈ വിഭാഗങ്ങൾക്ക് കാര്യക്ഷമമായ ഷെഡ്യൂളിംഗിനെ സൂചിപ്പിക്കുന്നു.
*   **ശുപാർശ:** ചരക്ക് ട്രെയിൻ പാതകൾ ഒപ്റ്റിമൈസ് ചെയ്യുന്നതിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക, പ്രത്യേകിച്ച് വൈകുന്നേരത്തെ തിരക്കേറിയ സമയങ്ങളിൽ (ഏകദേശം 18:00), അവയുടെ ഉയർന്ന കാലതാമസം കുറയ്ക്കുന്നതിനും മൊത്തത്തിലുള്ള കൃത്യനിഷ്ഠയിലെ ഇടിവ് ലഘൂകരിക്കുന്നതിനും. അനിവാര്യമല്ലാത്ത ചരക്ക് നീക്കം തിരക്കില്ലാത്ത സമയങ്ങളിൽ ഷെഡ്യൂൾ ചെയ്യുന്നത് പരിഗണിക്കുക.`
  };

  return delay(summaries[language] || summaries.en, 3000);
};
