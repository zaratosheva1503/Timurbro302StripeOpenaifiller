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
const EXTENSION_VERSION = '6.6.0';

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
const HARDCODED_BIN = '625814260207';
const HARDCODED_EXPIRY_MONTH = '01';
const HARDCODED_EXPIRY_YEAR = '2033';

// India BIN and Expiry
const INDIA_BIN = '551827706';
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
  } else if (request.action === 'checkLiveCC') {
    checkLiveCCCards(request.bin, request.country, request.expiryMonth, request.expiryYear);
    sendResponse({ success: true });
    return true;
  } else if (request.action === 'stopLiveCCCheck') {
    stopLiveCCCheck();
    sendResponse({ success: true });
    return true;
  } else if (request.action === 'trustedClick') {
    // Use Chrome Debugger API to send a real, trusted mouse click
    (async () => {
      const tabId = sender.tab.id;
      const { x, y } = request;

      try {
        // Attach debugger to the tab
        await chrome.debugger.attach({ tabId }, '1.3');
        console.log('[Debugger] Attached to tab', tabId);

        // Send mousePressed event
        await chrome.debugger.sendCommand({ tabId }, 'Input.dispatchMouseEvent', {
          type: 'mousePressed',
          x: x,
          y: y,
          button: 'left',
          clickCount: 1
        });

        // Send mouseReleased event
        await chrome.debugger.sendCommand({ tabId }, 'Input.dispatchMouseEvent', {
          type: 'mouseReleased',
          x: x,
          y: y,
          button: 'left',
          clickCount: 1
        });

        console.log('[Debugger] Clicked at', x, y);

        // Detach after a short delay
        setTimeout(async () => {
          try {
            await chrome.debugger.detach({ tabId });
            console.log('[Debugger] Detached from tab', tabId);
          } catch (e) {
            // Tab might be closed
          }
        }, 500);

        sendResponse({ success: true });
      } catch (error) {
        console.error('[Debugger] Error:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Will respond asynchronously
  } else if (request.action === 'liveccExtractResults') {
    // Handle results from content script
    if (sender.tab && request.results && request.results.result) {
      handleLiveCCResults(request.results.result.liveCards || [], sender.tab.id);
    }
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
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const chars = letters + digits;
  let suffix = '';
  suffix += digits.charAt(Math.floor(Math.random() * digits.length));
  for (let i = 0; i < 5; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  suffix = suffix.split('').sort(() => Math.random() - 0.5).join('');
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
  console.log('[K12] Starting account creation v6.4.8...');

  try {
    // Generate unique credentials
    const emailName = generateEmailName();
    k12State.email = emailName + '@' + TEMP_MAIL_DOMAIN;
    k12State.password = generatePassword();
    k12State.step = 0;

    console.log('[K12] Generated email:', k12State.email);
    console.log('[K12] Generated password:', k12State.password);
    await chrome.storage.local.set({
      k12PendingAccount: {
        email: k12State.email,
        password: k12State.password,
        createdAt: Date.now()
      }
    });

    // Step 1: Create temp email (10%)
    sendK12Progress(10, 'Creating temp email...');

    // Create INCOGNITO window for temp mail - no cookies/session from regular browser!
    console.log('[K12] Creating incognito window for temp mail...');
    let incognitoWindow;
    let tempMailTab;

    try {
      incognitoWindow = await chrome.windows.create({
        url: TEMP_MAIL_URL,
        incognito: true,
        focused: false,
        state: 'minimized'
      });
      tempMailTab = incognitoWindow.tabs[0];
      k12State.incognitoWindowId = incognitoWindow.id;
    } catch (e) {
      console.log('[K12] Incognito failed, using regular tab:', e.message);
      // Fallback to regular tab if incognito not allowed
      tempMailTab = await chrome.tabs.create({
        url: TEMP_MAIL_URL,
        active: false
      });
    }

    k12State.tempMailTabId = tempMailTab.id;
    console.log('[K12] Opened temp mail tab in incognito:', tempMailTab.id);

    // Wait for temp mail page to load
    await waitForTabLoad(tempMailTab.id);
    await sleep(4000); // Extra wait for JS to initialize

    // Create the email
    await chrome.scripting.executeScript({
      target: { tabId: tempMailTab.id },
      func: createTempEmail,
      args: [emailName]
    });

    await sleep(4000); // Wait for email creation

    // Step 2: Navigate to ChatGPT signup (20%)
    sendK12Progress(20, 'Opening ChatGPT signup...');

    const chatgptTab = await chrome.tabs.create({
      url: 'https://chatgpt.com/',
      active: false
    });
    k12State.chatgptTabId = chatgptTab.id;
    console.log('[K12] Opened ChatGPT tab:', chatgptTab.id);

    await waitForTabLoad(chatgptTab.id);
    await sleep(3000);

    // Click signup button - try multiple times
    sendK12Progress(25, 'Clicking Sign Up...');
    let signupClicked = false;
    for (let attempt = 0; attempt < 3 && !signupClicked; attempt++) {
      console.log('[K12] Signup click attempt:', attempt + 1);
      const clickResult = await chrome.scripting.executeScript({
        target: { tabId: chatgptTab.id },
        func: clickSignupButton
      });
      if (clickResult && clickResult[0] && clickResult[0].result) {
        signupClicked = true;
      }
      await sleep(2000);
    }

    // Wait for authentication page - check for BOTH URL and modal elements
    await sleep(4000);
    console.log('[K12] Waiting for auth page...');

    // Try multiple URL patterns that OpenAI might use
    const reachedAuth = await waitForUrlContainsAny(chatgptTab.id, ['auth.openai.com', 'auth0.openai.com', 'login', 'signup'], 30000);

    if (!reachedAuth) {
      // Check if we're still on chatgpt.com but have a modal
      const hasAuthModal = await chrome.scripting.executeScript({
        target: { tabId: chatgptTab.id },
        func: () => {
          const emailInput = document.querySelector('input[type="email"], input[name="email"], input[autocomplete="email"]');
          return !!emailInput;
        }
      });

      if (!hasAuthModal || !hasAuthModal[0] || !hasAuthModal[0].result) {
        throw new Error('Timed out waiting for OpenAI signup page. Try clicking Sign Up manually.');
      }
      console.log('[K12] Found auth modal on chatgpt.com');
    }
    await sleep(2000);

    // Step 3: Enter email (35%)
    sendK12Progress(35, 'Entering email...');
    let emailEntered = false;
    for (let attempt = 0; attempt < 3 && !emailEntered; attempt++) {
      console.log('[K12] Email entry attempt:', attempt + 1);
      const emailResult = await chrome.scripting.executeScript({
        target: { tabId: chatgptTab.id },
        func: fillEmailAndContinue,
        args: [k12State.email]
      });
      if (emailResult && emailResult[0] && emailResult[0].result) {
        emailEntered = true;
      }
      await sleep(2000);
    }

    // Wait for password page - use longer timeout and multiple patterns
    await sleep(4000);
    console.log('[K12] Waiting for password page...');
    const reachedPassword = await waitForElementOrUrl(chatgptTab.id, ['password'], 'input[type="password"]', 25000);
    if (!reachedPassword) {
      throw new Error('Timed out waiting for password step. Email may not have been accepted.');
    }
    await sleep(2000);

    // Step 4: Enter password (50%)
    sendK12Progress(50, 'Setting password...');
    let passwordEntered = false;
    for (let attempt = 0; attempt < 3 && !passwordEntered; attempt++) {
      console.log('[K12] Password entry attempt:', attempt + 1);
      const passResult = await chrome.scripting.executeScript({
        target: { tabId: chatgptTab.id },
        func: fillPasswordAndContinue,
        args: [k12State.password]
      });
      if (passResult && passResult[0] && passResult[0].result) {
        passwordEntered = true;
      }
      await sleep(3000);
    }

    // Wait for verification page - check for various code input patterns
    await sleep(5000); // Longer wait for password processing
    console.log('[K12] Waiting for verification page...');

    // Check for verification page with multiple detection methods
    const reachedVerification = await waitForVerificationPage(chatgptTab.id, 35000);
    if (!reachedVerification) {
      throw new Error('Timed out waiting for verification step. Password may not have been accepted.');
    }

    // Step 5: Get and enter verification code (65%)
    sendK12Progress(65, 'Waiting for verification code...');

    // SIMPLIFIED: Keep the SAME incognito window - we're already logged into the email we created!
    // Just need to refresh and wait for the verification email to arrive
    console.log('[K12] Using same temp mail window - already logged in');

    // Click refresh to check for new emails
    await chrome.scripting.executeScript({
      target: { tabId: tempMailTab.id },
      func: clickRefreshAndOpenEmail
    });
    await sleep(2000);

    // Poll for verification code - faster polling
    let verificationCode = '';
    let pollAttempts = 0;
    const maxPollAttempts = 40;

    while (!verificationCode && pollAttempts < maxPollAttempts) {
      pollAttempts++;
      sendK12Progress(65 + Math.floor(pollAttempts * 0.5), 'Checking inbox... (' + pollAttempts + ')');

      const result = await chrome.scripting.executeScript({
        target: { tabId: tempMailTab.id },
        func: getVerificationCode
      });

      if (result && result[0] && result[0].result) {
        verificationCode = result[0].result;
        console.log('[K12] Got verification code:', verificationCode);
        break;
      }

      // Every 3 attempts, try refresh again
      if (pollAttempts % 3 === 0) {
        await chrome.scripting.executeScript({
          target: { tabId: tempMailTab.id },
          func: clickRefreshAndOpenEmail
        });
      }

      await sleep(2000); // Reduced from 3s
    }

    if (!verificationCode) {
      throw new Error('Verification code not received after 2.5 minutes');
    }

    // Step 6: Enter verification code (85%)
    sendK12Progress(85, 'Entering verification code...');
    k12State.verificationCode = verificationCode;

    let codeEntered = false;
    for (let attempt = 0; attempt < 3 && !codeEntered; attempt++) {
      console.log('[K12] Code entry attempt:', attempt + 1);
      const codeResult = await chrome.scripting.executeScript({
        target: { tabId: chatgptTab.id },
        func: fillVerificationCodeAndContinue,
        args: [verificationCode]
      });
      if (codeResult && codeResult[0] && codeResult[0].result) {
        codeEntered = true;
      }
      await sleep(3000);
    }

    // Wait for about-you page
    await sleep(4000);
    console.log('[K12] Waiting for profile page...');
    const reachedAbout = await waitForElementOrUrl(chatgptTab.id, ['about-you', 'onboarding', 'profile', 'name'], 'input[name="name"], input[placeholder*="name"], input[placeholder*="Name"]', 30000);
    if (!reachedAbout) {
      // Check if we're already on the main chatgpt page (completed signup)
      const tabInfo = await chrome.tabs.get(chatgptTab.id);
      if (tabInfo.url && (tabInfo.url.includes('chat.openai.com') || tabInfo.url.includes('chatgpt.com')) && !tabInfo.url.includes('auth')) {
        console.log('[K12] Signup appears complete, skipping profile step');
      } else {
        throw new Error('Timed out waiting for profile step. Verification may have failed.');
      }
    } else {
      await sleep(2000);

      // Step 7: Fill name and birthday (95%)
      sendK12Progress(95, 'Completing profile...');
      let profileFilled = false;
      for (let attempt = 0; attempt < 3 && !profileFilled; attempt++) {
        console.log('[K12] Profile fill attempt:', attempt + 1);
        const profileResult = await chrome.scripting.executeScript({
          target: { tabId: chatgptTab.id },
          func: fillNameAndBirthdayAndContinue
        });
        if (profileResult && profileResult[0] && profileResult[0].result) {
          profileFilled = true;
        }
        await sleep(3000);
      }

      // Wait for completion
      await sleep(3000);
      const finished = await waitForUrlNotContains(chatgptTab.id, 'auth.openai.com', 25000);
      if (!finished) {
        // Don't throw error - just warn. The account might still be created.
        console.warn('[K12] Signup may not have completed fully. Check manually.');
      }
    }

    await sleep(2000);

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
    await chrome.storage.local.remove(['k12PendingAccount']);
    sendK12Complete(k12State.email, k12State.password);
    console.log('[K12] Account creation completed successfully!');

  } catch (error) {
    console.error('[K12] Error:', error);
    sendK12Error(error.message);

    // Cleanup tabs on error
    try {
      if (k12State.tempMailTabId) chrome.tabs.remove(k12State.tempMailTabId);
    } catch (e) { }
  }
}

// Wait for element presence OR URL to match - more flexible detection
function waitForElementOrUrl(tabId, urlParts, elementSelector, timeout = 20000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const parts = Array.isArray(urlParts) ? urlParts : [urlParts];

    const check = async () => {
      try {
        // Check URL
        const tab = await chrome.tabs.get(tabId);
        if (tab.url && parts.some(part => tab.url.toLowerCase().includes(part.toLowerCase()))) {
          console.log('[K12] URL matched:', tab.url);
          resolve(true);
          return;
        }

        // Check for element
        const elementCheck = await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: (selector) => {
            const el = document.querySelector(selector);
            return !!el;
          },
          args: [elementSelector]
        });

        if (elementCheck && elementCheck[0] && elementCheck[0].result) {
          console.log('[K12] Element found:', elementSelector);
          resolve(true);
          return;
        }
      } catch (e) {
        console.log('[K12] Check error:', e.message);
      }

      if (Date.now() - startTime > timeout) {
        console.log('[K12] Timeout waiting for URL/element');
        resolve(false);
        return;
      }

      setTimeout(check, 800);
    };

    check();
  });
}

// Wait for verification page with comprehensive detection
function waitForVerificationPage(tabId, timeout = 30000) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const check = async () => {
      try {
        // Check URL first
        const tab = await chrome.tabs.get(tabId);
        if (tab.url && (tab.url.includes('verification') || tab.url.includes('verify') || tab.url.includes('code'))) {
          console.log('[K12] Verification URL detected:', tab.url);
          resolve(true);
          return;
        }

        // Check for various code input patterns via script injection
        const codeInputCheck = await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            // Check for code input elements with many selectors
            const selectors = [
              'input[name="code"]',
              'input[autocomplete="one-time-code"]',
              'input[inputmode="numeric"]',
              'input[type="tel"]',
              'input[maxlength="6"]',
              'input[placeholder*="code" i]',
              'input[placeholder*="verify" i]',
              'input[aria-label*="code" i]',
              'input[aria-label*="verification" i]'
            ];

            for (const sel of selectors) {
              const el = document.querySelector(sel);
              if (el) {
                console.log('[K12] Found code input with selector:', sel);
                return { found: true, selector: sel };
              }
            }

            // Also check page text for verification keywords
            const pageText = document.body.innerText.toLowerCase();
            if (pageText.includes('enter the code') ||
              pageText.includes('verification code') ||
              pageText.includes('verify your email') ||
              pageText.includes('check your email')) {
              // Page mentions verification, look for any text input
              const textInput = document.querySelector('input[type="text"]:not([readonly])');
              if (textInput) {
                console.log('[K12] Found text input on verification page');
                return { found: true, selector: 'text-input-on-verify-page' };
              }
            }

            return { found: false };
          }
        });

        if (codeInputCheck && codeInputCheck[0] && codeInputCheck[0].result && codeInputCheck[0].result.found) {
          console.log('[K12] Verification page detected via element');
          resolve(true);
          return;
        }
      } catch (e) {
        console.log('[K12] Verification check error:', e.message);
      }

      if (Date.now() - startTime > timeout) {
        console.log('[K12] Timeout waiting for verification page');
        resolve(false);
        return;
      }

      setTimeout(check, 1000);
    };

    check();
  });
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

