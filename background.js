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

// UK First Names
const UK_FIRST_NAMES = [
  "Oliver", "George", "Harry", "Jack", "Jacob", "Noah", "Charlie", "Muhammad",
  "Thomas", "Oscar", "William", "James", "Leo", "Alfie", "Henry", "Archie",
  "Olivia", "Amelia", "Isla", "Ava", "Emily", "Isabella", "Mia", "Poppy",
  "Ella", "Lily", "Grace", "Sophie", "Evie", "Charlotte", "Freya", "Florence"
];

// UK Last Names
const UK_LAST_NAMES = [
  "Smith", "Jones", "Williams", "Taylor", "Brown", "Davies", "Evans", "Wilson",
  "Thomas", "Roberts", "Johnson", "Lewis", "Walker", "Robinson", "Wood", "Thompson",
  "White", "Watson", "Jackson", "Wright", "Green", "Harris", "Cooper", "King",
  "Lee", "Martin", "Clarke", "James", "Morgan", "Hughes", "Edwards", "Hill"
];

// UK Cities
const UK_CITIES = [
  { city: "London", state: "Greater London", zip: "SW1A 1AA" },
  { city: "Manchester", state: "Greater Manchester", zip: "M1 1AD" },
  { city: "Birmingham", state: "West Midlands", zip: "B1 1AA" },
  { city: "Leeds", state: "West Yorkshire", zip: "LS1 1AA" },
  { city: "Liverpool", state: "Merseyside", zip: "L1 1AA" },
  { city: "Bristol", state: "Bristol", zip: "BS1 1AA" },
  { city: "Edinburgh", state: "Scotland", zip: "EH1 1AA" },
  { city: "Glasgow", state: "Scotland", zip: "G1 1AA" },
  { city: "Cardiff", state: "Wales", zip: "CF10 1AA" },
  { city: "Newcastle", state: "Tyne and Wear", zip: "NE1 1AA" }
];

// UK Streets
const UK_STREETS = [
  "High Street", "Station Road", "Church Lane", "Park Avenue", "Victoria Road",
  "Mill Lane", "Kings Road", "Queens Drive", "Green Lane", "Manor Road",
  "London Road", "York Street", "Albert Road", "Main Street", "Market Street"
];

// USA First Names
const USA_FIRST_NAMES = [
  "James", "Michael", "Robert", "John", "David", "William", "Richard", "Joseph",
  "Thomas", "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald",
  "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia",
  "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Sofia", "Avery", "Ella"
];

// USA Last Names
const USA_LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young"
];

// USA Cities
const USA_CITIES = [
  { city: "New York", state: "New York", zip: "10001" },
  { city: "Los Angeles", state: "California", zip: "90001" },
  { city: "Chicago", state: "Illinois", zip: "60601" },
  { city: "Houston", state: "Texas", zip: "77001" },
  { city: "Phoenix", state: "Arizona", zip: "85001" },
  { city: "Philadelphia", state: "Pennsylvania", zip: "19101" },
  { city: "San Antonio", state: "Texas", zip: "78201" },
  { city: "San Diego", state: "California", zip: "92101" },
  { city: "Dallas", state: "Texas", zip: "75201" },
  { city: "Miami", state: "Florida", zip: "33101" }
];

