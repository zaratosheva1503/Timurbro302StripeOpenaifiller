const DEFAULT_BIN = '625814260207xxxx';
const INDIA_DEFAULT_BIN = '551827706xxxx';

let binInput, generateBtn, clearBtn, statusDiv, savedBinDiv, savedBinValue, generateMethodSelect, countrySelect, expiryMonth, expiryYear;
let precardBinInput, generatePrecardsBtn, clearPrecardsBtn, precardStatusDiv, precardsList, precardMethodSelect, precardCountrySelect;
let tabBtns, tabContents;

// Live CC elements
let liveccBinInput, liveccBtn, liveccStopBtn, liveccStatusDiv, liveccCountrySelect, liveccExpiryMonth, liveccExpiryYear;
let liveccProgressSection, liveccProgressBar, liveccProgressPercent, liveccProgressStatus;
let liveccResults, liveccCardsList;

// OpenAI Account elements
let createOpenAIBtn, fetchCodeBtn, openaiStatusDiv, tempEmailValue, copyEmailBtn;
let openaiProgress, openaiProgressBar, savedAccountsSection, savedAccountsList;
let currentTempEmail = null;
let currentCredentials = null;


document.addEventListener('DOMContentLoaded', function () {
  binInput = document.getElementById('bin');
  generateBtn = document.getElementById('generateBtn');
  clearBtn = document.getElementById('clearBtn');
  statusDiv = document.getElementById('status');
  savedBinDiv = document.getElementById('savedBin');
  savedBinValue = document.getElementById('savedBinValue');
  generateMethodSelect = document.getElementById('generateMethod');
  countrySelect = document.getElementById('countrySelect');
  expiryMonth = document.getElementById('expiryMonth');
  expiryYear = document.getElementById('expiryYear');

  precardBinInput = document.getElementById('precardBin');
  generatePrecardsBtn = document.getElementById('generatePrecardsBtn');
  clearPrecardsBtn = document.getElementById('clearPrecardsBtn');
  precardStatusDiv = document.getElementById('precardStatus');
  precardsList = document.getElementById('precardsList');
  precardMethodSelect = document.getElementById('precardMethod');
  precardCountrySelect = document.getElementById('precardCountrySelect');

  tabBtns = document.querySelectorAll('.tab-btn');
  tabContents = document.querySelectorAll('.tab-content');

  // Live CC elements
  liveccBinInput = document.getElementById('liveccBin');
  liveccBtn = document.getElementById('liveccBtn');
  liveccStopBtn = document.getElementById('liveccStopBtn');
  liveccStatusDiv = document.getElementById('liveccStatus');
  liveccCountrySelect = document.getElementById('liveccCountrySelect');
  liveccExpiryMonth = document.getElementById('liveccExpiryMonth');
  liveccExpiryYear = document.getElementById('liveccExpiryYear');
  liveccProgressSection = document.getElementById('liveccProgressSection');
  liveccProgressBar = document.getElementById('liveccProgressBar');
  liveccProgressPercent = document.getElementById('liveccProgressPercent');
  liveccProgressStatus = document.getElementById('liveccProgressStatus');
  liveccResults = document.getElementById('liveccResults');
  liveccCardsList = document.getElementById('liveccCardsList');

  // OpenAI Account elements
  createOpenAIBtn = document.getElementById('createOpenAIBtn');
  fetchCodeBtn = document.getElementById('fetchCodeBtn');
  openaiStatusDiv = document.getElementById('openaiStatus');
  tempEmailValue = document.getElementById('tempEmailValue');
  copyEmailBtn = document.getElementById('copyEmailBtn');
  openaiProgress = document.getElementById('openaiProgress');
  openaiProgressBar = document.getElementById('openaiProgressBar');
  savedAccountsSection = document.getElementById('savedAccountsSection');
  savedAccountsList = document.getElementById('savedAccountsList');

  initializeTabs();
  initializeGenerateTab();
  initializePrecardsTab();
  initializeLiveCCTab();
  initializeOpenAITab();
  loadInitialData();
  loadVersion();
  loadCreatedAccounts();

  // Add country change listener to update BIN and expiry defaults
  if (countrySelect) {
    countrySelect.addEventListener('change', function () {
      console.log('Country changed to:', countrySelect.value);
      updateDefaultsForCountry();
    });
  }
});