function waitForUrlContainsAny(tabId, urlParts, timeout = 15000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const parts = Array.isArray(urlParts) ? urlParts : [urlParts];

    const checkUrl = async () => {
      try {
        const tab = await chrome.tabs.get(tabId);
        if (tab.url && parts.some(part => tab.url.includes(part))) {
          resolve(true);
          return;
        }
      } catch (e) { }

      if (Date.now() - startTime > timeout) {
        console.log('[K12] URL wait timeout for:', parts.join(', '));
        resolve(false);
        return;
      }

      setTimeout(checkUrl, 500);
    };

    checkUrl();
  });
}

function waitForUrlNotContains(tabId, urlPart, timeout = 15000) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkUrl = async () => {
      try {
        const tab = await chrome.tabs.get(tabId);
        if (tab.url && !tab.url.includes(urlPart)) {
          resolve(true);
          return;
        }
      } catch (e) { }

      if (Date.now() - startTime > timeout) {
        console.log('[K12] URL wait timeout for not containing:', urlPart);
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

// Injected into temp mail page to create email - MATCHES ACTUAL UI
function createTempEmail(emailName) {
  console.log('[K12 Create] === Creating email:', emailName, '===');

  // Step 1: Click on "Create New Email" tab first
  const tabs = document.querySelectorAll('a, span, div, button, li');
  let createTabFound = false;

  for (const tab of tabs) {
    const text = tab.textContent.trim().toLowerCase();
    if (text === 'create new email' || text.includes('create new')) {
      console.log('[K12 Create] Clicking Create New Email tab');
      tab.click();
      createTabFound = true;
      break;
    }
  }

  if (!createTabFound) {
    console.log('[K12 Create] Create New Email tab not found, proceeding...');
  }

  // Step 2: Wait for form to appear, then select domain and fill email
  setTimeout(() => {
    // Select erzi.me domain from dropdown FIRST
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

    // Step 3: Find and fill the email input
    setTimeout(() => {
      // Find the email name input field (left side of @)
      const allInputs = document.querySelectorAll('input[type="text"], input:not([type])');
      let emailInput = null;

      for (const input of allInputs) {
        if (input.type === 'hidden' || input.readOnly) continue;
        const placeholder = (input.placeholder || '').toLowerCase();
        // Look for input that shows "Please Input" or similar
        if (placeholder.includes('input') || placeholder.includes('please') ||
          placeholder === '' || placeholder.includes('email')) {
          emailInput = input;
          console.log('[K12 Create] Found email input with placeholder:', input.placeholder);
          break;
        }
      }

      // Fallback: first visible text input
      if (!emailInput) {
        emailInput = document.querySelector('input[type="text"]:not([readonly])');
      }

      if (emailInput) {
        console.log('[K12 Create] Filling email name:', emailName);
        emailInput.focus();
        emailInput.value = '';

        // Fill the email name
        emailInput.value = emailName;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        emailInput.blur();

        console.log('[K12 Create] Filled email input with:', emailInput.value);
      } else {
        console.log('[K12 Create] ERROR: Email input not found!');
      }

      // Step 4: Click "Create New Email" button
      setTimeout(() => {
        const buttons = document.querySelectorAll('button');
        let createBtn = null;

        for (const btn of buttons) {
          const text = btn.textContent.toLowerCase().trim();
          // Look specifically for "Create New Email" button text
          if (text.includes('create new email') || text === 'create' ||
            text.includes('register') || text.includes('submit')) {
            createBtn = btn;
            console.log('[K12 Create] Found button:', text);
            break;
          }
        }

        if (createBtn) {
          console.log('[K12 Create] Clicking Create New Email button');
          createBtn.click();

          // Click again after delay to ensure it worked
          setTimeout(() => {
            if (document.body.contains(createBtn)) {
              createBtn.click();
            }
          }, 500);
        } else {
          console.log('[K12 Create] ERROR: Create button not found!');
        }
      }, 300);
    }, 300);
  }, 800);

  return true;
}

// Injected into temp mail to get verification code - MATCHES ACTUAL INBOX UI
function getVerificationCode() {
  console.log('[K12 Code] Looking for verification code in inbox...');

  // The inbox shows emails in a list on the left side
  // Each email item contains text like "Your ChatGPT code is 753326"
  // When clicked, the email body shows the full content

  // Step 1: Look for the code directly in visible text (sidebar or body)
  const pageText = document.body.innerText;

  // Pattern: "Your ChatGPT code is XXXXXX" or "code is XXXXXX"
  const codeMatch = pageText.match(/Your ChatGPT code is\s*(\d{6})/i) ||
    pageText.match(/code is\s*(\d{6})/i) ||
    pageText.match(/verification code[:\s]+(\d{6})/i);

  if (codeMatch && codeMatch[1]) {
    console.log('[K12 Code] Found code in page text:', codeMatch[1]);
    return codeMatch[1];
  }

  // Step 2: Click on the first OpenAI email if we haven't yet
  // Look for email items in the left sidebar
  const allElements = document.querySelectorAll('div, span, li, tr, td');

  for (const el of allElements) {
    const text = el.textContent || '';
    // Look for emails that contain OpenAI or ChatGPT or verification code
    if (text.toLowerCase().includes('openai') ||
      text.toLowerCase().includes('chatgpt') ||
      text.includes('Your ChatGPT code')) {

      // Check if this element contains a 6-digit code
      const codeInElement = text.match(/\b(\d{6})\b/);
      if (codeInElement) {
        console.log('[K12 Code] Found code in element:', codeInElement[1]);
        return codeInElement[1];
      }

      // If no code found directly, try clicking to open the email
      if (el.offsetWidth > 50 && el.offsetHeight > 20) {
        console.log('[K12 Code] Clicking email item to open it...');
        el.click();
      }
    }
  }

  // Step 3: Also check for any 6-digit numbers that look like codes
  const allSixDigit = pageText.match(/\b(\d{6})\b/g);
  if (allSixDigit && allSixDigit.length > 0) {
    // Return the first one found (usually the most recent/visible)
    console.log('[K12 Code] Found 6-digit numbers:', allSixDigit);
    return allSixDigit[0];
  }

  console.log('[K12 Code] No verification code found yet');
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

  // Look for "Sign up" or "Sign up for free" button/link
  const signupBtn = Array.from(document.querySelectorAll('a, button')).find(b => {
    const text = b.textContent.toLowerCase().trim();
    return text.includes('sign up') || text.includes('get started') || text === 'create account';
  });

  if (signupBtn) {
    console.log('[K12] Found signup button:', signupBtn.textContent);
    signupBtn.click();
    return true;
  }

  // Try alternate: look for data-testid
  const altBtn = document.querySelector('[data-testid="login-button"]');
  if (altBtn) {
    console.log('[K12] Found alternate signup button');
    altBtn.click();
    return true;
  }

  // Try to find "Sign up for free" link which is sometimes used
  const signupLink = Array.from(document.querySelectorAll('a')).find(a => {
    return a.href && a.href.includes('signup');
  });

  if (signupLink) {
    console.log('[K12] Found signup link');
    signupLink.click();
    return true;
  }

  console.log('[K12] No signup button found');
  return false;
}

// Fill email on auth.openai.com and click continue
function fillEmailAndContinue(email) {
  console.log('[K12] Filling email:', email);

  const emailInput = document.querySelector('input[type="email"]') ||
    document.querySelector('input[name="email"]') ||
    document.querySelector('input[autocomplete="email"]') ||
    document.querySelector('input[inputmode="email"]');

  if (!emailInput) {
    console.log('[K12] No email input found');
    return false;
  }

  emailInput.focus();
  emailInput.value = '';

  // Type character by character
  for (const char of email) {
    emailInput.value += char;
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  emailInput.dispatchEvent(new Event('change', { bubbles: true }));
  console.log('[K12] Filled email successfully');

  // Click continue after short delay
  setTimeout(() => {
    const continueBtn = document.querySelector('button[type="submit"]') ||
      Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.toLowerCase().includes('continue'));
    if (continueBtn) {
      console.log('[K12] Clicking continue after email');
      continueBtn.click();
      // Double-click for reliability
      setTimeout(() => continueBtn.click(), 500);
    }
  }, 800);

  return true;
}

// Fill password and click continue - FAST version
function fillPasswordAndContinue(password) {
  console.log('[K12] Filling password (fast mode)');

  const passwordInput = document.querySelector('input[type="password"]') ||
    document.querySelector('input[name="password"]');

  if (!passwordInput) {
    console.log('[K12] No password input found');
    return false;
  }

  // Focus and fill password all at once (faster)
  passwordInput.focus();
  passwordInput.value = password;

  // Dispatch events to trigger validation
  passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
  passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
  passwordInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  passwordInput.blur();

  console.log('[K12] Filled password successfully');

  // Click continue button immediately
  setTimeout(() => {
    const continueBtn = document.querySelector('button[type="submit"]') ||
      Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.toLowerCase().trim() === 'continue');

    if (continueBtn && !continueBtn.disabled) {
      console.log('[K12] Clicking continue button');
      continueBtn.click();
    } else {
      // Button might be disabled, try fast retries
      fastClickContinue(0);
    }
  }, 100);

  return true;
}

// Fast retry for continue button
function fastClickContinue(attempts) {
  if (attempts > 20) return; // Max 2 seconds

  const continueBtn = document.querySelector('button[type="submit"]') ||
    Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.toLowerCase().trim() === 'continue');

  if (continueBtn && !continueBtn.disabled) {
    continueBtn.click();
    console.log('[K12] Clicked continue button');
  } else {
    setTimeout(() => fastClickContinue(attempts + 1), 100);
  }
}