// USA Streets
const USA_STREETS = [
  "Main Street", "Oak Avenue", "Maple Drive", "Cedar Lane", "Pine Street",
  "Elm Street", "Washington Boulevard", "Lincoln Avenue", "Park Place", "Broadway",
  "First Street", "Second Avenue", "Third Street", "Lake Drive", "River Road"
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== HARDCODED CONFIGURATION FOR OPENAI =====
const EXTENSION_VERSION = '6.4.6';

// ===== HOT RELOAD FOR DEVELOPMENT =====
// Checks for file changes every 2 seconds and reloads extension if detected
const HOT_RELOAD_ENABLED = true;
const HOT_RELOAD_INTERVAL = 2000; // 2 seconds

let lastModifiedTimes = {};

async function checkForFileChanges() {
  if (!HOT_RELOAD_ENABLED) return;

  try {
    // Get list of extension files to watch
    const filesToWatch = ['background.js', 'content.js', 'popup.js', 'popup.html', 'styles.css', 'manifest.json'];

    for (const file of filesToWatch) {
      try {
        const response = await fetch(chrome.runtime.getURL(file), { cache: 'no-store' });
        const text = await response.text();
        const currentHash = hashCode(text);

        if (lastModifiedTimes[file] && lastModifiedTimes[file] !== currentHash) {
          console.log(`[Zarif Hot Reload] File changed: ${file} - Reloading extension...`);
          chrome.runtime.reload();
          return;
        }

        lastModifiedTimes[file] = currentHash;
      } catch (e) {
        // File might not exist, skip it
      }
    }
  } catch (error) {
    console.error('[Zarif Hot Reload] Error checking for changes:', error);
  }
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

// Start hot reload watcher
if (HOT_RELOAD_ENABLED) {
  console.log('[Zarif Hot Reload] Hot reload enabled - watching for file changes...');
  // Initial hash capture
  checkForFileChanges();
  // Start interval check
  setInterval(checkForFileChanges, HOT_RELOAD_INTERVAL);
}

// Hardcoded BIN and Expiry for South Korea (default)
const HARDCODED_BIN = '625814260209';
const HARDCODED_EXPIRY_MONTH = '04';
const HARDCODED_EXPIRY_YEAR = '2027';

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
  console.log('[Zarif v6.2.0] generateRandomData called with country:', country);
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

  if (country === 'UK' || country === 'GB') {
    // Generate unique UK data
    const cityData = randomChoice(UK_CITIES);
    const houseNumber = Math.floor(Math.random() * 200) + 1;
    const street = randomChoice(UK_STREETS);
    return {
      name: `${randomChoice(UK_FIRST_NAMES)} ${randomChoice(UK_LAST_NAMES)}`,
      address: `${houseNumber} ${street}`,
      address2: '',
      city: cityData.city,
      zip: cityData.zip,
      state: cityData.state,
      country: 'GB'
    };
  }

  if (country === 'US' || country === 'USA') {
    // Generate unique USA data
    const cityData = randomChoice(USA_CITIES);
    const houseNumber = Math.floor(Math.random() * 9999) + 1;
    const street = randomChoice(USA_STREETS);
    return {
      name: `${randomChoice(USA_FIRST_NAMES)} ${randomChoice(USA_LAST_NAMES)}`,
      address: `${houseNumber} ${street}`,
      address2: '',
      city: cityData.city,
      zip: cityData.zip,
      state: cityData.state,
      country: 'US'
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
  } else if (request.action === 'createChatGPTAccount') {
    createChatGPTAccount();
    sendResponse({ success: true });
    return true;
  } else if (request.action === 'fetchK12Code') {
    fetchK12VerificationCode(request.email, request.emailName);
    sendResponse({ success: true });
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

    console.log('[Zarif v6.2.0] ===== CARD GENERATION START =====');
    console.log('[Zarif v6.2.0] Country parameter received:', country);
    console.log('[Zarif v6.2.0] Country type:', typeof country);
    console.log('[Zarif v6.2.0] Using BIN:', cleanedBin);
    console.log('[Zarif v6.2.0] Expiry:', expiryMonth + '/' + expiryYear);

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

    // Try direct API call first, then fallback to CORS proxy if blocked
    const apiUrl = 'https://cardbingenerator.com/api.php';
    const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(apiUrl);

    let response;
    let usedProxy = false;

    try {
      console.log('[Zarif Precards] Attempting direct API call...');
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
      console.warn('[Zarif Precards] Direct API call failed, trying CORS proxy:', directError.message);
      console.log('[Zarif Precards] Using proxy:', proxyUrl);

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
        console.log('[Zarif Precards] CORS proxy request successful');
      } catch (proxyError) {
        clearTimeout(timeoutId);
        if (proxyError.name === 'AbortError') {
          console.error('[Zarif Precards] API request timed out after 30 seconds');
          callback({ success: false, error: 'API request timed out. Please try again.' });
        } else {
          console.error('[Zarif Precards] Both direct and proxy requests failed:', proxyError);
          callback({ success: false, error: 'Unable to reach API. Check your internet connection.' });
        }
        return;
      }
    }

    clearTimeout(timeoutId);

    console.log('[Zarif Precards] API Response Status:', response.status, response.statusText);
    console.log('[Zarif Precards] Used proxy:', usedProxy);

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

      const randomData = generateRandomData(country);
      storePrecards(cards, randomData);

    } else {
      console.error('[Zarif Precards] Missing cards data:', data);
      callback({ success: false, error: 'No cards generated from API. Response: ' + JSON.stringify(data) });
    }

  } catch (error) {
    console.error('[Zarif Precards] Error:', error);
    callback({ success: false, error: error.message || 'Unknown error' });
  }
}

