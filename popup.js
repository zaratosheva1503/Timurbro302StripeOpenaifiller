const DEFAULT_BIN = '625814260257xxxx';
const INDIA_DEFAULT_BIN = '551827894390xxxx';

let binInput, generateBtn, clearBtn, statusDiv, savedBinDiv, savedBinValue, generateMethodSelect, countrySelect, expiryMonth, expiryYear;
let precardBinInput, generatePrecardsBtn, clearPrecardsBtn, precardStatusDiv, precardsList, precardMethodSelect, precardCountrySelect;
let tabBtns, tabContents;

// K12 elements
let createAccountBtn, k12ProgressSection, k12ProgressBar, k12ProgressPercent, k12ProgressStatus;
let k12Result, k12Email, k12Password, k12HistoryList;

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

  // K12 elements
  createAccountBtn = document.getElementById('createAccountBtn');
  k12ProgressSection = document.getElementById('k12ProgressSection');
  k12ProgressBar = document.getElementById('k12ProgressBar');
  k12ProgressPercent = document.getElementById('k12ProgressPercent');
  k12ProgressStatus = document.getElementById('k12ProgressStatus');
  k12Result = document.getElementById('k12Result');
  k12Email = document.getElementById('k12Email');
  k12Password = document.getElementById('k12Password');
  k12HistoryList = document.getElementById('k12HistoryList');

  initializeTabs();
  initializeGenerateTab();
  initializePrecardsTab();
  initializeK12Tab();
  loadInitialData();

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
    // South Korea defaults
    console.log('Setting South Korea defaults');
    binInput.value = DEFAULT_BIN;
    savedBinValue.textContent = DEFAULT_BIN;
    if (expiryMonth) expiryMonth.value = '05';
    if (expiryYear) expiryYear.value = '2028';
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
      } else if (tabName === 'k12') {
        document.getElementById('k12Tab').classList.add('active');
        loadK12History();
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

  // Update storage with new BIN
  chrome.storage.local.set({
    defaultbincursorvo1: INDIA_DEFAULT_BIN,
    precardBin: INDIA_DEFAULT_BIN
  });
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

    if (!tab.url.includes('checkout.stripe.com') && !tab.url.includes('pay.openai.com') && !tab.url.includes('chatgpt.com') && !tab.url.includes('payments.google.com') && !tab.url.includes('pay.google.com')) {
      updateStatus('❌ Please open a supported payment page first!', 'error');
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

  if (!tab.url || (!tab.url.includes('checkout.stripe.com') && !tab.url.includes('pay.openai.com') && !tab.url.includes('chatgpt.com') && !tab.url.includes('payments.google.com') && !tab.url.includes('pay.google.com'))) {
    updatePrecardStatus('❌ Please open a supported payment page first!', 'error');
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
  } else if (request.action === 'k12Progress') {
    updateK12Progress(request.percent, request.status);
  } else if (request.action === 'k12Complete') {
    showK12Result(request.email, request.password);
  } else if (request.action === 'k12Error') {
    showK12Error(request.message);
  } else if (request.action === 'k12CodeFetched') {
    showFetchedCode(request.code);
  }
});

// ========== K12 Tab Functions ==========

function initializeK12Tab() {
  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', startAccountCreation);
  }

  // Setup copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-copy');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        copyToClipboard(targetElement.textContent);
        this.textContent = '✓';
        setTimeout(() => { this.textContent = '📋'; }, 1500);
      }
    });
  });

  // Initialize code fetcher
  initializeCodeFetcher();
}

function startAccountCreation() {
  // Disable button and show progress
  createAccountBtn.disabled = true;
  createAccountBtn.textContent = '⏳ Creating...';
  k12ProgressSection.style.display = 'block';
  k12Result.style.display = 'none';
  document.getElementById('k12Actions').style.display = 'none';

  updateK12Progress(0, 'Initializing...');

  // Send message to background to start the process
  chrome.runtime.sendMessage({
    action: 'createChatGPTAccount'
  }, (response) => {
    if (chrome.runtime.lastError) {
      showK12Error('Error: ' + chrome.runtime.lastError.message);
    }
  });
}

function updateK12Progress(percent, status) {
  if (k12ProgressBar) {
    k12ProgressBar.style.width = percent + '%';
  }
  if (k12ProgressPercent) {
    k12ProgressPercent.textContent = percent + '%';
  }
  if (k12ProgressStatus) {
    k12ProgressStatus.textContent = status;
  }
}

function showK12Result(email, password) {
  k12ProgressSection.style.display = 'none';
  k12Result.style.display = 'block';
  document.getElementById('k12Actions').style.display = 'block';

  createAccountBtn.disabled = false;
  createAccountBtn.textContent = '🚀 CREATE ACCOUNT';

  k12Email.textContent = email;
  k12Password.textContent = password;

  // Save to history
  saveK12Account(email, password);
  loadK12History();
}