// Helper to check button state and click - more robust version
function checkAndClickContinue(attempts) {
  if (attempts > 60) {
    console.log('[K12] Gave up clicking continue after 60 attempts');
    return;
  }

  // Try multiple selectors for the continue button
  let continueBtn = document.querySelector('button[type="submit"]');

  if (!continueBtn) {
    // Try finding by text content
    continueBtn = Array.from(document.querySelectorAll('button')).find(b => {
      const text = b.textContent.toLowerCase().trim();
      return text === 'continue' || text.includes('continue');
    });
  }

  if (!continueBtn) {
    // Try finding by class or other attributes
    continueBtn = document.querySelector('button[class*="continue"]') ||
      document.querySelector('button[data-testid*="continue"]') ||
      document.querySelector('form button');
  }

  if (continueBtn) {
    console.log('[K12] Found continue button, disabled:', continueBtn.disabled);

    if (!continueBtn.disabled) {
      console.log('[K12] Clicking continue button now');

      // Focus and blur the password input first to trigger any validation
      const passwordInput = document.querySelector('input[type="password"]');
      if (passwordInput) {
        passwordInput.blur();
      }

      // Small delay then click
      setTimeout(() => {
        continueBtn.focus();
        continueBtn.click();
        console.log('[K12] Clicked continue button');

        // Try clicking again after a delay as backup
        setTimeout(() => {
          if (document.body.contains(continueBtn)) {
            console.log('[K12] Double-clicking continue button');
            continueBtn.click();
          }
        }, 800);
      }, 200);
    } else {
      // Button disabled, re-trigger events on input to enable it
      console.log('[K12] Button disabled, re-triggering validation...');
      const passwordInput = document.querySelector('input[type="password"]');
      if (passwordInput) {
        passwordInput.focus();
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
        passwordInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        passwordInput.blur();
      }
      setTimeout(() => checkAndClickContinue(attempts + 1), 150);
    }
  } else {
    console.log('[K12] Continue button not found, attempt:', attempts);
    setTimeout(() => checkAndClickContinue(attempts + 1), 150);
  }
}