function updateDefaultsForCountry() {
  const selectedCountry = countrySelect.value;
  console.log('Updating defaults for country:', selectedCountry);

  if (selectedCountry === 'IN') {
    // India defaults
    console.log('Setting India defaults');
    binInput.value = INDIA_DEFAULT_BIN;
    savedBinValue.textContent = INDIA_DEFAULT_BIN;
    if (expiryMonth) expiryMonth.value = '03';
    if (expiryYear) expiryYear.value = '2029';
  } else {
    // South Korea/USA/UK defaults
    console.log('Setting South Korea defaults');
    binInput.value = DEFAULT_BIN;
    savedBinValue.textContent = DEFAULT_BIN;
    if (expiryMonth) expiryMonth.value = '01';
    if (expiryYear) expiryYear.value = '2033';
  }
}

function initializeTabs() {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      btn.classList.add('active');

      if (tabName === 'generate') {
        document.getElementById('generateTab').classList.add('active');
      } else if (tabName === 'precards') {
        document.getElementById('precardsTab').classList.add('active');
        loadPrecards();
      } else if (tabName === 'livecc') {
        document.getElementById('liveccTab').classList.add('active');
        updateLiveCCDefaultsForCountry();
      } else if (tabName === 'openai') {
        document.getElementById('openaiTab').classList.add('active');
        loadCreatedAccounts();
      }
    });
  });
}

function cleanBin(bin) {
  return bin.replace(/x/gi, '').replace(/\s+/g, '').trim();
}

function loadInitialData() {
  // Always use the hardcoded India BIN
  binInput.value = INDIA_DEFAULT_BIN;
  savedBinDiv.style.display = 'block';
  savedBinValue.textContent = INDIA_DEFAULT_BIN;
  precardBinInput.value = INDIA_DEFAULT_BIN;
  if (liveccBinInput) liveccBinInput.value = INDIA_DEFAULT_BIN;

  // Update storage with new BIN
  chrome.storage.local.set({
    defaultbincursorvo1: INDIA_DEFAULT_BIN,
    precardBin: INDIA_DEFAULT_BIN
  });
}

function loadVersion() {
  const manifest = chrome.runtime.getManifest();
  const versionDisplay = document.getElementById('versionDisplay');
  if (versionDisplay && manifest.version) {
    versionDisplay.textContent = 'v' + manifest.version;
  }
}

