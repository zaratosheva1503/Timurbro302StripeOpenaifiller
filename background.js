// Korean First Names
const KOREAN_FIRST_NAMES = [
  "Minho", "Jiwon", "Hyunwoo", "Seojun", "Jihoon", "Donghyun", "Yujin", "Siwoo",
  "Junhyuk", "Sangwoo", "Taehyung", "Jungkook", "Seokjin", "Namjoon", "Hoseok",
  "Yoongi", "Jimin", "Doyoung", "Jaehyun", "Taeyong", "Mark", "Haechan",
  "Soyeon", "Minji", "Yuna", "Dahyun", "Chaeyoung", "Nayeon", "Jihyo", "Tzuyu",
  "Sunghoon", "Jungwon", "Heeseung", "Jake", "Sunoo", "Niki", "Jay",
  "Wooyoung", "San", "Hongjoong", "Seonghwa", "Yunho", "Yeosang", "Mingi",
  "Hyunjin", "Changbin", "Felix", "Seungmin", "Jeongin", "Bangchan", "Lee Know",
  "Soojin", "Miyeon", "Shuhua", "Yuqi", "Minnie", "Jieun", "Suzy", "IU"
];

// Korean Last Names
const KOREAN_LAST_NAMES = [
  "Kim", "Lee", "Park", "Choi", "Jung", "Kang", "Cho", "Yoon",
  "Jang", "Lim", "Han", "Shin", "Seo", "Kwon", "Hwang", "Ahn",
  "Song", "Yoo", "Hong", "Jeon", "Ko", "Moon", "Yang", "Son",
  "Bae", "Baek", "Im", "Oh", "Ryu", "Nam", "Ha", "Noh",
  "Byun", "Shim", "Woo", "Cha", "Min", "Won", "Jin", "Ku"
];

// Indian First Names
const INDIAN_FIRST_NAMES = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan",
  "Krishna", "Ishaan", "Shaurya", "Atharva", "Advait", "Dhruv", "Kabir", "Ritvik",
  "Aadhya", "Ananya", "Diya", "Pari", "Aanya", "Saanvi", "Myra", "Amaira",
  "Kiara", "Riya", "Prisha", "Navya", "Aditi", "Meera", "Tara", "Zara",
  "Rohan", "Vikram", "Rahul", "Amit", "Suresh", "Rajesh", "Karan", "Dev",
  "Neha", "Priya", "Anjali", "Pooja", "Shreya", "Kavya", "Nisha", "Simran"
];

// Indian Last Names
const INDIAN_LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Shah", "Joshi",
  "Agarwal", "Mehta", "Rao", "Reddy", "Nair", "Iyer", "Pillai", "Menon",
  "Chopra", "Kapoor", "Malhotra", "Bansal", "Jain", "Saxena", "Bhatia", "Khanna",
  "Mishra", "Pandey", "Tiwari", "Dubey", "Srivastava", "Chauhan", "Yadav", "Thakur",
  "Das", "Mukherjee", "Chatterjee", "Banerjee", "Sen", "Bose", "Dutta", "Ghosh"
];

// Indian Cities with State and ZIP codes
const INDIAN_CITIES = [
  { city: "Mumbai", state: "Maharashtra", zip: "400001" },
  { city: "Delhi", state: "Delhi", zip: "110001" },
  { city: "Bangalore", state: "Karnataka", zip: "560001" },
  { city: "Chennai", state: "Tamil Nadu", zip: "600001" },
  { city: "Hyderabad", state: "Telangana", zip: "500001" },
  { city: "Kolkata", state: "West Bengal", zip: "700001" },
  { city: "Pune", state: "Maharashtra", zip: "411001" },
  { city: "Ahmedabad", state: "Gujarat", zip: "380001" },
  { city: "Jaipur", state: "Rajasthan", zip: "302001" },
  { city: "Lucknow", state: "Uttar Pradesh", zip: "226001" }
];