// Fill verification code and click continue
function fillVerificationCodeAndContinue(code) {
  console.log('[K12] Filling verification code:', code);

  const codeInput = document.querySelector('input[name="code"]') ||
    document.querySelector('input[autocomplete="one-time-code"]') ||
    document.querySelector('input[inputmode="numeric"]') ||
    document.querySelector('input[type="text"]');

  if (!codeInput) {
    console.log('[K12] No code input found');
    return false;
  }

  codeInput.focus();
  codeInput.value = '';

  for (const char of code) {
    codeInput.value += char;
    codeInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  codeInput.dispatchEvent(new Event('change', { bubbles: true }));
  console.log('[K12] Filled verification code successfully');

  setTimeout(() => {
    const continueBtn = document.querySelector('button[type="submit"]') ||
      Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.toLowerCase().includes('continue'));
    if (continueBtn) {
      console.log('[K12] Clicking continue after code');
      continueBtn.click();
      // Double-click for reliability
      setTimeout(() => continueBtn.click(), 500);
    }
  }, 800);

  return true;
}

// Fill name and birthday, then click continue
function fillNameAndBirthdayAndContinue() {
  console.log('[K12] Filling name and birthday');
  let filledSomething = false;

  // Fill name - try multiple selectors
  let nameInput = document.querySelector('input[name="name"]') ||
    document.querySelector('input[placeholder*="name" i]') ||
    document.querySelector('input[placeholder*="Name"]') ||
    document.querySelector('input[aria-label*="name" i]');

  // If still not found, try the first text input that's not for birthday/date
  if (!nameInput) {
    const textInputs = document.querySelectorAll('input[type="text"]');
    for (const input of textInputs) {
      const placeholder = (input.placeholder || '').toLowerCase();
      if (!placeholder.includes('birthday') && !placeholder.includes('date') && !placeholder.includes('/')) {
        nameInput = input;
        break;
      }
    }
  }

  if (nameInput && !nameInput.value) {
    const randomName = 'User' + Math.floor(Math.random() * 90000 + 10000);
    nameInput.focus();
    nameInput.value = randomName;
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('[K12] Filled name:', randomName);
    filledSomething = true;
  }

  // Fill birthday (MM/DD/YYYY format, year 1980-2000)
  let birthdayInput = document.querySelector('input[placeholder*="Birthday" i]') ||
    document.querySelector('input[placeholder*="birthday"]') ||
    document.querySelector('input[name*="birthday" i]') ||
    document.querySelector('input[placeholder*="MM/DD/YYYY"]') ||
    document.querySelector('input[aria-label*="birthday" i]');

  // If still not found, try to find an input that looks like a date field
  if (!birthdayInput) {
    const textInputs = document.querySelectorAll('input[type="text"]');
    for (const input of textInputs) {
      const placeholder = (input.placeholder || '').toLowerCase();
      if (placeholder.includes('/') || placeholder.includes('mm') || placeholder.includes('dd')) {
        birthdayInput = input;
        break;
      }
    }
  }

  // Last resort: second text input (first is usually name)
  if (!birthdayInput) {
    const textInputs = document.querySelectorAll('input[type="text"]');
    if (textInputs.length > 1) {
      birthdayInput = textInputs[1];
    }
  }

  if (birthdayInput && !birthdayInput.value) {
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const year = String(1980 + Math.floor(Math.random() * 21));

    const birthday = `${month}/${day}/${year}`;
    birthdayInput.focus();
    birthdayInput.value = birthday;
    birthdayInput.dispatchEvent(new Event('input', { bubbles: true }));
    birthdayInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('[K12] Filled birthday:', birthday);
    filledSomething = true;
  }

  // Click continue (with retry mechanism)
  setTimeout(() => {
    const clickContinue = (attempts) => {
      if (attempts > 10) return;

      const continueBtn = document.querySelector('button[type="submit"]') ||
        Array.from(document.querySelectorAll('button')).find(b =>
          b.textContent.toLowerCase().includes('continue') || b.textContent.toLowerCase().includes('agree'));

      if (continueBtn && !continueBtn.disabled) {
        console.log('[K12] Clicking continue after profile');
        continueBtn.click();
        // Double-click for reliability
        setTimeout(() => {
          if (document.body.contains(continueBtn)) {
            continueBtn.click();
          }
        }, 500);
      } else {
        setTimeout(() => clickContinue(attempts + 1), 300);
      }
    };

    clickContinue(0);
  }, 1000);

  return filledSomething;
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
  console.log('[K12 Login] === FORCING LOGIN TO EMAIL:', emailName, '===');

  // Step 1: Click on "Login" tab at the top (the first tab)
  const tabs = document.querySelectorAll('a, span, div, li');
  let loginTabClicked = false;

  for (const tab of tabs) {
    const text = tab.textContent.trim();
    // Look specifically for "Login" tab text (exact match, not "User Login")
    if (text === 'Login' || text === 'login') {
      console.log('[K12 Login] Clicking Login tab');
      tab.click();
      loginTabClicked = true;
      break;
    }
  }

  if (!loginTabClicked) {
    console.log('[K12 Login] Login tab not found, trying any login link...');
  }

  // Step 2: Wait for login form, then fill the input - FASTER
  setTimeout(() => {
    // Find the input field
    const allInputs = document.querySelectorAll('input[type="text"], input:not([type])');
    let credentialInput = null;

    for (const input of allInputs) {
      if (input.type === 'hidden' || input.readOnly) continue;
      credentialInput = input;
      break;
    }

    if (credentialInput) {
      console.log('[K12 Login] Filling email name:', emailName);
      credentialInput.focus();
      credentialInput.value = '';
      credentialInput.value = emailName;
      credentialInput.dispatchEvent(new Event('input', { bubbles: true }));
      credentialInput.dispatchEvent(new Event('change', { bubbles: true }));
      credentialInput.blur();
      console.log('[K12 Login] Filled with:', credentialInput.value);
    }

    // Step 3: Select erzi.me domain - FASTER
    setTimeout(() => {
      const selects = document.querySelectorAll('select');
      for (const select of selects) {
        for (const opt of select.options) {
          if (opt.value.includes('erzi.me') || opt.text.includes('erzi.me')) {
            select.value = opt.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('[K12 Login] Selected erzi.me');
            break;
          }
        }
      }

      // Step 4: Click the Login button - FASTER
      setTimeout(() => {
        const buttons = document.querySelectorAll('button');
        let loginBtn = null;

        for (const btn of buttons) {
          const text = btn.textContent.toLowerCase().trim();
          if (text === 'login' || text.includes('login')) {
            if (!text.includes('user')) {
              loginBtn = btn;
              break;
            }
          }
        }

        if (!loginBtn) {
          for (const btn of buttons) {
            if (btn.textContent.toLowerCase().includes('login')) {
              loginBtn = btn;
              break;
            }
          }
        }

        if (loginBtn) {
          console.log('[K12 Login] Clicking Login button');
          loginBtn.click();
          setTimeout(() => loginBtn.click(), 300);
        } else {
          console.log('[K12 Login] ERROR: No Login button found');
        }
      }, 200);
    }, 200);
  }, 500);

  return true;
}