function initializeGenerateTab() {
  generateBtn.addEventListener('click', async () => {
    const bin = cleanBin(binInput.value);

    if (!bin) {
      updateStatus('Please enter a BIN number', 'error');
      return;
    }

    if (bin.length < 6) {
      updateStatus('BIN must be at least 6 digits', 'error');
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Universal support - allow any http/https page
    if (!tab.url || (!tab.url.startsWith('http://') && !tab.url.startsWith('https://'))) {
      updateStatus('❌ Please open a web page first!', 'error');
      return;
    }

    const stripeTabId = tab.id;

    const method = generateMethodSelect.value;

    generateBtn.disabled = true;
    updateStatus(method === 'luhn' ? 'Generating cards with Luhn...' : 'Generating cards from API...', 'loading');

    chrome.storage.local.set({
      defaultbincursorvo1: bin,
      stripeTabId: stripeTabId
    }, function () {
      savedBinDiv.style.display = 'block';
      savedBinValue.textContent = bin;
    });

    console.log('[Zarif Popup v6.2.0] Sending generateCards with country:', countrySelect.value);
    chrome.runtime.sendMessage({
      action: 'generateCards',
      bin: bin,
      method: method,
      stripeTabId: stripeTabId,
      country: countrySelect.value,
      expiryMonth: expiryMonth.value,
      expiryYear: expiryYear.value
    }, (response) => {
      generateBtn.disabled = false;

      if (response.success) {
        updateStatus(`✅ Generated ${response.cards.length} cards! Filling form...`, 'success');
        setTimeout(() => {
          updateStatus('✅ Auto-filling Stripe page...', 'success');
        }, 1000);
      } else {
        updateStatus('❌ Failed to generate cards. Try again.', 'error');
      }
    });
  });

  clearBtn.addEventListener('click', () => {
    chrome.storage.local.remove(['defaultbincursorvo1', 'generatedCards'], function () {
      binInput.value = '';
      savedBinDiv.style.display = 'none';
      updateStatus('Cleared saved data', 'success');
    });
  });
}

function updateStatus(message, type = '') {
  statusDiv.textContent = message;
  statusDiv.className = 'status ' + type;
}

function initializePrecardsTab() {
  generatePrecardsBtn.addEventListener('click', async () => {
    const bin = cleanBin(precardBinInput.value);

    if (!bin) {
      updatePrecardStatus('Please enter a BIN number', 'error');
      return;
    }

    if (bin.length < 6) {
      updatePrecardStatus('BIN must be at least 6 digits', 'error');
      return;
    }

    const method = precardMethodSelect.value;

    generatePrecardsBtn.disabled = true;
    updatePrecardStatus(method === 'luhn' ? 'Generating 10 pre-cards with Luhn...' : 'Generating 10 pre-cards from API...', 'loading');

    chrome.storage.local.set({ precardBin: bin });

    chrome.runtime.sendMessage({
      action: 'generatePrecards',
      bin: bin,
      method: method,
      country: precardCountrySelect ? precardCountrySelect.value : 'KR'
    }, (response) => {
      generatePrecardsBtn.disabled = false;

      if (response.success) {
        updatePrecardStatus(`✅ Generated ${response.cards.length} pre-cards successfully!`, 'success');
        loadPrecards();
      } else {
        updatePrecardStatus('❌ Failed to generate pre-cards. Try again.', 'error');
      }
    });
  });

  clearPrecardsBtn.addEventListener('click', () => {
    chrome.storage.local.remove(['precards', 'precardBin', 'precardRandomData'], function () {
      precardBinInput.value = DEFAULT_BIN;
      updatePrecardStatus('Cleared all pre-cards', 'success');
      loadPrecards();
    });
  });
}

function updatePrecardStatus(message, type = '') {
  precardStatusDiv.textContent = message;
  precardStatusDiv.className = 'status ' + type;
}

function loadPrecards() {
  chrome.storage.local.get(['precards'], function (result) {
    if (!result.precards || result.precards.length === 0) {
      precardsList.innerHTML = '<p class="no-cards-message">No pre-cards generated yet</p>';
      return;
    }

    const cards = result.precards;
    let html = '';

    cards.forEach((card, index) => {
      html += `
        <div class="precard-item">
          <div class="precard-info">
            <div class="precard-number">
              <strong>Card ${index + 1}:</strong> ${card.card_number}
            </div>
            <div class="precard-details">
              <span>Exp: ${card.expiry_month}/${card.expiry_year}</span>
              <span>CVV: ${card.cvv}</span>
            </div>
          </div>
          <button class="btn-use-card" data-index="${index}">Use Now</button>
        </div>
      `;
    });

    precardsList.innerHTML = html;

    document.querySelectorAll('.btn-use-card').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const cardIndex = parseInt(e.target.getAttribute('data-index'));
        await usePrecard(cardIndex);
      });
    });
  });
}

