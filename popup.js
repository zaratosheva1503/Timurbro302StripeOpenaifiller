const DEFAULT_BIN = '625814260207xxxx';
const INDIA_DEFAULT_BIN = '551827706xxxx';

let binInput, generateBtn, clearBtn, statusDiv, savedBinDiv, savedBinValue, generateMethodSelect, countrySelect, expiryMonth, expiryYear;
let precardBinInput, generatePrecardsBtn, clearPrecardsBtn, precardStatusDiv, precardsList, precardMethodSelect, precardCountrySelect;
let tabBtns, tabContents;

// Live CC elements
let liveccBinInput, liveccBtn, liveccStopBtn, liveccStatusDiv, liveccCountrySelect, liveccExpiryMonth, liveccExpiryYear;
let liveccProgressSection, liveccProgressBar, liveccProgressPercent, liveccProgressStatus;
let liveccResults, liveccCardsList;


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

  initializeTabs();
  initializeGenerateTab();
  initializePrecardsTab();
  initializeLiveCCTab();
  loadInitialData();
  loadVersion();

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

    if (!tab.url.includes('checkout.stripe.com') && !tab.url.includes('pay.openai.com') && !tab.url.includes('chatgpt.com') && !tab.url.includes('payments.google.com') && !tab.url.includes('pay.google.com') && !tab.url.includes('wallet.google.com')) {
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

  if (!tab.url || (!tab.url.includes('checkout.stripe.com') && !tab.url.includes('pay.openai.com') && !tab.url.includes('chatgpt.com') && !tab.url.includes('payments.google.com') && !tab.url.includes('pay.google.com') && !tab.url.includes('wallet.google.com'))) {
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
      await chrome.storage.local.set({
        generatedCards: [cardData],
        randomData: {
          name: 'Seojun Lim',
          address: '123 Gangnam-daero',
          city: 'Seoul',
          zip: '06130',
          state: 'Seoul',
          country: 'KR'
        }
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