// Click refresh button and open latest email - MATCHES ACTUAL UI
function clickRefreshAndOpenEmail() {
  console.log('[K12 Refresh] Refreshing inbox...');

  // First, make sure we're on Mail Box tab
  const tabs = document.querySelectorAll('a, span, div, button, li');
  for (const tab of tabs) {
    const text = tab.textContent.trim().toLowerCase();
    if (text === 'mail box' || text === 'mailbox' || text === 'inbox') {
      console.log('[K12 Refresh] Clicking Mail Box tab');
      tab.click();
      break;
    }
  }

  // Wait a moment then click refresh
  setTimeout(() => {
    // Try to click Refresh button
    const buttons = document.querySelectorAll('button');
    let refreshBtn = null;

    for (const btn of buttons) {
      const text = btn.textContent.toLowerCase().trim();
      if (text === 'refresh' || text.includes('refresh')) {
        refreshBtn = btn;
        break;
      }
    }

    // Also try by title attribute
    if (!refreshBtn) {
      refreshBtn = document.querySelector('button[title*="Refresh"]');
    }

    if (refreshBtn) {
      console.log('[K12 Refresh] Clicking Refresh button');
      refreshBtn.click();
    } else {
      console.log('[K12 Refresh] Refresh button not found');
    }

    // Wait for emails to load, then click on OpenAI email
    setTimeout(() => {
      const emailItems = document.querySelectorAll('[class*="mail"], [class*="item"], tr, li, div');

      for (const item of emailItems) {
        const text = (item.textContent || '').toLowerCase();
        // Look for OpenAI/ChatGPT verification emails
        if ((text.includes('openai') || text.includes('chatgpt') || text.includes('verification')) &&
          text.includes('code')) {
          console.log('[K12 Refresh] Found OpenAI email, clicking...');
          item.click();
          break;
        }
      }
    }, 1500);
  }, 500);
}