// Indian Street Names
const INDIAN_STREETS = [
  "MG Road", "Gandhi Nagar", "Nehru Street", "Patel Road", "Shastri Nagar",
  "Station Road", "Market Street", "Temple Road", "Lake View Road", "Park Street",
  "Civil Lines", "Model Town", "Sector 15", "Phase 2", "Block A",
  "Rajaji Street", "Anna Nagar", "Indira Colony", "Sarojini Nagar", "Lajpat Nagar"
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== HARDCODED CONFIGURATION FOR OPENAI =====
const EXTENSION_VERSION = '6.0.9';

// Hardcoded BIN and Expiry for South Korea (default)
const HARDCODED_BIN = '625814260257';
const HARDCODED_EXPIRY_MONTH = '05';
const HARDCODED_EXPIRY_YEAR = '2028';

// India BIN and Expiry
const INDIA_BIN = '551827894390';
const INDIA_EXPIRY_MONTH = '03';
const INDIA_EXPIRY_YEAR = '2029';

// South Korean Address (default)
const KR_ADDRESS = '123 Gangnam-daero';
const KR_CITY = 'Seoul';
const KR_ZIP = '06130';
const KR_STATE = 'Gangnam-gu';

function generateRandomData(country = 'IN') {
  if (country === 'IN') {
    // Generate unique Indian data
    const cityData = randomChoice(INDIAN_CITIES);
    const houseNumber = Math.floor(Math.random() * 500) + 1;
    const street = randomChoice(INDIAN_STREETS);
    return {
      name: `${randomChoice(INDIAN_FIRST_NAMES)} ${randomChoice(INDIAN_LAST_NAMES)}`,
      address: `${houseNumber}, ${street}`,
      address2: '',
      city: cityData.city,
      zip: cityData.zip,
      state: cityData.state,
      country: 'IN'
    };
  }

  // Default: South Korea
  return {
    name: `${randomChoice(KOREAN_FIRST_NAMES)} ${randomChoice(KOREAN_LAST_NAMES)}`,
    address: KR_ADDRESS,
    address2: '',
    city: KR_CITY,
    zip: KR_ZIP,
    state: KR_STATE,
    country: 'KR'
  };
}

function cleanBin(bin) {
  return bin.replace(/x/gi, '').replace(/\s+/g, '').trim();
}

function luhnCheck(cardNumber) {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

function calculateLuhnCheckDigit(partial) {
  let sum = 0;
  let isEven = true;

  for (let i = partial.length - 1; i >= 0; i--) {
    let digit = parseInt(partial[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return (10 - (sum % 10)) % 10;
}

function generateCardWithLuhn(bin) {
  let cardNumber = bin;

  while (cardNumber.length < 15) {
    cardNumber += Math.floor(Math.random() * 10);
  }

  const checkDigit = calculateLuhnCheckDigit(cardNumber);
  cardNumber += checkDigit;

  return cardNumber;
}

function generateCardsWithLuhn(bin, quantity, expiryMonth = null, expiryYear = null) {
  const cards = [];
  const actualBin = cleanBin(bin);
  const expMonth = expiryMonth || HARDCODED_EXPIRY_MONTH;
  const expYear = expiryYear || HARDCODED_EXPIRY_YEAR;

  for (let i = 0; i < quantity; i++) {
    const cardNumber = generateCardWithLuhn(actualBin);
    const cvv = String(Math.floor(Math.random() * 900) + 100);

    cards.push({
      serial_number: i + 1,
      card_number: cardNumber,
      expiry_month: expMonth,
      expiry_year: expYear,
      cvv: cvv,
      full_format: `${cardNumber}|${expMonth}|${expYear}|${cvv}`
    });
  }

  return cards;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['extensionVersion'], (result) => {
    if (result.extensionVersion !== EXTENSION_VERSION) {
      chrome.storage.local.clear(() => {
        chrome.storage.local.set({
          extensionVersion: EXTENSION_VERSION,
          defaultbincursorvo1: HARDCODED_BIN + 'xxxx'
        });
      });
    }
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateCards') {
    generateCardsFromAPI(request.bin, request.stripeTabId, sendResponse, request.method, request.country, request.expiryMonth, request.expiryYear);
    return true;
  } else if (request.action === 'generatePrecards') {
    generatePrecardsFromAPI(request.bin, sendResponse, request.method, request.country);
    return true;
  }
});

async function generateCardsFromAPI(bin, stripeTabId, callback, method = 'api', country = 'IN', customExpiryMonth = null, customExpiryYear = null) {
  // Select BIN and expiry based on country
  let defaultBin, expiryMonth, expiryYear;

  if (country === 'IN') {
    // India defaults
    defaultBin = INDIA_BIN;
    expiryMonth = customExpiryMonth || INDIA_EXPIRY_MONTH;
    expiryYear = customExpiryYear || INDIA_EXPIRY_YEAR;
  } else {
    // South Korea defaults
    defaultBin = HARDCODED_BIN;
    expiryMonth = customExpiryMonth || HARDCODED_EXPIRY_MONTH;
    expiryYear = customExpiryYear || HARDCODED_EXPIRY_YEAR;
  }

  let cleanedBin = '';

  const storeAndFill = async (cards, randomData) => {
    chrome.storage.local.set({
      generatedCards: cards,
      randomData: randomData
    });

    callback({ success: true, cards: cards });

    await new Promise(resolve => setTimeout(resolve, 500));

    chrome.tabs.sendMessage(stripeTabId, {
      action: 'fillForm'
    });
  };

  try {
    cleanedBin = cleanBin(bin);

    if (cleanedBin.length < 6) {
      console.error('[Zarif] BIN validation failed:', cleanedBin);
      callback({ success: false, error: 'BIN must be at least 6 digits' });
      return;
    }

    console.log('[Zarif] Starting card generation for country:', country);
    console.log('[Zarif] Using BIN:', cleanedBin);
    console.log('[Zarif] Expiry:', expiryMonth + '/' + expiryYear);

    const payload = {
      action: "generateAdvance",
      customBin: cleanedBin,
      format: "pipe",
      quantity: 10,
      includeDate: true,
      includeCvv: true,
      customCvv: "",
      expirationMonth: "random",
      expirationYear: "random",
      includeMoney: false,
      currency: "USD",
      balance: "500-1000"
    };

    console.log('[Zarif] API Payload:', payload);
    console.log('[Zarif] Making API request to cardbingenerator.com...');

    // Add timeout to fetch request (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // Try direct API call first, then fallback to CORS proxy if blocked
    const apiUrl = 'https://cardbingenerator.com/api.php';
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(apiUrl);

    let response;
    let usedProxy = false;

    try {
      console.log('[Zarif] Attempting direct API call...');
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Origin': 'https://cardbingenerator.com',
          'Referer': 'https://cardbingenerator.com/index.php?page=generator'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch (directError) {
      console.warn('[Zarif] Direct API call failed, trying CORS proxy:', directError.message);
      console.log('[Zarif] Using proxy:', proxyUrl);

      try {
        response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        usedProxy = true;
        console.log('[Zarif] CORS proxy request successful');
      } catch (proxyError) {
        clearTimeout(timeoutId);
        if (proxyError.name === 'AbortError') {
          console.error('[Zarif] API request timed out after 30 seconds');
          callback({ success: false, error: 'API request timed out. Please try again.' });
        } else {
          console.error('[Zarif] Both direct and proxy requests failed:', proxyError);
          callback({ success: false, error: 'Unable to reach API. Check your internet connection.' });
        }
        return;
      }
    }

    clearTimeout(timeoutId);

    console.log('[Zarif] API Response Status:', response.status, response.statusText);
    console.log('[Zarif] Response OK:', response.ok);
    console.log('[Zarif] Used proxy:', usedProxy);

    if (!response.ok) {
      console.error('[Zarif] API request failed with status:', response.status);
      callback({ success: false, error: `API request failed: ${response.status} ${response.statusText}` });
      return;
    }

    const data = await response.json();
    console.log('[Zarif] API Response Data:', data);

    if (data.success && data.data && data.data.cards) {
      console.log('[Zarif] Successfully received', data.data.cards.length, 'cards from API');
      // Use actual API card data with custom expiry
      const cards = data.data.cards.map((cardData, idx) => {
        let cardNumber, cvv;

        // Handle both string format ("cardnumber|mm|yy|cvv") and object format
        if (typeof cardData === 'string') {
          const parts = cardData.split('|');
          cardNumber = parts[0] || generateCardWithLuhn(cleanedBin);
          cvv = parts[3] || String(Math.floor(Math.random() * 900) + 100);
        } else if (typeof cardData === 'object') {
          // API returned object format
          cardNumber = cardData.card_number || cardData.cardNumber || cardData.number || generateCardWithLuhn(cleanedBin);
          cvv = cardData.cvv || cardData.cvc || cardData.cvv2 || String(Math.floor(Math.random() * 900) + 100);
        } else {
          // Fallback to generated
          cardNumber = generateCardWithLuhn(cleanedBin);
          cvv = String(Math.floor(Math.random() * 900) + 100);
        }

        return {
          serial_number: idx + 1,
          card_number: cardNumber,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          cvv: cvv,
          full_format: `${cardNumber}|${expiryMonth}|${expiryYear}|${cvv}`
        };
      });

      console.log('[Zarif] Processed cards with custom expiry');
      const randomData = generateRandomData(country);
      console.log('[Zarif] Generated random data for country:', country);
      await storeAndFill(cards, randomData);
    } else {
      console.error('[Zarif] API response missing cards data:', data);
      callback({ success: false, error: 'No cards generated from API. Response: ' + JSON.stringify(data) });
    }

  } catch (error) {
    console.error('[Zarif] Generation error:', error);
    console.error('[Zarif] Error stack:', error.stack);
    callback({ success: false, error: error.message || 'Unknown error occurred' });
  }
}

async function generatePrecardsFromAPI(bin, callback, method = 'api', country = 'IN') {
  let expiryMonth = HARDCODED_EXPIRY_MONTH;
  let expiryYear = HARDCODED_EXPIRY_YEAR;

  if (country === 'IN') {
    expiryMonth = INDIA_EXPIRY_MONTH;
    expiryYear = INDIA_EXPIRY_YEAR;
  }

  let cleanedBin = '';

  const storePrecards = (cards, randomData) => {
    chrome.storage.local.set({
      precards: cards,
      precardRandomData: randomData
    });

    callback({ success: true, cards: cards });
  };

  try {
    cleanedBin = cleanBin(bin);

    if (cleanedBin.length < 6) {
      console.error('[Zarif Precards] BIN validation failed:', cleanedBin);
      callback({ success: false, error: 'BIN must be at least 6 digits' });
      return;
    }

    console.log('[Zarif Precards] Starting precard generation for country:', country);
    console.log('[Zarif Precards] Using BIN:', cleanedBin);

    const payload = {
      action: "generateAdvance",
      customBin: cleanedBin,
      format: "pipe",
      quantity: 10,
      includeDate: true,
      includeCvv: true,
      customCvv: "",
      expirationMonth: "random",
      expirationYear: "random",
      includeMoney: false,
      currency: "USD",
      balance: "500-1000"
    };

    console.log('[Zarif Precards] Making API request...');

    // Add timeout to fetch request (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('https://cardbingenerator.com/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Origin': 'https://cardbingenerator.com',
          'Referer': 'https://cardbingenerator.com/index.php?page=generator'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('[Zarif Precards] API Response Status:', response.status);

      if (!response.ok) {
        console.error('[Zarif Precards] API request failed:', response.status);
        callback({ success: false, error: `API request failed: ${response.status}` });
        return;
      }

      const data = await response.json();
      console.log('[Zarif Precards] API Response:', data);

      if (data.success && data.data && data.data.cards) {
        console.log('[Zarif Precards] Received', data.data.cards.length, 'cards');
        // Use actual API card data with custom expiry for precards
        const cards = data.data.cards.map((cardString, idx) => {
          // Parse API response format: "cardnumber|mm|yy|cvv"
          const parts = cardString.split('|');
          return {
            serial_number: idx + 1,
            card_number: parts[0] || generateCardWithLuhn(cleanedBin),
            expiry_month: expiryMonth,
            expiry_year: expiryYear,
            cvv: parts[3] || String(Math.floor(Math.random() * 900) + 100),
            full_format: `${parts[0]}|${expiryMonth}|${expiryYear}|${parts[3]}`
          };
        });

        const randomData = generateRandomData(country);
        storePrecards(cards, randomData);

      } else {
        console.error('[Zarif Precards] Missing cards data:', data);
        callback({ success: false, error: 'No cards generated from API' });
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('[Zarif Precards] Request timed out');
        callback({ success: false, error: 'API request timed out' });
      } else {
        throw fetchError;
      }
    }

  } catch (error) {
    console.error('[Zarif Precards] Error:', error);
    callback({ success: false, error: error.message || 'Unknown error' });
  }
}