async function usePrecard(cardIndex) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Universal support - allow any http/https page
  if (!tab.url || (!tab.url.startsWith('http://') && !tab.url.startsWith('https://'))) {
    updatePrecardStatus('❌ Please open a web page first!', 'error');
    return;
  }

  chrome.storage.local.get(['precards', 'precardRandomData'], function (result) {
    if (!result.precards || !result.precards[cardIndex]) {
      updatePrecardStatus('❌ Card not found!', 'error');
      return;
    }

    const selectedCard = result.precards[cardIndex];
    const randomData = result.precardRandomData;

    // Send to content script to fill the form
    chrome.tabs.sendMessage(tab.id, {
      action: 'fillFormWithPrecard',
      card: selectedCard,
      randomData: randomData
    }, (response) => {
      if (chrome.runtime.lastError) {
        updatePrecardStatus('❌ Error: Please refresh the Stripe page', 'error');
        return;
      }

      updatePrecardStatus(`✅ Using Card ${cardIndex + 1} - Auto-filling...`, 'success');
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStatus') {
    updateStatus(request.message, request.type);
  } else if (request.action === 'liveccProgress') {
    updateLiveCCProgress(request.percent, request.status);
  } else if (request.action === 'liveccComplete') {
    showLiveCCResults(request.liveCards);
  } else if (request.action === 'liveccError') {
    showLiveCCError(request.message);
  }
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// ========== Live CC Tab Functions ==========

function updateLiveCCDefaultsForCountry() {
  if (!liveccCountrySelect || !liveccBinInput) return;

  const selectedCountry = liveccCountrySelect.value;
  if (selectedCountry === 'IN') {
    liveccBinInput.value = INDIA_DEFAULT_BIN;
    if (liveccExpiryMonth) liveccExpiryMonth.value = '03';
    if (liveccExpiryYear) liveccExpiryYear.value = '2029';
  } else {
    liveccBinInput.value = DEFAULT_BIN;
    if (liveccExpiryMonth) liveccExpiryMonth.value = '01';
    if (liveccExpiryYear) liveccExpiryYear.value = '2033';
  }
}

function initializeLiveCCTab() {
  if (!liveccBtn) return;

  // Country change listener
  if (liveccCountrySelect) {
    liveccCountrySelect.addEventListener('change', updateLiveCCDefaultsForCountry);
  }

  liveccBtn.addEventListener('click', startLiveCCCheck);

  if (liveccStopBtn) {
    liveccStopBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'stopLiveCCCheck' });
      liveccStopBtn.style.display = 'none';
      liveccBtn.style.display = 'block';
      liveccBtn.disabled = false;
      updateLiveCCStatus('Checking stopped', 'error');
    });
  }
}

function startLiveCCCheck() {
  const bin = cleanBin(liveccBinInput.value);

  if (!bin) {
    updateLiveCCStatus('Please enter a BIN number', 'error');
    return;
  }

  if (bin.length < 6) {
    updateLiveCCStatus('BIN must be at least 6 digits', 'error');
    return;
  }

  // Disable button and show progress
  liveccBtn.disabled = true;
  liveccBtn.textContent = '⏳ Checking...';
  liveccProgressSection.style.display = 'block';
  liveccResults.style.display = 'none';
  liveccStopBtn.style.display = 'block';

  updateLiveCCProgress(0, 'Initializing...');

  // Send message to background to start checking
  chrome.runtime.sendMessage({
    action: 'checkLiveCC',
    bin: bin,
    country: liveccCountrySelect.value,
    expiryMonth: liveccExpiryMonth.value,
    expiryYear: liveccExpiryYear.value
  }, (response) => {
    if (chrome.runtime.lastError) {
      showLiveCCError('Error: ' + chrome.runtime.lastError.message);
    }
  });
}

function updateLiveCCStatus(message, type = '') {
  if (liveccStatusDiv) {
    liveccStatusDiv.textContent = message;
    liveccStatusDiv.className = 'status ' + type;
  }
}

function updateLiveCCProgress(percent, status) {
  if (liveccProgressBar) {
    liveccProgressBar.style.width = percent + '%';
  }
  if (liveccProgressPercent) {
    liveccProgressPercent.textContent = percent + '%';
  }
  if (liveccProgressStatus) {
    liveccProgressStatus.textContent = status;
  }
}