// ========== LIVE CC CHECKER ==========

const LIVE_CC_CHECKER_URL = 'https://teamcsb.com/live-cc-checker/';

let liveccState = {
  isChecking: false,
  checkerTabId: null,
  cards: [],
  liveCards: []
};

// Send progress update to popup
function sendLiveCCProgress(percent, status) {
  chrome.runtime.sendMessage({
    action: 'liveccProgress',
    percent: percent,
    status: status
  }).catch(() => { });
}

// Send completion to popup
function sendLiveCCComplete(liveCards) {
  chrome.runtime.sendMessage({
    action: 'liveccComplete',
    liveCards: liveCards
  }).catch(() => { });
}

// Send error to popup
function sendLiveCCError(message) {
  chrome.runtime.sendMessage({
    action: 'liveccError',
    message: message
  }).catch(() => { });
}

// Stop Live CC Check
function stopLiveCCCheck() {
  liveccState.isChecking = false;
  if (liveccState.checkerTabId) {
    chrome.tabs.remove(liveccState.checkerTabId).catch(() => { });
    liveccState.checkerTabId = null;
  }
}

// Handle results from content script
function handleLiveCCResults(liveCards, tabId) {
  console.log('[Live CC] Received results:', liveCards);
  liveccState.liveCards = liveCards || [];
  liveccState.isChecking = false;

  // Close the checker tab
  if (tabId) {
    setTimeout(() => {
      chrome.tabs.remove(tabId).catch(() => { });
    }, 1000);
  }

  sendLiveCCComplete(liveccState.liveCards);
}