// ========== K12 AUTO ACCOUNT CREATION ==========

const TEMP_MAIL_URL = 'https://em.bjedu.tech/en/';
const TEMP_MAIL_DOMAIN = 'erzi.me';

// K12 state management
let k12State = {
  email: '',
  password: '',
  tempMailTabId: null,
  chatgptTabId: null,
  verificationCode: '',
  step: 0
};

// Generate unique email name (8 random alphanumeric chars)
function generateEmailName() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate unique password: Zarif# + 6 random chars (total 12+ chars)
function generatePassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'Zarif#' + suffix;
}

// Send progress update to popup
function sendK12Progress(percent, status) {
  chrome.runtime.sendMessage({
    action: 'k12Progress',
    percent: percent,
    status: status
  }).catch(() => { }); // Ignore if popup closed
}

// Send completion to popup
function sendK12Complete(email, password) {
  chrome.runtime.sendMessage({
    action: 'k12Complete',
    email: email,
    password: password
  }).catch(() => { });
}

// Send error to popup
function sendK12Error(message) {
  chrome.runtime.sendMessage({
    action: 'k12Error',
    message: message
  }).catch(() => { });
}

// Main orchestrator for ChatGPT account creation
async function createChatGPTAccount() {
  console.log('[K12] Starting account creation...');

  try {
    // Generate unique credentials
    const emailName = generateEmailName();
    k12State.email = emailName + '@' + TEMP_MAIL_DOMAIN;
    k12State.password = generatePassword();
    k12State.step = 0;

    console.log('[K12] Generated email:', k12State.email);
    console.log('[K12] Generated password:', k12State.password);

    // Step 1: Create temp email (10%)
    sendK12Progress(10, 'Creating temp email...');
    const tempMailTab = await chrome.tabs.create({
      url: TEMP_MAIL_URL,
      active: false
    });
    k12State.tempMailTabId = tempMailTab.id;
    console.log('[K12] Opened temp mail tab:', tempMailTab.id);

    // Wait for temp mail page to load
    await waitForTabLoad(tempMailTab.id);
    await sleep(3000); // Extra wait for JS to initialize

    // Create the email
    await chrome.scripting.executeScript({
      target: { tabId: tempMailTab.id },
      func: createTempEmail,
      args: [emailName]
    });

    await sleep(3000); // Wait for email creation

    // Step 2: Navigate to ChatGPT signup (20%)
    sendK12Progress(20, 'Opening ChatGPT signup...');

    const chatgptTab = await chrome.tabs.create({
      url: 'https://chatgpt.com/',
      active: false
    });
    k12State.chatgptTabId = chatgptTab.id;
    console.log('[K12] Opened ChatGPT tab:', chatgptTab.id);

    await waitForTabLoad(chatgptTab.id);
    await sleep(2000);

    // Click signup button
    sendK12Progress(25, 'Clicking Sign Up...');
    await chrome.scripting.executeScript({
      target: { tabId: chatgptTab.id },
      func: clickSignupButton
    });

    // Wait for authentication page
    await sleep(3000);
    await waitForUrlContains(chatgptTab.id, 'auth.openai.com', 15000);
    await sleep(2000);

    // Step 3: Enter email (35%)
    sendK12Progress(35, 'Entering email...');
    await chrome.scripting.executeScript({
      target: { tabId: chatgptTab.id },
      func: fillEmailAndContinue,
      args: [k12State.email]
    });

    // Wait for password page
    await sleep(3000);
    await waitForUrlContains(chatgptTab.id, 'password', 15000);
    await sleep(2000);

    // Step 4: Enter password (50%)
    sendK12Progress(50, 'Setting password...');
    await chrome.scripting.executeScript({
      target: { tabId: chatgptTab.id },
      func: fillPasswordAndContinue,
      args: [k12State.password]
    });

    // Wait for verification page
    await sleep(3000);
    await waitForUrlContains(chatgptTab.id, 'verification', 15000);

    // Step 5: Get and enter verification code (65%)
    sendK12Progress(65, 'Waiting for verification code...');

    // Refresh temp mail to get code
    await chrome.scripting.executeScript({
      target: { tabId: tempMailTab.id },
      func: clickRefreshAndOpenEmail
    });
    await sleep(3000);

    // Poll for verification code
    let verificationCode = '';
    let pollAttempts = 0;
    const maxPollAttempts = 40; // 2 minutes max

    while (!verificationCode && pollAttempts < maxPollAttempts) {
      pollAttempts++;
      sendK12Progress(65 + Math.floor(pollAttempts * 0.4), 'Checking inbox... (' + pollAttempts + ')');

      const result = await chrome.scripting.executeScript({
        target: { tabId: tempMailTab.id },
        func: getVerificationCode
      });

      if (result && result[0] && result[0].result) {
        verificationCode = result[0].result;
        console.log('[K12] Got verification code:', verificationCode);
        break;
      }

      // Every 5 attempts, try refresh again
      if (pollAttempts % 5 === 0) {
        await chrome.scripting.executeScript({
          target: { tabId: tempMailTab.id },
          func: clickRefreshAndOpenEmail
        });
      }

      await sleep(3000);
    }

    if (!verificationCode) {
      throw new Error('Verification code not received after 2 minutes');
    }

    // Step 6: Enter verification code (85%)
    sendK12Progress(85, 'Entering verification code...');
    k12State.verificationCode = verificationCode;

    await chrome.scripting.executeScript({
      target: { tabId: chatgptTab.id },
      func: fillVerificationCodeAndContinue,
      args: [verificationCode]
    });

    // Wait for about-you page
    await sleep(3000);
    await waitForUrlContains(chatgptTab.id, 'about-you', 15000);
    await sleep(2000);

    // Step 7: Fill name and birthday (95%)
    sendK12Progress(95, 'Completing profile...');
    await chrome.scripting.executeScript({
      target: { tabId: chatgptTab.id },
      func: fillNameAndBirthdayAndContinue
    });

    // Wait for completion
    await sleep(5000);

    // Done! (100%)
    sendK12Progress(100, 'Account created!');
    await sleep(2000);

    // Close hidden tabs
    try {
      if (k12State.tempMailTabId) chrome.tabs.remove(k12State.tempMailTabId);
      if (k12State.chatgptTabId) chrome.tabs.remove(k12State.chatgptTabId);
    } catch (e) {
      console.log('[K12] Tab cleanup error:', e);
    }

    // Send success to popup
    sendK12Complete(k12State.email, k12State.password);
    console.log('[K12] Account creation completed successfully!');

  } catch (error) {
    console.error('[K12] Error:', error);
    sendK12Error(error.message);

    // Cleanup tabs on error
    try {
      if (k12State.tempMailTabId) chrome.tabs.remove(k12State.tempMailTabId);
      if (k12State.chatgptTabId) chrome.tabs.remove(k12State.chatgptTabId);
    } catch (e) { }
  }
}