function showLiveCCResults(liveCards) {
  liveccProgressSection.style.display = 'none';
  liveccBtn.disabled = false;
  liveccBtn.textContent = '🔍 Check Live CC';
  liveccBtn.style.display = 'block';
  liveccStopBtn.style.display = 'none';

  if (!liveCards || liveCards.length === 0) {
    updateLiveCCStatus('No live cards found', 'error');
    liveccResults.style.display = 'block';
    liveccCardsList.innerHTML = '<p class="no-cards-message">No live cards found in this batch. Try again!</p>';
    return;
  }

  updateLiveCCStatus(`✅ Found ${liveCards.length} LIVE cards!`, 'success');
  liveccResults.style.display = 'block';

  let html = '';
  liveCards.forEach((card, index) => {
    html += `
      <div class="livecc-card-item live">
        <div class="livecc-card-info">
          <div class="livecc-card-number">${card.cardNumber}</div>
          <div class="livecc-card-details">
            <span>Exp: ${card.expiry}</span>
            <span>CVV: ${card.cvv}</span>
          </div>
        </div>
        <button class="btn-autofill-card" data-cardnumber="${card.cardNumber}" data-expiry="${card.expiry}" data-cvv="${card.cvv}">🔄 Autofill</button>
      </div>
    `;
  });

  liveccCardsList.innerHTML = html;

  // Add autofill handlers
  document.querySelectorAll('.btn-autofill-card').forEach(btn => {
    btn.addEventListener('click', async function () {
      const cardNumber = this.getAttribute('data-cardnumber');
      const expiry = this.getAttribute('data-expiry');
      const cvv = this.getAttribute('data-cvv');

      // Parse expiry (format: MM/YY)
      const [expMonth, expYear] = expiry.split('/');

      // Create card object for autofill
      const cardData = {
        card_number: cardNumber,
        expiry_month: expMonth,
        expiry_year: '20' + expYear,
        cvv: cvv
      };

      // Save to storage and trigger autofill
      // Determine country and address details
      const selectedCountry = liveccCountrySelect ? liveccCountrySelect.value : 'KR';
      let addressData = {
        name: 'Seojun Lim',
        address: '123 Gangnam-daero',
        city: 'Seoul',
        zip: '06130',
        state: 'Seoul',
        country: 'KR'
      };

      if (selectedCountry === 'IN') {
        addressData = {
          name: 'Rajesh Kumar',
          address: '12 MG Road',
          city: 'Mumbai',
          zip: '400001',
          state: 'Maharashtra',
          country: 'IN'
        };
      } else if (selectedCountry === 'US') {
        addressData = {
          name: 'John Smith',
          address: '456 Market St',
          city: 'New York',
          zip: '10001',
          state: 'New York',
          country: 'US'
        };
      } else if (selectedCountry === 'GB') {
        addressData = {
          name: 'James Wilson',
          address: '10 Downing St',
          city: 'London',
          zip: 'SW1A 2AA',
          state: 'London',
          country: 'GB'
        };
      } else if (selectedCountry === 'DE') {
        addressData = {
          name: 'Max Müller',
          address: 'Berliner Str. 42',
          city: 'Berlin',
          zip: '10115',
          state: 'Berlin',
          country: 'DE'
        };
      }

      // Save to storage and trigger autofill
      await chrome.storage.local.set({
        generatedCards: [cardData],
        randomData: addressData
      });

      // Get active tab and send fill command
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, { action: 'fillForm' });
        this.textContent = '✓ Filled!';
        setTimeout(() => { this.textContent = '🔄 Autofill'; }, 1500);
      } else {
        this.textContent = '❌ No tab';
        setTimeout(() => { this.textContent = '🔄 Autofill'; }, 1500);
      }
    });
  });
}

function showLiveCCError(message) {
  liveccProgressSection.style.display = 'none';
  liveccBtn.disabled = false;
  liveccBtn.textContent = '🔍 Check Live CC';
  liveccBtn.style.display = 'block';
  liveccStopBtn.style.display = 'none';
  updateLiveCCStatus('❌ ' + message, 'error');
}

// ========== OpenAI Account Tab Functions ==========

function initializeOpenAITab() {
  if (!createOpenAIBtn) return;

  // Create Account button handler
  createOpenAIBtn.addEventListener('click', createOpenAIAccount);

  // Fetch Code button handler
  if (fetchCodeBtn) {
    fetchCodeBtn.addEventListener('click', fetchVerificationCode);
  }

  // Copy email button handler
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      if (currentTempEmail && currentTempEmail.email) {
        copyToClipboard(currentTempEmail.email);
        copyEmailBtn.textContent = '✓';
        setTimeout(() => { copyEmailBtn.textContent = '📋'; }, 1500);
      }
    });
  }
}