function showK12Error(message) {
  k12ProgressSection.style.display = 'none';
  document.getElementById('k12Actions').style.display = 'block';

  createAccountBtn.disabled = false;
  createAccountBtn.textContent = '🚀 CREATE ACCOUNT';

  // Show error in result section
  k12Result.style.display = 'block';
  k12Result.innerHTML = `
    <div class="k12-success" style="color: #f87171;">
      <span class="success-icon">❌</span>
      <span>Failed: ${message}</span>
    </div>
  `;
}

function saveK12Account(email, password) {
  chrome.storage.local.get(['k12Accounts'], function (result) {
    const accounts = result.k12Accounts || [];
    accounts.unshift({
      email: email,
      password: password,
      date: new Date().toLocaleDateString()
    });
    // Keep only last 10 accounts
    if (accounts.length > 10) accounts.pop();
    chrome.storage.local.set({ k12Accounts: accounts });
  });
}

function loadK12History() {
  chrome.storage.local.get(['k12Accounts'], function (result) {
    const accounts = result.k12Accounts || [];

    if (accounts.length === 0) {
      k12HistoryList.innerHTML = '<p class="no-history">No accounts created yet</p>';
      return;
    }

    let html = '';
    accounts.forEach((acc, index) => {
      html += `
        <div class="history-item">
          <span class="history-email">${acc.email}</span>
          <button class="history-copy-btn" data-email="${acc.email}" data-pass="${acc.password}" title="Copy credentials">📋</button>
        </div>
      `;
    });

    k12HistoryList.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.history-copy-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const email = this.getAttribute('data-email');
        const pass = this.getAttribute('data-pass');
        copyToClipboard(`${email}\n${pass}`);
        this.textContent = '✓';
        setTimeout(() => { this.textContent = '📋'; }, 1500);
      });
    });
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// ========== Code Fetcher Functions ==========

function initializeCodeFetcher() {
  const fetchCodeBtn = document.getElementById('fetchCodeBtn');
  const codeFetcherEmail = document.getElementById('codeFetcherEmail');

  if (fetchCodeBtn) {
    fetchCodeBtn.addEventListener('click', () => {
      const email = codeFetcherEmail.value.trim();
      if (!email || !email.includes('@')) {
        updateCodeStatus('Please enter a valid email', 'error');
        return;
      }
      fetchVerificationCode(email);
    });
  }

  // Also setup copy button for fetched code
  document.querySelectorAll('.copy-btn[data-copy="fetchedCode"]').forEach(btn => {
    btn.addEventListener('click', function () {
      const fetchedCode = document.getElementById('fetchedCode');
      if (fetchedCode && fetchedCode.textContent !== '------') {
        copyToClipboard(fetchedCode.textContent);
        this.textContent = '✓';
        setTimeout(() => { this.textContent = '📋'; }, 1500);
      }
    });
  });
}

function fetchVerificationCode(email) {
  const fetchCodeBtn = document.getElementById('fetchCodeBtn');
  const codeResult = document.getElementById('codeResult');

  fetchCodeBtn.disabled = true;
  fetchCodeBtn.textContent = '⏳ Fetching...';
  updateCodeStatus('Opening temp mail inbox...', 'loading');

  // Extract username from email
  const emailName = email.split('@')[0];

  // Send message to background to fetch code
  chrome.runtime.sendMessage({
    action: 'fetchK12Code',
    email: email,
    emailName: emailName
  }, (response) => {
    if (chrome.runtime.lastError) {
      updateCodeStatus('Error: ' + chrome.runtime.lastError.message, 'error');
      fetchCodeBtn.disabled = false;
      fetchCodeBtn.textContent = '🔍 GET CODE';
    }
  });
}

function updateCodeStatus(message, type) {
  const codeStatus = document.getElementById('codeStatus');
  if (codeStatus) {
    codeStatus.textContent = message;
    codeStatus.className = 'code-status ' + (type || '');
  }
}

function showFetchedCode(code) {
  const fetchCodeBtn = document.getElementById('fetchCodeBtn');
  const codeResult = document.getElementById('codeResult');
  const fetchedCode = document.getElementById('fetchedCode');

  fetchCodeBtn.disabled = false;
  fetchCodeBtn.textContent = '🔍 GET CODE';

  if (code) {
    fetchedCode.textContent = code;
    codeResult.style.display = 'block';
    updateCodeStatus('Code fetched successfully!', 'success');
  } else {
    updateCodeStatus('No verification code found in inbox', 'error');
  }
}