// Wait for tab URL to contain specific string
function waitForUrlContains(tabId, urlPart, timeout = 15000) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkUrl = async () => {
      try {
        const tab = await chrome.tabs.get(tabId);
        if (tab.url && tab.url.includes(urlPart)) {
          resolve(true);
          return;
        }
      } catch (e) { }

      if (Date.now() - startTime > timeout) {
        console.log('[K12] URL wait timeout for:', urlPart);
        resolve(false);
        return;
      }

      setTimeout(checkUrl, 500);
    };

    checkUrl();
  });
}

// Wait for tab to finish loading
function waitForTabLoad(tabId) {
  return new Promise((resolve) => {
    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);

    // Timeout after 30 seconds
    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }, 30000);
  });
}

// Helper sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === Functions to be injected into pages ===

// Injected into temp mail page to create email
function createTempEmail(emailName) {
  console.log('[K12 Create] Creating email:', emailName);

  // Find the email input field
  const allInputs = document.querySelectorAll('input[type="text"], input:not([type])');
  let emailInput = null;

  for (const input of allInputs) {
    const placeholder = (input.placeholder || '').toLowerCase();
    if (placeholder.includes('input') || placeholder.includes('name') || !input.readOnly) {
      emailInput = input;
      break;
    }
  }

  if (!emailInput) {
    emailInput = document.querySelector('input[type="text"]:not([readonly])');
  }

  if (emailInput) {
    console.log('[K12 Create] Found input, filling:', emailName);
    emailInput.value = '';
    emailInput.focus();

    // Type character by character
    for (const char of emailName) {
      emailInput.value += char;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Try to select erzi.me domain if there's a dropdown
  setTimeout(() => {
    const domainSelects = document.querySelectorAll('select');
    for (const select of domainSelects) {
      const options = select.querySelectorAll('option');
      for (const opt of options) {
        if (opt.value.includes('erzi.me') || opt.textContent.includes('erzi.me')) {
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          console.log('[K12 Create] Selected erzi.me domain');
          break;
        }
      }
    }

    // Click create button
    setTimeout(() => {
      const buttons = document.querySelectorAll('button');
      let createBtn = null;

      for (const btn of buttons) {
        const text = btn.textContent.toLowerCase().trim();
        if (text.includes('create') || text.includes('register') || text.includes('submit')) {
          createBtn = btn;
          break;
        }
      }

      if (createBtn) {
        console.log('[K12 Create] Clicking create button');
        createBtn.click();
      }
    }, 500);
  }, 500);
}

// Injected into temp mail to get verification code - finds LATEST code
function getVerificationCode() {
  // Look for all 6-digit codes in the page and return the LATEST one
  const allCodes = [];

  // First, try to click on the latest email from OpenAI if inbox is showing
  const emailItems = document.querySelectorAll('[class*="mail"], [class*="item"], tr, li');
  let foundOpenAIEmail = false;

  for (const item of emailItems) {
    const text = (item.textContent || '').toLowerCase();
    if ((text.includes('openai') || text.includes('chatgpt') || text.includes('verification')) && !foundOpenAIEmail) {
      // This might be the email list item - click to open it
      item.click();
      foundOpenAIEmail = true;
    }
  }

  // Now search for verification codes in the entire page
  const pageText = document.body.innerText;

  // Find all patterns like "code is XXXXXX" or "Your code: XXXXXX"
  const codePatterns = pageText.match(/(?:code|Code|CODE)[:\s]+(?:is\s+)?(\d{6})/gi) || [];
  for (const match of codePatterns) {
    const code = match.match(/(\d{6})/)?.[1];
    if (code) allCodes.push(code);
  }

  // Also find any 6-digit numbers near OpenAI/ChatGPT keywords
  const sections = pageText.split(/[\n\r]+/);
  for (const line of sections) {
    if (line.toLowerCase().includes('openai') || line.toLowerCase().includes('chatgpt')) {
      const codes = line.match(/\b(\d{6})\b/g) || [];
      allCodes.push(...codes);
    }
  }

  // Find standalone 6-digit codes in visible elements that look like codes
  const codeElements = document.querySelectorAll('[class*="code"], [class*="otp"], [class*="verify"], strong, b, span');
  for (const el of codeElements) {
    const text = el.textContent.trim();
    if (/^\d{6}$/.test(text)) {
      allCodes.push(text);
    }
  }

  // Return the LAST (most recent) code found, or null
  if (allCodes.length > 0) {
    console.log('[K12] All codes found:', allCodes);
    return allCodes[allCodes.length - 1]; // Return last (latest) code
  }

  return null;
}

// Injected into ChatGPT to start signup
function startChatGPTSignup(email) {
  // Click sign up button
  const signupBtn = document.querySelector('[data-testid="login-button"]') ||
    Array.from(document.querySelectorAll('a, button')).find(b =>
      b.textContent.toLowerCase().includes('sign up'));

  if (signupBtn) {
    signupBtn.click();
  }

  // Wait for email input
  setTimeout(() => {
    const emailInput = document.querySelector('input[type="email"]') ||
      document.querySelector('input[name="email"]') ||
      document.querySelector('input[autocomplete="email"]');

    if (emailInput) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Click continue
      setTimeout(() => {
        const continueBtn = document.querySelector('button[type="submit"]') ||
          Array.from(document.querySelectorAll('button')).find(b =>
            b.textContent.toLowerCase().includes('continue'));
        if (continueBtn) continueBtn.click();
      }, 500);
    }
  }, 3000);
}

// Injected to fill password
function fillPassword(password) {
  const passwordInput = document.querySelector('input[type="password"]') ||
    document.querySelector('input[name="password"]');

  if (passwordInput) {
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Click continue
    setTimeout(() => {
      const continueBtn = document.querySelector('button[type="submit"]') ||
        Array.from(document.querySelectorAll('button')).find(b =>
          b.textContent.toLowerCase().includes('continue'));
      if (continueBtn) continueBtn.click();
    }, 500);
  }
}

// Injected to fill verification code
function fillVerificationCode(code) {
  const codeInput = document.querySelector('input[name="code"]') ||
    document.querySelector('input[type="text"]') ||
    document.querySelector('input[autocomplete="one-time-code"]');

  if (codeInput) {
    codeInput.value = code;
    codeInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Click continue
    setTimeout(() => {
      const continueBtn = document.querySelector('button[type="submit"]') ||
        Array.from(document.querySelectorAll('button')).find(b =>
          b.textContent.toLowerCase().includes('continue'));
      if (continueBtn) continueBtn.click();
    }, 500);
  }
}

// Injected to fill name and birthday
function fillNameAndBirthday() {
  // Fill name
  const nameInput = document.querySelector('input[name="name"]') ||
    document.querySelector('input[placeholder*="name"]') ||
    document.querySelector('input[type="text"]');

  if (nameInput) {
    nameInput.value = 'User' + Math.floor(Math.random() * 10000);
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Fill birthday - try to find date inputs
  // Birthday format: MM/DD/YYYY - random year between 1980-2000
  const dateInput = document.querySelector('input[placeholder*="Birthday"]') ||
    document.querySelector('input[type="date"]');

  if (dateInput) {
    const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const randomYear = String(1980 + Math.floor(Math.random() * 21)); // 1980-2000

    if (dateInput.type === 'date') {
      dateInput.value = `${randomYear}-${randomMonth}-${randomDay}`;
    } else {
      dateInput.value = `${randomMonth}/${randomDay}/${randomYear}`;
    }
    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Click continue
  setTimeout(() => {
    const continueBtn = document.querySelector('button[type="submit"]') ||
      Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.toLowerCase().includes('continue'));
    if (continueBtn) continueBtn.click();
  }, 1000);
}

// === NEW SEPARATE PAGE HANDLERS FOR BETTER CONTROL ===

// Just click the signup button on chatgpt.com
function clickSignupButton() {
  console.log('[K12] Clicking signup button...');

  // Look for "Sign up" button
  const signupBtn = Array.from(document.querySelectorAll('a, button')).find(b => {
    const text = b.textContent.toLowerCase().trim();
    return text.includes('sign up') || text.includes('get started');
  });

  if (signupBtn) {
    console.log('[K12] Found signup button');
    signupBtn.click();
  } else {
    // Try alternate: look for data-testid
    const altBtn = document.querySelector('[data-testid="login-button"]');
    if (altBtn) altBtn.click();
  }
}

// Fill email on auth.openai.com and click continue
function fillEmailAndContinue(email) {
  console.log('[K12] Filling email:', email);

  const emailInput = document.querySelector('input[type="email"]') ||
    document.querySelector('input[name="email"]') ||
    document.querySelector('input[autocomplete="email"]') ||
    document.querySelector('input[inputmode="email"]');

  if (emailInput) {
    emailInput.focus();
    emailInput.value = '';

    // Type character by character
    for (const char of email) {
      emailInput.value += char;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));

    // Click continue after short delay
    setTimeout(() => {
      const continueBtn = document.querySelector('button[type="submit"]') ||
        Array.from(document.querySelectorAll('button')).find(b =>
          b.textContent.toLowerCase().includes('continue'));
      if (continueBtn) {
        console.log('[K12] Clicking continue after email');
        continueBtn.click();
      }
    }, 800);
  }
}

// Fill password and click continue - Robust version
function fillPasswordAndContinue(password) {
  console.log('[K12] Filling password');

  const passwordInput = document.querySelector('input[type="password"]') ||
    document.querySelector('input[name="password"]');

  if (passwordInput) {
    passwordInput.focus();
    passwordInput.value = '';

    // Type character by character with slight delay to mimic human speed and trigger frameworks
    let i = 0;
    const typeChar = () => {
      if (i < password.length) {
        passwordInput.value += password[i];
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        i++;
        setTimeout(typeChar, 10);
      } else {
        // Trigger final events
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
        passwordInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

        // Wait for button to enable and click
        checkAndClickContinue(0);
      }
    };

    typeChar();
  }
}

// Helper to check button state and click
function checkAndClickContinue(attempts) {
  if (attempts > 50) return; // Stop after 5 seconds

  const continueBtn = document.querySelector('button[type="submit"]') ||
    Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.toLowerCase().includes('continue'));

  if (continueBtn) {
    if (!continueBtn.disabled) {
      console.log('[K12] Clicking enabled allow/continue button');
      continueBtn.click();

      // Double check click worked by trying again if still present
      setTimeout(() => {
        if (document.body.contains(continueBtn)) {
          continueBtn.click();
        }
      }, 1000);
    } else {
      // Button disabled, re-trigger events on input
      console.log('[K12] Button disabled, re-triggering events...');
      const passwordInput = document.querySelector('input[type="password"]');
      if (passwordInput) {
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setTimeout(() => checkAndClickContinue(attempts + 1), 200);
    }
  } else {
    setTimeout(() => checkAndClickContinue(attempts + 1), 200);
  }
}

// Fill verification code and click continue
function fillVerificationCodeAndContinue(code) {
  console.log('[K12] Filling verification code:', code);

  const codeInput = document.querySelector('input[name="code"]') ||
    document.querySelector('input[autocomplete="one-time-code"]') ||
    document.querySelector('input[inputmode="numeric"]') ||
    document.querySelector('input[type="text"]');

  if (codeInput) {
    codeInput.focus();
    codeInput.value = '';

    for (const char of code) {
      codeInput.value += char;
      codeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    codeInput.dispatchEvent(new Event('change', { bubbles: true }));

    setTimeout(() => {
      const continueBtn = document.querySelector('button[type="submit"]') ||
        Array.from(document.querySelectorAll('button')).find(b =>
          b.textContent.toLowerCase().includes('continue'));
      if (continueBtn) {
        console.log('[K12] Clicking continue after code');
        continueBtn.click();
      }
    }, 800);
  }
}

// Fill name and birthday, then click continue
function fillNameAndBirthdayAndContinue() {
  console.log('[K12] Filling name and birthday');

  // Fill name
  const nameInput = document.querySelector('input[name="name"]') ||
    document.querySelector('input[placeholder*="name"]') ||
    document.querySelector('input[type="text"]');

  if (nameInput && !nameInput.value) {
    const randomName = 'User' + Math.floor(Math.random() * 90000 + 10000);
    nameInput.value = randomName;
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('[K12] Filled name:', randomName);
  }

  // Fill birthday (MM/DD/YYYY format, year 1980-2000)
  const birthdayInput = document.querySelector('input[placeholder*="Birthday"]') ||
    document.querySelector('input[name*="birthday"]') ||
    document.querySelectorAll('input[type="text"]')[1]; // Second text input

  if (birthdayInput && !birthdayInput.value) {
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const year = String(1980 + Math.floor(Math.random() * 21));

    const birthday = `${month}/${day}/${year}`;
    birthdayInput.value = birthday;
    birthdayInput.dispatchEvent(new Event('input', { bubbles: true }));
    birthdayInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('[K12] Filled birthday:', birthday);
  }

  // Click continue
  setTimeout(() => {
    const continueBtn = document.querySelector('button[type="submit"]') ||
      Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.toLowerCase().includes('continue'));
    if (continueBtn) {
      console.log('[K12] Clicking continue after profile');
      continueBtn.click();
    }
  }, 1000);
}

// ========== Fetch Verification Code for Login ==========

async function fetchK12VerificationCode(email, emailName) {
  console.log('[K12 Code] Fetching code for:', email);

  try {
    // Open temp mail in hidden tab with login
    const loginUrl = TEMP_MAIL_URL;
    const tempMailTab = await chrome.tabs.create({
      url: loginUrl,
      active: false
    });

    // Wait for page to load
    await waitForTabLoad(tempMailTab.id);
    await sleep(2000);

    // First, log in with the email username
    await chrome.scripting.executeScript({
      target: { tabId: tempMailTab.id },
      func: loginToTempMail,
      args: [emailName]
    });

    // Wait for login and inbox to load
    await sleep(5000);

    // Now try to refresh and get the code
    await chrome.scripting.executeScript({
      target: { tabId: tempMailTab.id },
      func: clickRefreshAndOpenEmail
    });

    await sleep(3000);

    // Poll for verification code
    let verificationCode = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!verificationCode && attempts < maxAttempts) {
      attempts++;

      const result = await chrome.scripting.executeScript({
        target: { tabId: tempMailTab.id },
        func: getVerificationCode
      });

      if (result && result[0] && result[0].result) {
        verificationCode = result[0].result;
        console.log('[K12 Code] Found code:', verificationCode);
      } else {
        await sleep(2000);
      }
    }

    // Close the tab
    try {
      chrome.tabs.remove(tempMailTab.id);
    } catch (e) { }

    // Send result to popup
    chrome.runtime.sendMessage({
      action: 'k12CodeFetched',
      code: verificationCode
    }).catch(() => { });

  } catch (error) {
    console.error('[K12 Code] Error:', error);
    chrome.runtime.sendMessage({
      action: 'k12CodeFetched',
      code: null
    }).catch(() => { });
  }
}