async function createOpenAIAccount() {
  try {
    // Check if already logged in to ChatGPT
    const cookie = await chrome.cookies.get({ url: 'https://chatgpt.com', name: '__Secure-next-auth.session-token' });
    if (cookie) {
      updateOpenAIStatus('❌ Already logged in! Please log out from ChatGPT first.', 'error');
      return;
    }

    // Show progress
    if (openaiProgress) openaiProgress.style.display = 'block';
    updateOpenAIProgress(1, 'Generating temp email...');
    createOpenAIBtn.disabled = true;
    createOpenAIBtn.textContent = '⏳ Creating...';

    // Step 1: Generate temp email
    const emailResult = await chrome.runtime.sendMessage({ action: 'generateTempEmail' });

    if (!emailResult.success) {
      throw new Error(emailResult.error || 'Failed to generate email');
    }

    currentTempEmail = emailResult;
    if (tempEmailValue) {
      tempEmailValue.textContent = emailResult.email;
    }

    updateOpenAIProgress(2, 'Getting credentials...');

    // Get credentials
    const credResult = await chrome.runtime.sendMessage({
      action: 'getOpenAICredentials',
      emailPrefix: emailResult.login
    });

    currentCredentials = credResult;

    updateOpenAIProgress(3, 'Opening ChatGPT & starting automation...');
    updateOpenAIStatus(`📧 Email: ${emailResult.email}\n🔑 Password: ${credResult.password}`, 'success');

    // Step 2: Open ChatGPT signup page
    const newTab = await chrome.tabs.create({ url: 'https://chatgpt.com' });

    // Wait for tab to load then send automation command
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Send automation command to the ChatGPT tab
    const credentials = {
      email: emailResult.email,
      password: credResult.password,
      fullName: credResult.fullName,
      birthday: credResult.birthday,
      timestamp: Date.now() // Add timestamp for expiry check
    };

    // Store credentials for cross-page persistence
    await chrome.storage.local.set({ openaiPendingCredentials: credentials });

    // Save account to Saved Accounts immediately (so user can fetch code later)
    saveCreatedOpenAIAccount(emailResult.email, credResult.password, emailResult.login, emailResult.domain, emailResult.mailboxPassword);

    // Try to send message to the new tab
    try {
      await chrome.tabs.sendMessage(newTab.id, {
        action: 'automateOpenAI',
        credentials: credentials
      });
      console.log('[OpenAI Popup] Automation command sent to tab');
    } catch (e) {
      console.log('[OpenAI Popup] Could not send message, content script will auto-detect credentials');
    }

    // Show fetch code button and instructions
    if (fetchCodeBtn) fetchCodeBtn.style.display = 'block';

    createOpenAIBtn.disabled = false;
    createOpenAIBtn.textContent = '🚀 Create OpenAI Account';

    updateOpenAIStatus(`🤖 Automation started! Watch the browser...\n\n📧 Email: ${emailResult.email}\n🔑 Password: ${credResult.password}\n👤 Name: ${credResult.fullName}\n🎂 Birthday: ${credResult.birthday.month}/${credResult.birthday.day}/${credResult.birthday.year}\n\n⏳ Click "Fetch Verification Code" after OpenAI sends the email`, 'loading');

  } catch (error) {
    console.error('[OpenAI] Error:', error);
    updateOpenAIStatus('❌ Error: ' + error.message, 'error');
    createOpenAIBtn.disabled = false;
    createOpenAIBtn.textContent = '🚀 Create OpenAI Account';
  }
}