// Main Live CC checking function
async function checkLiveCCCards(bin, country, expiryMonth, expiryYear) {
  if (liveccState.isChecking) {
    sendLiveCCError('Already checking. Please wait.');
    return;
  }

  liveccState.isChecking = true;
  liveccState.liveCards = [];

  try {
    sendLiveCCProgress(5, 'Generating cards...');

    // Generate 100 cards using Luhn
    const expMonth = expiryMonth || (country === 'IN' ? INDIA_EXPIRY_MONTH : HARDCODED_EXPIRY_MONTH);
    const expYear = expiryYear || (country === 'IN' ? INDIA_EXPIRY_YEAR : HARDCODED_EXPIRY_YEAR);
    const cleanedBin = bin.replace(/x/gi, '').replace(/\s+/g, '').trim();

    const cards = generateCardsWithLuhn(cleanedBin, 100, expMonth, expYear);
    liveccState.cards = cards;

    console.log('[Live CC] Generated', cards.length, 'cards');
    sendLiveCCProgress(15, 'Opening checker page...');

    // Open TeamCSB checker in a new tab
    const tab = await chrome.tabs.create({ url: LIVE_CC_CHECKER_URL, active: false });
    liveccState.checkerTabId = tab.id;

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (!liveccState.isChecking) {
      console.log('[Live CC] Stopped by user');
      return;
    }

    sendLiveCCProgress(25, 'Pasting cards...');

    // Format cards
    const cardLines = cards.map(c => {
      const year2digit = c.expiry_year.slice(-2);
      return `${c.card_number}|${c.expiry_month}/${year2digit}|${c.cvv}`;
    }).join('\n');

    sendLiveCCProgress(20, 'Opening checker page...');

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    sendLiveCCProgress(30, 'Starting validation process...');

    // Send message to content script to start the process
    try {
      await chrome.tabs.sendMessage(liveccState.checkerTabId, {
        action: 'start_live_cc_check',
        cardLines: cardLines
      });
      console.log('[Live CC] Sent start command to content script');
    } catch (e) {
      console.error('[Live CC] Failed to send message to content script:', e);
      // Fallback: reload and try once more? or just error
      sendLiveCCError('Could not communicate with checker page. Please try again.');
      stopLiveCCCheck();
    }
  } catch (error) {
    console.error('[Live CC] Error:', error);
    sendLiveCCError(error.message || 'Unknown error occurred');
    stopLiveCCCheck();
  }
}
// Note: pasteCardsAndStart and extractLiveCards functions are no longer needed in background.js
// as they have been moved to content.js for better reliability.