// Injected to login to temp mail with existing email - MUST SWITCH ACCOUNTS
function loginToTempMail(emailName) {
  console.log('[K12 Login] Switching to email:', emailName);

  // Step 1: Click on "User" tab at the top to access login
  const userTab = Array.from(document.querySelectorAll('span, a, div, button')).find(el => {
    const text = el.textContent.trim().toLowerCase();
    return text === 'user' || text.includes('user login');
  });

  if (userTab) {
    console.log('[K12 Login] Found User tab, clicking...');
    userTab.click();
  }

  // Step 2: Wait for login form, then fill and submit
  setTimeout(() => {
    // Clear any existing value and enter the new email name
    const allInputs = document.querySelectorAll('input[type="text"], input:not([type])');
    let emailInput = null;

    for (const input of allInputs) {
      const placeholder = (input.placeholder || '').toLowerCase();
      if (placeholder.includes('input') || placeholder.includes('email') || placeholder.includes('name')) {
        emailInput = input;
        break;
      }
    }

    // If no input found by placeholder, take the first visible text input
    if (!emailInput) {
      emailInput = document.querySelector('input[type="text"]:not([readonly])') ||
        document.querySelector('input:not([type]):not([readonly])');
    }

    if (emailInput) {
      console.log('[K12 Login] Found email input, filling:', emailName);
      emailInput.value = '';
      emailInput.focus();

      // Type the email name character by character for better compatibility
      for (const char of emailName) {
        emailInput.value += char;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Step 3: Click the login/submit button
    setTimeout(() => {
      const buttons = document.querySelectorAll('button');
      let loginBtn = null;

      for (const btn of buttons) {
        const text = btn.textContent.toLowerCase().trim();
        if (text.includes('login') || text.includes('user login') || text.includes('submit')) {
          loginBtn = btn;
          break;
        }
      }

      // Also try finding by class
      if (!loginBtn) {
        loginBtn = document.querySelector('button[class*="login"]') ||
          document.querySelector('button[class*="submit"]');
      }

      if (loginBtn) {
        console.log('[K12 Login] Found login button, clicking...');
        loginBtn.click();
      }
    }, 800);
  }, 1500);
}

// Click refresh button and open latest email
function clickRefreshAndOpenEmail() {
  // Try to click refresh button
  const refreshBtn = document.querySelector('button[title*="Refresh"]') ||
    Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.toLowerCase().includes('refresh'));

  if (refreshBtn) {
    refreshBtn.click();
  }

  // Try to click on first email in list
  setTimeout(() => {
    const emailItems = document.querySelectorAll('[class*="mail"], [class*="item"], tr');
    for (const item of emailItems) {
      if (item.textContent.toLowerCase().includes('openai') ||
        item.textContent.toLowerCase().includes('chatgpt') ||
        item.textContent.toLowerCase().includes('code')) {
        item.click();
        break;
      }
    }
  }, 1000);
}