async function fetchVerificationCode() {
  if (!currentTempEmail) {
    updateOpenAIStatus('❌ No email generated yet. Click "Create OpenAI Account" first.', 'error');
    return;
  }

  try {
    fetchCodeBtn.disabled = true;
    fetchCodeBtn.textContent = '⏳ Checking inbox...';
    updateOpenAIStatus('📨 Checking inbox for verification code... (this may take up to 90 seconds)', 'loading');

    const result = await chrome.runtime.sendMessage({
      action: 'checkVerificationCode',
      login: currentTempEmail.login,
      domain: currentTempEmail.domain
    });

    if (result.success) {
      updateOpenAIProgress(4, 'Verification code received!');
      updateOpenAIStatus(`✅ Verification Code: ${result.code}\n\nAuto-entering code on OpenAI page...`, 'success');

      // Account already saved on creation, no need to save again

      // Copy code to clipboard
      copyToClipboard(result.code);

      // Try to auto-enter the code on the active OpenAI tab
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: false });
        for (const tab of tabs) {
          if (tab.url && (tab.url.includes('openai.com') || tab.url.includes('chatgpt.com'))) {
            await chrome.tabs.sendMessage(tab.id, {
              action: 'enterVerificationCode',
              code: result.code
            });
            console.log('[OpenAI Popup] Code sent to tab for auto-entry');
            break;
          }
        }
      } catch (e) {
        console.log('[OpenAI Popup] Could not auto-enter code:', e);
      }

      fetchCodeBtn.textContent = '✅ Code: ' + result.code;
      updateOpenAIProgress(5, 'Account creation complete!');
      setTimeout(() => {
        fetchCodeBtn.textContent = '📨 Fetch Verification Code';
        fetchCodeBtn.disabled = false;
      }, 5000);

    } else {
      updateOpenAIStatus('❌ ' + (result.error || 'Could not find verification email'), 'error');
      fetchCodeBtn.disabled = false;
      fetchCodeBtn.textContent = '📨 Fetch Verification Code';
    }
  } catch (error) {
    console.error('[OpenAI] Fetch error:', error);
    updateOpenAIStatus('❌ Error: ' + error.message, 'error');
    fetchCodeBtn.disabled = false;
    fetchCodeBtn.textContent = '📨 Fetch Verification Code';
  }
}

function updateOpenAIStatus(message, type = '') {
  if (openaiStatusDiv) {
    openaiStatusDiv.innerHTML = '<p>' + message.replace(/\n/g, '<br>') + '</p>';
    openaiStatusDiv.className = 'status ' + type;
  }
}

function updateOpenAIProgress(step, status) {
  if (openaiProgressBar) {
    const percentage = (step / 5) * 100;
    openaiProgressBar.style.width = percentage + '%';
  }

  const steps = document.querySelectorAll('.progress-steps .step');
  steps.forEach((el, i) => {
    el.classList.remove('active', 'completed');
    if (i + 1 < step) el.classList.add('completed');
    if (i + 1 === step) el.classList.add('active');
  });

  updateOpenAIStatus(status, 'loading');
}

function saveCreatedOpenAIAccount(email, password, login, domain, mailboxPassword) {
  chrome.storage.local.get(['savedOpenAIAccounts'], (result) => {
    const accounts = result.savedOpenAIAccounts || [];
    accounts.unshift({
      email,
      password,
      login,           // Needed for fetching verification codes later
      domain,          // Needed for fetching verification codes later
      mailboxPassword, // Needed for re-authentication with Mail.tm
      createdAt: new Date().toISOString()
    });
    // Keep only last 20 accounts
    chrome.storage.local.set({ savedOpenAIAccounts: accounts.slice(0, 20) });
    loadSavedAccounts();
  });
}

function loadSavedAccounts() {
  chrome.storage.local.get(['savedOpenAIAccounts'], (result) => {
    const accounts = result.savedOpenAIAccounts || [];

    if (accounts.length > 0 && savedAccountsSection && savedAccountsList) {
      savedAccountsSection.style.display = 'block';
      savedAccountsList.innerHTML = accounts.map((acc, index) => `
        <div class="saved-account-item">
          <div class="account-info">
            <div class="account-row-mini">
              <span class="account-email" title="${acc.email}">${acc.email}</span>
              <button class="btn-copy-mini" data-copy="${acc.email}" title="Copy Email">📋</button>
            </div>
            <div class="account-row-mini">
              <span class="account-password">Pass: ${acc.password}</span>
              <button class="btn-copy-mini" data-copy="${acc.password}" title="Copy Password">📋</button>
            </div>
          </div>
          <div class="account-actions">
            <button class="btn-fetch-account-code" data-index="${index}" ${acc.login && acc.domain ? '' : 'disabled title="No inbox data"'}>📨 Fetch</button>
            <button class="btn-delete-account" data-index="${index}" title="Delete Account">🗑️</button>
          </div>
        </div>
      `).join('');

      // Attach event listeners for Fetch Code buttons
      document.querySelectorAll('.btn-fetch-account-code').forEach(btn => {
        btn.addEventListener('click', async function () {
          const accountIndex = parseInt(this.getAttribute('data-index'));
          await fetchCodeForAccount(accountIndex, this);
        });
      });

      // Attach event listeners for Copy buttons
      document.querySelectorAll('.btn-copy-mini').forEach(btn => {
        btn.addEventListener('click', function () {
          const text = this.getAttribute('data-copy');
          copyToClipboard(text);
          const originalText = this.textContent;
          this.textContent = '✓';
          setTimeout(() => { this.textContent = originalText; }, 1500);
        });
      });

      // Attach event listeners for Delete buttons
      document.querySelectorAll('.btn-delete-account').forEach(btn => {
        btn.addEventListener('click', function () {
          const accountIndex = parseInt(this.getAttribute('data-index'));
          deleteSavedAccount(accountIndex);
        });
      });
    } else if (savedAccountsSection) {
      savedAccountsSection.style.display = 'none';
    }
  });
}

// Alias for backward compatibility
function loadCreatedAccounts() {
  loadSavedAccounts();
}

async function deleteSavedAccount(index) {
  const result = await chrome.storage.local.get(['savedOpenAIAccounts']);
  let accounts = result.savedOpenAIAccounts || [];

  if (index >= 0 && index < accounts.length) {
    accounts.splice(index, 1);
    await chrome.storage.local.set({ savedOpenAIAccounts: accounts });
    loadSavedAccounts();
  }
}

async function fetchCodeForAccount(accountIndex, button) {
  const result = await chrome.storage.local.get(['savedOpenAIAccounts']);
  const accounts = result.savedOpenAIAccounts || [];
  const account = accounts[accountIndex];

  if (!account || !account.login || !account.domain) {
    updateOpenAIStatus('❌ Cannot fetch code - no inbox data for this account', 'error');
    return;
  }

  try {
    button.disabled = true;
    button.textContent = '⏳ Checking...';
    updateOpenAIStatus(`📨 Checking inbox for ${account.email}...`, 'loading');

    const codeResult = await chrome.runtime.sendMessage({
      action: 'checkVerificationCode',
      login: account.login,
      domain: account.domain,
      mailboxPassword: account.mailboxPassword  // For re-authentication if token expired
    });

    if (codeResult.success) {
      updateOpenAIStatus(`✅ Verification Code for ${account.email}: ${codeResult.code}`, 'success');
      button.textContent = '✅ ' + codeResult.code;
      copyToClipboard(codeResult.code);

      // Try to auto-enter the code on any open OpenAI verification tab
      try {
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          // Check for auth.openai.com (verification page), chatgpt.com, or openai.com
          if (tab.url && (tab.url.includes('auth.openai.com') || tab.url.includes('openai.com') || tab.url.includes('chatgpt.com'))) {
            console.log('[Saved Accounts] Auto-entering code on tab:', tab.url);
            await chrome.tabs.sendMessage(tab.id, {
              action: 'enterVerificationCode',
              code: codeResult.code
            });
            console.log('[Saved Accounts] Code sent to tab for auto-fill');
            break;
          }
        }
      } catch (e) {
        console.log('[Saved Accounts] Could not auto-enter code:', e);
      }

      setTimeout(() => {
        button.textContent = '📨 Fetch Code';
        button.disabled = false;
      }, 5000);
    } else {
      updateOpenAIStatus(`❌ No verification email found for ${account.email}`, 'error');
      button.textContent = '❌ Not Found';
      setTimeout(() => {
        button.textContent = '📨 Fetch Code';
        button.disabled = false;
      }, 3000);
    }
  } catch (error) {
    console.error('[Saved Accounts] Fetch error:', error);
    updateOpenAIStatus('❌ Error: ' + error.message, 'error');
    button.textContent = '📨 Fetch Code';
    button.disabled = false;
  }
}
