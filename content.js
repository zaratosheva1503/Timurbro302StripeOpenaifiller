let isProcessing = false;
let isAuthHandling = false;

// Check if we're inside a Stripe iframe
const isStripeIframe = window.location.hostname.includes('js.stripe.com');

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for ${selector}`));
      } else {
        setTimeout(checkElement, 100);
      }
    };

    checkElement();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Try to fill Stripe Elements iframes
async function tryFillStripeIframes(card) {
  console.log('[Zarif] Attempting to fill Stripe iframes...');

  // Find all Stripe iframes
  const iframes = document.querySelectorAll('iframe[src*="stripe"], iframe[name*="__privateStripeFrame"], iframe[title*="Secure"]');

  if (iframes.length === 0) {
    console.log('[Zarif] No Stripe iframes found');
    return false;
  }

  console.log(`[Zarif] Found ${iframes.length} potential Stripe iframes`);

  // Send message to each iframe via chrome.runtime to fill the inputs
  for (const iframe of iframes) {
    try {
      // Try to access iframe content (will fail for cross-origin)
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        // Same-origin iframe - fill directly
        const inputs = iframeDoc.querySelectorAll('input');
        for (const input of inputs) {
          const name = (input.name || '').toLowerCase();
          const placeholder = (input.placeholder || '').toLowerCase();
          const autocomplete = (input.autocomplete || '').toLowerCase();

          if (name.includes('cardnumber') || autocomplete.includes('cc-number') || placeholder.includes('card')) {
            await fillInputInIframe(input, card.card_number);
          } else if (name.includes('exp') || autocomplete.includes('cc-exp') || placeholder.includes('mm')) {
            const expiryStr = `${card.expiry_month}/${card.expiry_year.slice(-2)}`;
            await fillInputInIframe(input, expiryStr);
          } else if (name.includes('cvc') || autocomplete.includes('cc-csc') || placeholder.includes('cvc') || placeholder.includes('security')) {
            await fillInputInIframe(input, card.cvv);
          }
        }
        return true;
      }
    } catch (e) {
      console.log('[Zarif] Cannot access iframe directly (cross-origin):', e.message);
    }
  }

  return false;
}

async function fillInputInIframe(input, value) {
  input.focus();
  input.value = '';
  for (const char of value) {
    input.value += char;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
    await sleep(30);
  }
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
  console.log(`[Zarif] Filled iframe input with value length: ${value.length}`);
}

async function fillCardForm() {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  try {
    const storage = await chrome.storage.local.get(['generatedCards', 'randomData']);

    if (!storage.generatedCards || storage.generatedCards.length === 0) {
      showNotification('⚠️ Please generate cards first from extension popup', 'warning');
      isProcessing = false;
      return;
    }

    const card = storage.generatedCards[Math.floor(Math.random() * storage.generatedCards.length)];
    const randomData = storage.randomData || {
      name: 'Minho Kim',
      address: '123 Gangnam-daero',
      address2: '',
      city: 'Seoul',
      zip: '06130',
      state: 'Gangnam-gu',
      country: 'KR'
    };

    const selectedCountry = randomData.country || 'KR';

    showNotification('🔄 Auto-filling card details...', 'info');

    await sleep(500);

    // Helper function to simulate typing with keyboard events
    const simulateTyping = async (element, value) => {
      element.focus();
      element.value = '';
      for (const char of value) {
        element.value += char;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
        await sleep(30);
      }
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    // Helper to find input by multiple methods
    const findInput = (selectors) => {
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el;
      }
      return null;
    };

    // Helper to find input by placeholder text (for ChatGPT checkout)
    const findInputByPlaceholder = (placeholderText) => {
      const inputs = document.querySelectorAll('input');
      for (const input of inputs) {
        const placeholder = input.getAttribute('placeholder') || '';
        if (placeholder.toLowerCase().includes(placeholderText.toLowerCase())) {
          return input;
        }
      }
      return null;
    };

    // Helper to find input by associated label text
    const findInputByLabel = (labelText) => {
      // Method 1: Find by aria-label
      let input = document.querySelector(`input[aria-label*="${labelText}" i]`);
      if (input) return input;

      // Method 2: Find label element and get associated input
      const labels = document.querySelectorAll('label, div[class*="label"], span[class*="label"]');
      for (const label of labels) {
        if (label.textContent.toLowerCase().includes(labelText.toLowerCase())) {
          // Check for 'for' attribute
          if (label.htmlFor) {
            input = document.getElementById(label.htmlFor);
            if (input) return input;
          }
          // Check for input inside or next to label
          input = label.querySelector('input') || label.parentElement?.querySelector('input') || label.nextElementSibling?.querySelector('input') || label.nextElementSibling;
          if (input && input.tagName === 'INPUT') return input;
        }
      }

      // Method 3: Find by nearby text content
      const allInputs = document.querySelectorAll('input:not([type="hidden"])');
      for (const inp of allInputs) {
        const parent = inp.closest('div[class*="field"], div[class*="input"], div[class*="form"]');
        if (parent && parent.textContent.toLowerCase().includes(labelText.toLowerCase())) {
          return inp;
        }
      }

      return null;
    };

    // Check if we're on a Stripe checkout page with iframes
    const isStripeCheckout = window.location.hostname.includes('checkout.stripe.com');
    const isChatGPTCheckout = window.location.hostname.includes('chatgpt.com');
    const isGooglePay = window.location.hostname.includes('payments.google.com') || window.location.hostname.includes('pay.google.com') || window.location.hostname.includes('wallet.google.com');

    // For Stripe checkout, look for the specific input patterns they use
    const cardNumberSelectors = [
      'input[name="cardNumber"]',
      'input[placeholder*="1234"]',
      'input[placeholder*="Card number"]',
      'input[data-elements-stable-field-name="cardNumber"]',
      'input[autocomplete="cc-number"]',
      '#cardNumber',
      'input[aria-label*="Card number"]',
      'input[name="number"]',
      // Stripe specific
      'input.InputElement[name="cardnumber"]',
      'input[data-stripe="number"]',
      // ChatGPT checkout specific
      'input[placeholder="Card number"]',
      'input[id*="cardNumber"]',
      'input[data-testid*="card-number"]',
      // Google Pay specific
      'input[aria-label="Card number"]',
      'input[placeholder="Card number"]'
    ];

    let cardNumberInput = findInput(cardNumberSelectors);

    // Fallback: find by label text for ChatGPT checkout
    if (!cardNumberInput && isChatGPTCheckout) {
      cardNumberInput = findInputByLabel('Card number') || findInputByPlaceholder('card');
    }

    // Fallback for Google Pay
    if (!cardNumberInput && isGooglePay) {
      cardNumberInput = findInputByLabel('Card number') || findInputByPlaceholder('Card number');
    }

    // Try to fill Stripe iframes if on ChatGPT checkout
    let filledViaIframe = false;
    if (isChatGPTCheckout) {
      filledViaIframe = await tryFillStripeIframes(card);
    }

    if (cardNumberInput) {
      console.log('✅ Found card number input');
      await simulateTyping(cardNumberInput, card.card_number);
      await sleep(400);
    } else if (!filledViaIframe) {
      console.log('❌ Card number input not found, trying alternative approach');
      // Try to find any visible card-related input
      const allInputs = document.querySelectorAll('input');
      for (const input of allInputs) {
        const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
        if (placeholder.includes('card') || placeholder.includes('1234')) {
          console.log('✅ Found card input via fallback');
          await simulateTyping(input, card.card_number);
          await sleep(400);
          break;
        }
      }
    }

    // Find expiry input - handle both combined and separate month/year
    const expirySelectors = [
      'input[name="cardExpiry"]',
      'input[placeholder*="MM"]',
      'input[placeholder*="Expir"]',
      'input[data-elements-stable-field-name="cardExpiry"]',
      'input[autocomplete="cc-exp"]',
      'input[aria-label*="Expir"]',
      'input[name="expiry"]',
      'input.InputElement[name="exp-date"]',
      // ChatGPT checkout specific
      'input[placeholder="Expiration date"]',
      'input[id*="expir"]',
      'input[data-testid*="expir"]',
      // Google Pay specific
      'input[placeholder="MM/YY"]',
      'input[aria-label*="MM/YY"]'
    ];

    let expiryInput = findInput(expirySelectors);

    // Fallback for ChatGPT checkout
    if (!expiryInput && isChatGPTCheckout) {
      expiryInput = findInputByLabel('Expiration') || findInputByPlaceholder('expir');
    }

    // Fallback for Google Pay
    if (!expiryInput && isGooglePay) {
      expiryInput = findInputByPlaceholder('MM/YY') || findInputByLabel('MM/YY');
    }

    if (expiryInput) {
      console.log('✅ Found expiry input');
      const expiryStr = `${card.expiry_month}/${card.expiry_year.slice(-2)}`;
      await simulateTyping(expiryInput, expiryStr);
      await sleep(400);
    } else {
      // Try separate month/year fields
      const monthInput = document.querySelector('input[name*="month"], select[name*="month"]');
      const yearInput = document.querySelector('input[name*="year"], select[name*="year"]');
      if (monthInput && yearInput) {
        console.log('✅ Found separate month/year inputs');
        if (monthInput.tagName === 'SELECT') {
          monthInput.value = card.expiry_month;
          monthInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          await simulateTyping(monthInput, card.expiry_month);
        }
        await sleep(200);
        if (yearInput.tagName === 'SELECT') {
          yearInput.value = card.expiry_year.slice(-2);
          yearInput.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          await simulateTyping(yearInput, card.expiry_year.slice(-2));
        }
        await sleep(400);
      }
    }

    // Find CVC input
    const cvcSelectors = [
      'input[name="cardCvc"]',
      'input[placeholder*="CVC"]',
      'input[placeholder*="CVV"]',
      'input[placeholder*="Security"]',
      'input[data-elements-stable-field-name="cardCvc"]',
      'input[autocomplete="cc-csc"]',
      'input[aria-label*="CVC"]',
      'input[aria-label*="security code"]',
      'input[name="cvc"]',
      'input.InputElement[name="cvc"]',
      // ChatGPT checkout specific
      'input[placeholder="Security code"]',
      'input[id*="cvc"]',
      'input[id*="cvv"]',
      'input[data-testid*="security"]',
      // Google Pay specific
      'input[placeholder="CVV"]',
      'input[aria-label="CVV"]'
    ];

    let cvcInput = findInput(cvcSelectors);

    // Fallback for ChatGPT checkout
    if (!cvcInput && isChatGPTCheckout) {
      cvcInput = findInputByLabel('Security') || findInputByLabel('CVC') || findInputByLabel('CVV');
    }

    // Fallback for Google Pay
    if (!cvcInput && isGooglePay) {
      cvcInput = findInputByPlaceholder('CVV') || findInputByLabel('CVV');
    }

    if (cvcInput) {
      console.log('✅ Found CVC input');
      await simulateTyping(cvcInput, card.cvv);
      await sleep(400);
    }

    // Find cardholder name input
    const nameSelectors = [
      'input[name="billingName"]',
      'input[placeholder*="Full name"]',
      'input[placeholder*="Name on card"]',
      'input[placeholder*="Cardholder"]',
      'input[autocomplete="cc-name"]',
      'input[aria-label*="name"]',
      'input[name*="name"]:not([name*="email"]):not([name*="user"])',
      // ChatGPT checkout specific
      'input[placeholder="Full name"]',
      'input[id*="fullName"]',
      'input[data-testid*="name"]',
      // Google Pay specific
      'input[placeholder="Cardholder name"]',
      'input[aria-label="Cardholder name"]'
    ];

    let nameInput = findInput(nameSelectors);

    // Fallback for ChatGPT checkout
    if (!nameInput && isChatGPTCheckout) {
      nameInput = findInputByLabel('Full name') || findInputByLabel('Name');
    }

    // Fallback for Google Pay
    if (!nameInput && isGooglePay) {
      nameInput = findInputByPlaceholder('Cardholder name') || findInputByLabel('Cardholder');
    }

    if (nameInput) {
      console.log('✅ Found name input');
      await simulateTyping(nameInput, randomData.name);
      await sleep(300);
    }

    // Handle country select (find the right one for billing)
    await sleep(300);
    const countrySelectors = [
      'select[name="billingCountry"]',
      'select[name*="country"]',
      'select[autocomplete="country"]',
      'select[aria-label*="Country"]'
    ];

    let countrySelect = null;
    for (const selector of countrySelectors) {
      countrySelect = document.querySelector(selector);
      if (countrySelect) break;
    }

    if (!countrySelect) {
      // Fallback: get first select that has country options
      const allSelects = document.querySelectorAll('select');
      for (const select of allSelects) {
        const options = select.querySelectorAll('option');
        for (const opt of options) {
          if (opt.value === 'KR' || opt.textContent.includes('Korea')) {
            countrySelect = select;
            break;
          }
        }
        if (countrySelect) break;
      }
    }

    if (countrySelect) {
      console.log('✅ Found country select, setting to:', selectedCountry);
      const options = countrySelect.querySelectorAll('option');

      // Debug: log all available options
      console.log('[Zarif] Available country options:');
      options.forEach((opt, i) => {
        console.log(`  ${i}: value="${opt.value}" text="${opt.textContent.trim()}"`);
      });

      // Find and select the matching country
      let countryFound = false;
      for (const opt of options) {
        const optValue = opt.value.toUpperCase();
        const optText = opt.textContent.trim().toLowerCase();

        if (selectedCountry === 'IN' && (optValue === 'IN' || optText === 'india')) {
          countrySelect.value = opt.value;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          countryFound = true;
          console.log('✅ Selected India');
          break;
        } else if (selectedCountry === 'GB' && (optValue === 'GB' || optValue === 'UK' || optText.includes('kingdom') || optText.includes('britain') || optText === 'uk' || optText === 'united kingdom')) {
          countrySelect.value = opt.value;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          countryFound = true;
          console.log('✅ Selected United Kingdom');
          break;
        } else if (selectedCountry === 'US' && (optValue === 'US' || optValue === 'USA' || optText.includes('united states') || optText === 'usa' || optText === 'america' || optText.includes('america'))) {
          countrySelect.value = opt.value;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          countryFound = true;
          console.log('✅ Selected United States');
          break;
        } else if (selectedCountry === 'KR' && (optValue === 'KR' || optText.includes('korea'))) {
          countrySelect.value = opt.value;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          countryFound = true;
          console.log('✅ Selected South Korea');
          break;
        }
      }

      // Fallback if exact match not found
      if (!countryFound) {
        console.log('[Zarif] Country not found by primary match, trying fallback...');
        for (const opt of options) {
          if (opt.value === selectedCountry || opt.value.toUpperCase() === selectedCountry) {
            countrySelect.value = opt.value;
            countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('✅ Selected country by value fallback:', selectedCountry);
            countryFound = true;
            break;
          }
        }
      }

      if (!countryFound) {
        console.log('[Zarif] ❌ Could not find country:', selectedCountry);
      }
      await sleep(500);
    }

    // Handle state/province SELECT dropdown based on country
    await sleep(500);

    let stateFound = false;
    const targetState = randomData.state;

    // First try specific selectors
    const stateSelectors = [
      'select[name*="state"]',
      'select[name*="province"]',
      'select[name*="region"]',
      'select[aria-label*="State"]',
      'select[aria-label*="Province"]',
      'select[aria-label*="Do Si"]',
      'select[aria-label*="County"]'
    ];

    for (const selector of stateSelectors) {
      const stateSelect = document.querySelector(selector);
      if (stateSelect && stateSelect !== countrySelect) {
        const options = stateSelect.querySelectorAll('option');

        // Try to find matching state based on randomData.state
        for (const opt of options) {
          const optText = opt.textContent.trim().toLowerCase();
          const optValue = opt.value.toLowerCase();
          const targetLower = targetState.toLowerCase();

          if (optText.includes(targetLower) || optValue.includes(targetLower) ||
            optText === targetLower || optValue === targetLower) {
            console.log('✅ Found and selecting state:', targetState);
            stateSelect.value = opt.value;
            stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
            stateFound = true;
            break;
          }
        }

        // Country-specific fallbacks if exact match not found
        if (!stateFound) {
          if (selectedCountry === 'KR') {
            for (const opt of options) {
              if (opt.textContent.includes('Seoul') || opt.value.includes('Seoul') ||
                opt.textContent.includes('서울')) {
                console.log('✅ Found and selecting Seoul (fallback)');
                stateSelect.value = opt.value;
                stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
                stateFound = true;
                break;
              }
            }
          } else if (selectedCountry === 'GB') {
            for (const opt of options) {
              if (opt.textContent.toLowerCase().includes('london') || opt.value.toLowerCase().includes('london')) {
                console.log('✅ Found and selecting London (fallback)');
                stateSelect.value = opt.value;
                stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
                stateFound = true;
                break;
              }
            }
          } else if (selectedCountry === 'US') {
            for (const opt of options) {
              if (opt.textContent.includes('New York') || opt.value === 'NY') {
                console.log('✅ Found and selecting New York (fallback)');
                stateSelect.value = opt.value;
                stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
                stateFound = true;
                break;
              }
            }
          }
        }

        if (stateFound) break;
      }
    }

    // Fallback: check ALL selects for state option
    if (!stateFound) {
      const allSelects = document.querySelectorAll('select');
      for (const select of allSelects) {
        // Skip the country select
        if (select === countrySelect) continue;

        const options = select.querySelectorAll('option');

        // Try to find matching state
        for (const opt of options) {
          const optText = opt.textContent.trim().toLowerCase();
          const optValue = opt.value.toLowerCase();
          const targetLower = targetState.toLowerCase();

          if (optText.includes(targetLower) || optValue.includes(targetLower)) {
            console.log('✅ Found and selecting state via fallback:', targetState);
            select.value = opt.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            stateFound = true;
            break;
          }
        }
        if (stateFound) break;
      }
    }

    // Fill billing address fields
    await sleep(300);

    const allInputs = document.querySelectorAll('input');
    for (const input of allInputs) {
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
      const name = (input.getAttribute('name') || '').toLowerCase();
      const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
      const combined = placeholder + name + ariaLabel;

      // Skip card-related fields and email
      if (combined.includes('card') || combined.includes('cvc') || combined.includes('cvv') ||
        combined.includes('email') || combined.includes('1234') || combined.includes('expir') ||
        combined.includes('mm') || input.type === 'hidden' || combined.includes('cardholder')) {
        continue;
      }

      if ((combined.includes('address') && !combined.includes('line 2') && !combined.includes('address2') && !combined.includes('apt')) ||
        combined.includes('street') || combined.includes('line1') || combined.includes('addressline1')) {
        console.log('✅ Filling address');
        await simulateTyping(input, randomData.address);
        await sleep(200);
      } else if (combined.includes('city') || combined.includes('town') || combined.includes('locality')) {
        console.log('✅ Filling city/town');
        await simulateTyping(input, randomData.city);
        await sleep(200);
      } else if (combined.includes('zip') || combined.includes('postal') || combined.includes('pin code') || combined.includes('pincode')) {
        console.log('✅ Filling postal/PIN code');
        await simulateTyping(input, randomData.zip);
        await sleep(200);
      } else if (combined.includes('district') || (combined.includes('state') && !combined.includes('country')) ||
        combined.includes('province') || combined.includes('region')) {
        // Only fill if it's an input, not a select (selects handled above)
        if (!document.querySelector(`select[name="${input.name}"]`)) {
          console.log('✅ Filling district/state');
          await simulateTyping(input, randomData.state);
          await sleep(200);
        }
      }
    }

    // Google Pay specific: fill fields by exact placeholder match
    if (isGooglePay) {
      console.log('✅ Google Pay detected, filling address fields...');

      // ===== GOOGLE WALLET SPECIFIC: Expand billing address and change country/state =====
      const isGoogleWallet = window.location.hostname.includes('wallet.google.com');

      if (isGoogleWallet) {
        console.log('[Zarif] Google Wallet: Starting comprehensive address handling...');

        // CRITICAL: Wait for form to fully load by polling for COUNTRY input
        let countryInput = null;
        let waitAttempts = 0;
        const maxWaitAttempts = 20; // Max 10 seconds (20 * 500ms)

        while (!countryInput && waitAttempts < maxWaitAttempts) {
          countryInput = document.querySelector('input[name="COUNTRY"]');
          if (!countryInput) {
            console.log('[Zarif] Google Wallet: Waiting for form to load... attempt', waitAttempts + 1);
            await sleep(500);
            waitAttempts++;
          }
        }

        console.log('[Zarif] Google Wallet: Form loaded after', waitAttempts, 'attempts. COUNTRY input found:', !!countryInput, 'value:', countryInput?.value);

        // ===== STEP 1: CHANGE COUNTRY DROPDOWN =====
        console.log('[Zarif] Google Wallet: Step 1 - Finding country dropdown...');
        let countryChanged = false;

        if (countryInput) {
          // Traverse up from input to find the dropdown container
          let container = countryInput.parentElement;
          let level = 0;

          while (container && level < 10) {
            console.log('[Zarif] Google Wallet: Level', level, 'tag:', container.tagName, 'children:', container.children.length);

            // Look for any clickable elements in this container
            const clickables = container.querySelectorAll('[role], button, [tabindex], [class*="select"], [class*="dropdown"]');

            if (clickables.length > 0) {
              console.log('[Zarif] Google Wallet: Found', clickables.length, 'clickable elements at level', level);

              // Click each one that might be a country dropdown
              for (const clickable of clickables) {
                const text = (clickable.innerText || clickable.textContent || '').toLowerCase();

                // Skip if it's clearly not country-related
                if (text.includes('state') || text.includes('city') || text.includes('address')) continue;

                console.log('[Zarif] Google Wallet: Clicking potential dropdown:', clickable.tagName);
                clickable.click();
                await sleep(400);
              }
            }

            // Also look for flag images or emoji
            const images = container.querySelectorAll('img, svg, [class*="flag"]');
            for (const img of images) {
              console.log('[Zarif] Google Wallet: Found image/flag, clicking parent...');
              img.parentElement?.click();
              await sleep(300);
            }

            container = container.parentElement;
            level++;
          }

          // After clicking, look for India option anywhere on page
          await sleep(500);
          console.log('[Zarif] Google Wallet: Looking for India option...');

          const allElements = document.querySelectorAll('*');
          for (const el of allElements) {
            const text = (el.innerText || '').trim();
            // Look for exactly "India" or "India (IN)" - the option item
            if ((text === 'India' || text === 'India (IN)' || text === '🇮🇳 India (IN)') &&
              el.children.length === 0) {  // Leaf node = actual option
              console.log('[Zarif] Google Wallet: Found India option, clicking:', text);
              el.click();
              el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
              countryChanged = true;
              await sleep(600);
              break;
            }
          }

          // If still not changed, try finding by partial match
          if (!countryChanged) {
            for (const el of allElements) {
              const text = (el.innerText || '').trim().toLowerCase();
              if (text.includes('india') && text.length < 20 && !text.includes('\n')) {
                const rect = el.getBoundingClientRect();
                if (rect.height > 10 && rect.height < 60) {  // Reasonable option size
                  console.log('[Zarif] Google Wallet: Found India (partial match), clicking');
                  el.click();
                  countryChanged = true;
                  await sleep(600);
                  break;
                }
              }
            }
          }
        }

        if (!countryChanged) {
          console.log('[Zarif] Google Wallet: Could not find/click country dropdown, trying direct input method...');
          // Fallback: directly set the hidden COUNTRY input
          const countryInput = document.querySelector('input[name="COUNTRY"]');
          if (countryInput) {
            countryInput.value = 'IN';
            countryInput.dispatchEvent(new Event('input', { bubbles: true }));
            countryInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('[Zarif] Google Wallet: Set COUNTRY input directly to IN');
          }
        }

        // Wait for country change to take effect
        await sleep(1000);

        // ===== STEP 2: FILL ADDRESS FIELDS VIA HIDDEN INPUTS =====
        console.log('[Zarif] Google Wallet: Step 2 - Filling address inputs...');

        const addressInputs = {
          'ADDRESS_LINE_1': randomData.address,
          'ADDRESS_LINE_2': randomData.address2 || '',
          'LOCALITY': randomData.city,
          'DEPENDENT_LOCALITY': randomData.city,
          'POSTAL_CODE': randomData.zip
        };

        for (const [name, value] of Object.entries(addressInputs)) {
          const input = document.querySelector(`input[name="${name}"]`);
          if (input && value) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`[Zarif] Google Wallet: Set ${name} to ${value}`);
          }
        }

        // ===== STEP 3: CHANGE STATE DROPDOWN =====
        console.log('[Zarif] Google Wallet: Step 3 - Finding state dropdown...');
        await sleep(500);

        // Search for elements containing Malaysian state names or "Kuala Lumpur"
        const malaysianStates = ['kuala lumpur', 'selangor', 'johor', 'penang', 'sabah', 'sarawak',
          'perak', 'kedah', 'pahang', 'terengganu', 'kelantan', 'melaka',
          'negeri sembilan', 'perlis', 'putrajaya', 'labuan'];

        let stateChanged = false;
        const allElementsForState = document.querySelectorAll('*');

        for (const el of allElementsForState) {
          if (['SCRIPT', 'STYLE', 'HTML', 'BODY', 'HEAD'].includes(el.tagName)) continue;

          const elText = (el.textContent || '').toLowerCase().trim();

          // Check if element shows a Malaysian state
          if (malaysianStates.some(state => elText === state || (elText.includes(state) && elText.length < 30))) {
            console.log('[Zarif] Google Wallet: Found Malaysian state element:', el.tagName, elText.slice(0, 20));

            // Click to open dropdown
            el.click();
            await sleep(500);
            if (el.parentElement) {
              el.parentElement.click();
              await sleep(500);
            }

            // Look for Indian state in the dropdown
            const targetState = (randomData.state || 'Maharashtra').toLowerCase();
            await sleep(300);

            const stateOptions = document.querySelectorAll('*');
            for (const optEl of stateOptions) {
              const optText = (optEl.textContent || '').trim().toLowerCase();

              if (optText === targetState || (optText.includes(targetState) && optText.length < 30)) {
                const rect = optEl.getBoundingClientRect();
                if (rect.height > 0 && rect.height < 100) {
                  console.log('[Zarif] Google Wallet: Found target state option:', optEl.textContent?.trim());
                  optEl.click();
                  stateChanged = true;
                  await sleep(500);
                  break;
                }
              }
            }

            if (stateChanged) break;
          }
        }

        if (!stateChanged) {
          console.log('[Zarif] Google Wallet: Could not change state dropdown');
        }

        console.log('[Zarif] Google Wallet: Comprehensive handling completed');
        console.log('[Zarif] Google Wallet: Country changed:', countryChanged, 'State changed:', stateChanged);
      }
      // ===== END GOOGLE WALLET SPECIFIC =====

      // Wait longer for modal/form fields to fully render after country selection
      await sleep(1500);

      // Log all visible inputs for debugging
      const debugInputs = document.querySelectorAll('input:not([type="hidden"])');
      console.log('[Zarif] Google Pay: Total visible inputs found:', debugInputs.length);
      debugInputs.forEach((input, idx) => {
        const placeholder = input.getAttribute('placeholder') || '';
        const name = input.getAttribute('name') || '';
        const id = input.getAttribute('id') || '';
        const value = input.value || '';
        const parent = input.closest('div')?.textContent?.slice(0, 50) || '';
        console.log(`[Zarif] Input ${idx}: placeholder="${placeholder}" name="${name}" id="${id}" value="${value}" parent="${parent}"`);
      });

      // Helper to fill Google Pay input using multiple detection methods
      const fillGPayField = async (searchPatterns, value, fieldName) => {
        const allInputs = document.querySelectorAll('input:not([type="hidden"])');

        for (const input of allInputs) {
          // Skip if already filled
          if (input.value && input.value.length > 0) continue;

          const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
          const name = (input.getAttribute('name') || '').toLowerCase();
          const id = (input.getAttribute('id') || '').toLowerCase();
          const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();

          // Also check parent container text (for Material Design labels)
          const parentDiv = input.closest('div');
          const parentText = parentDiv ? (parentDiv.textContent || '').toLowerCase() : '';

          // Check previous sibling or label
          const prevSibling = input.previousElementSibling;
          const siblingText = prevSibling ? (prevSibling.textContent || '').toLowerCase() : '';

          // Combine all searchable text
          const allText = placeholder + ' ' + name + ' ' + id + ' ' + ariaLabel + ' ' + parentText + ' ' + siblingText;

          // Check each pattern
          for (const pattern of searchPatterns) {
            if (allText.includes(pattern.toLowerCase())) {
              console.log(`✅ Google Pay: Found ${fieldName} field, filling with "${value}"`);

              // Focus and clear
              input.focus();
              input.value = '';

              // Type character by character with events
              for (const char of value) {
                input.value += char;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
                await sleep(30);
              }

              // Trigger change and blur
              input.dispatchEvent(new Event('change', { bubbles: true }));
              input.dispatchEvent(new Event('blur', { bubbles: true }));

              await sleep(300);
              return true;
            }
          }
        }

        console.log(`[Zarif] Google Pay: ${fieldName} field NOT found`);
        return false;
      };

      // Fill Street Address - search for "Street address" text anywhere
      await fillGPayField(['street address', 'street', 'address line 1', 'address1', 'addressline1'], randomData.address, 'Street Address');
      await sleep(300);

      // Fill Apt/Suite (optional)
      if (randomData.address2) {
        await fillGPayField(['apt', 'suite', 'unit', 'address line 2', 'address2'], randomData.address2, 'Apt/Suite');
        await sleep(300);
      }

      // Fill Town/City
      await fillGPayField(['town/city', 'town', 'city', 'locality', 'town or city'], randomData.city, 'Town/City');
      await sleep(300);

      // Fill PIN code / Postal code
      await fillGPayField(['pin code', 'pin', 'pincode', 'postal', 'zip', 'postcode'], randomData.zip, 'PIN Code');
      await sleep(300);

      // ===== COUNTRY DROPDOWN HANDLING - MUST HAPPEN BEFORE STATE =====
      console.log('[Zarif] Google Pay: ===== COUNTRY DROPDOWN HANDLING =====');
      const targetCountry = selectedCountry || 'IN';
      console.log('[Zarif] Google Pay: Target country:', targetCountry);

      // Look for current country displayed (Malaysia, MY, etc.)
      const allElements = document.querySelectorAll('div, span, button, li');
      let countryChanged = false;

      for (const el of allElements) {
        const text = (el.innerText || '').trim();
        // Find element showing current country (Malaysia)
        if (text === 'Malaysia (MY)' || text === 'Malaysia' ||
          (text.includes('Malaysia') && text.length < 25 && !text.includes('\n'))) {
          console.log('[Zarif] Google Pay: Found Malaysia element:', el.tagName, text);

          // Click to open country dropdown
          el.click();
          await sleep(500);

          // Also click parent (in case it's the trigger)
          if (el.parentElement) {
            el.parentElement.click();
            await sleep(300);
          }

          // Search for India option
          const countryOptions = document.querySelectorAll('div, span, li, button');
          for (const opt of countryOptions) {
            const optText = (opt.innerText || '').trim();
            if (optText === 'India (IN)' || optText === 'India' ||
              (optText.includes('India') && optText.length < 20 && !optText.includes('\n'))) {
              console.log('[Zarif] Google Pay: Found India option, clicking:', optText);
              opt.click();
              countryChanged = true;
              await sleep(800); // Wait for form to update with new country
              break;
            }
          }
          break;
        }
      }

      // Fallback: Set hidden COUNTRY input directly
      if (!countryChanged) {
        const countryInput = document.querySelector('input[name="COUNTRY"]');
        if (countryInput && countryInput.value !== targetCountry) {
          console.log('[Zarif] Google Pay: Setting COUNTRY input directly from', countryInput.value, 'to', targetCountry);
          countryInput.value = targetCountry;
          countryInput.dispatchEvent(new Event('input', { bubbles: true }));
          countryInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      console.log('[Zarif] Google Pay: Country changed:', countryChanged);
      await sleep(500);
      // ===== END COUNTRY DROPDOWN HANDLING =====

      // Handle State dropdown - Google Pay uses CUSTOM dropdown, not native <select>
      await sleep(500);

      const targetState = randomData.state || 'Maharashtra';
      console.log('[Zarif] Google Pay: ===== STATE DROPDOWN HANDLING =====');
      console.log('[Zarif] Google Pay: Target state:', targetState);

      // First try native selects (likely won't find any)
      const allSelects = document.querySelectorAll('select');
      console.log('[Zarif] Google Pay: Found', allSelects.length, 'native select dropdowns');

      let stateSelected = false;

      // If no native selects, look for custom dropdown
      if (allSelects.length === 0) {
        console.log('[Zarif] Google Pay: No native selects, looking for custom dropdown...');

        // Find the State dropdown by looking for elements with "State" text
        const allElements = document.querySelectorAll('div, span, label');

        for (const el of allElements) {
          const text = el.textContent.trim();

          // Find element that says exactly "State" or contains Indian state names
          if (text === 'State' || text === 'Uttarakhand' || text === 'Maharashtra' ||
            text === 'Delhi' || text === 'Karnataka' || text === 'Tamil Nadu' ||
            text === 'Uttar Pradesh' || text === 'West Bengal' || text === 'Gujarat') {

            // Find the clickable parent dropdown container
            const clickableParent = el.closest('[role="listbox"], [role="button"], [role="combobox"], [tabindex], [aria-haspopup]') ||
              el.parentElement?.closest('[role="listbox"], [role="button"], [role="combobox"], [tabindex], [aria-haspopup]');

            if (clickableParent) {
              console.log('[Zarif] Google Pay: Found custom state dropdown, clicking to open...');
              console.log('[Zarif] Current value:', el.textContent.trim());

              // Click to open the dropdown
              clickableParent.click();
              await sleep(500);

              // Now look for the option list that appeared
              const optionElements = document.querySelectorAll('[role="option"], [role="menuitem"], [data-value], li');
              console.log('[Zarif] Google Pay: Found', optionElements.length, 'potential options');

              for (const option of optionElements) {
                const optionText = option.textContent.trim();
                if (optionText.toLowerCase() === targetState.toLowerCase()) {
                  console.log('[Zarif] Google Pay: Found target state option, clicking:', optionText);
                  option.click();
                  stateSelected = true;
                  await sleep(300);
                  break;
                }
              }

              if (stateSelected) break;
            }
          }
        }

        // Alternative: Look for aria-label or data attributes
        if (!stateSelected) {
          console.log('[Zarif] Google Pay: Trying alternative method to find state dropdown...');

          // Look for any dropdown that might contain state names
          const dropdownTriggers = document.querySelectorAll('[aria-expanded], [aria-haspopup="listbox"], [role="combobox"]');
          console.log('[Zarif] Google Pay: Found', dropdownTriggers.length, 'dropdown triggers');

          for (const trigger of dropdownTriggers) {
            const displayedText = trigger.textContent.trim();
            // Check if this dropdown currently shows a state name (meaning it's the state dropdown)
            const indianStates = ['maharashtra', 'karnataka', 'delhi', 'tamil nadu', 'west bengal',
              'uttarakhand', 'rajasthan', 'uttar pradesh', 'gujarat', 'kerala',
              'andhra pradesh', 'telangana', 'madhya pradesh', 'punjab', 'haryana'];

            if (indianStates.some(state => displayedText.toLowerCase().includes(state))) {
              console.log('[Zarif] Google Pay: Found state dropdown showing:', displayedText);

              // Click to open
              trigger.click();
              await sleep(500);

              // Find and click the target option
              const allOptions = document.querySelectorAll('[role="option"], [data-value], .option, li');
              for (const opt of allOptions) {
                if (opt.textContent.trim().toLowerCase() === targetState.toLowerCase()) {
                  console.log('[Zarif] Google Pay: Clicking state option:', opt.textContent.trim());
                  opt.click();
                  stateSelected = true;
                  await sleep(300);
                  break;
                }
              }

              if (stateSelected) break;
            }
          }
        }
      } else {
        // Native select found
        for (const dropdown of allSelects) {
          const options = dropdown.querySelectorAll('option');
          const indianStates = ['maharashtra', 'karnataka', 'delhi', 'tamil nadu', 'west bengal',
            'uttarakhand', 'rajasthan', 'uttar pradesh', 'gujarat', 'kerala'];

          let isStateDropdown = false;
          for (const opt of options) {
            if (indianStates.some(state => opt.textContent.toLowerCase().includes(state))) {
              isStateDropdown = true;
              break;
            }
          }

          if (isStateDropdown) {
            for (const opt of options) {
              if (opt.textContent.trim().toLowerCase() === targetState.toLowerCase()) {
                dropdown.value = opt.value;
                dropdown.dispatchEvent(new Event('change', { bubbles: true }));
                stateSelected = true;
                console.log('✅ Google Pay: Native select state changed to:', targetState);
                break;
              }
            }
          }
        }
      }

      if (stateSelected) {
        console.log('✅ Google Pay: State selection SUCCESSFUL');
      } else {
        console.log('[Zarif] Google Pay: WARNING - Could not change state. Manual selection required.');
      }

      console.log('✅ Google Pay: Address filling completed');
    }

    showNotification('✅ All details filled successfully!', 'success');

  } catch (error) {
    showNotification('❌ Error: ' + error.message, 'error');
    console.error('Fill error:', error);
  }

  isProcessing = false;
}

async function fillCardFormWithPrecard(card, randomData) {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  try {
    const defaultData = {
      name: 'Minho Kim',
      address: '123 Gangnam-daero',
      address2: '',
      city: 'Seoul',
      zip: '06130',
      state: 'Gangnam-gu',
      country: 'KR'
    };

    const data = randomData || defaultData;
    const selectedCountry = data.country || 'KR';

    showNotification('🔄 Auto-filling with pre-card details...', 'info');

    await sleep(500);

    // Helper function to simulate typing
    const simulateTyping = async (element, value) => {
      element.focus();
      element.value = '';
      for (const char of value) {
        element.value += char;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(50);
      }
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    // Helper to find input by multiple methods
    const findInput = (selectors) => {
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el;
      }
      return null;
    };

    // Find card number input
    const cardNumberSelectors = [
      'input[placeholder*="1234"]',
      'input[placeholder*="Card number"]',
      'input[name*="cardNumber"]',
      'input[autocomplete="cc-number"]',
      'input[aria-label*="Card number"]'
    ];

    const cardNumberInput = findInput(cardNumberSelectors);
    if (cardNumberInput) {
      await simulateTyping(cardNumberInput, card.card_number);
      await sleep(300);
    }

    // Find expiry input
    const expirySelectors = [
      'input[placeholder*="MM"]',
      'input[placeholder*="Expir"]',
      'input[autocomplete="cc-exp"]',
      'input[aria-label*="Expir"]'
    ];

    const expiryInput = findInput(expirySelectors);
    if (expiryInput) {
      const expiryStr = `${card.expiry_month}/${card.expiry_year.slice(-2)}`;
      await simulateTyping(expiryInput, expiryStr);
      await sleep(300);
    }

    // Find CVC input
    const cvcSelectors = [
      'input[placeholder*="CVC"]',
      'input[placeholder*="CVV"]',
      'input[autocomplete="cc-csc"]',
      'input[aria-label*="CVC"]'
    ];

    const cvcInput = findInput(cvcSelectors);
    if (cvcInput) {
      await simulateTyping(cvcInput, card.cvv);
      await sleep(300);
    }

    // Find name input
    const nameSelectors = [
      'input[placeholder*="Full name"]',
      'input[placeholder*="Name on card"]',
      'input[autocomplete="cc-name"]'
    ];

    const nameInput = findInput(nameSelectors);
    if (nameInput) {
      await simulateTyping(nameInput, data.name);
      await sleep(300);
    }

    // Handle country select - dynamic based on selected country
    const countrySelect = document.querySelector('select');
    if (countrySelect) {
      const options = countrySelect.querySelectorAll('option');
      console.log('[Zarif Precard] Setting country to:', selectedCountry);

      let countryFound = false;
      for (const opt of options) {
        const optValue = opt.value.toUpperCase();
        const optText = opt.textContent.trim().toLowerCase();

        if (selectedCountry === 'IN' && (optValue === 'IN' || optText === 'india')) {
          countrySelect.value = opt.value;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          countryFound = true;
          console.log('✅ Precard: Selected India');
          break;
        } else if (selectedCountry === 'GB' && (optValue === 'GB' || optValue === 'UK' || optText.includes('kingdom') || optText.includes('britain'))) {
          countrySelect.value = opt.value;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          countryFound = true;
          console.log('✅ Precard: Selected United Kingdom');
          break;
        } else if (selectedCountry === 'US' && (optValue === 'US' || optValue === 'USA' || optText.includes('united states') || optText.includes('america'))) {
          countrySelect.value = opt.value;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          countryFound = true;
          console.log('✅ Precard: Selected United States');
          break;
        } else if (selectedCountry === 'KR' && (optValue === 'KR' || optText.includes('korea'))) {
          countrySelect.value = opt.value;
          countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
          countryFound = true;
          console.log('✅ Precard: Selected South Korea');
          break;
        }
      }

      if (!countryFound) {
        // Fallback to value match
        for (const opt of options) {
          if (opt.value === selectedCountry || opt.value.toUpperCase() === selectedCountry) {
            countrySelect.value = opt.value;
            countrySelect.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('✅ Precard: Selected country by fallback:', selectedCountry);
            break;
          }
        }
      }
      await sleep(500);
    }

    // Handle state/province SELECT dropdown - dynamic based on country
    await sleep(300);
    const allSelects = document.querySelectorAll('select');
    const targetState = data.state;

    for (const select of allSelects) {
      if (select === countrySelect) continue;

      const options = select.querySelectorAll('option');

      // Try to find matching state by name
      let stateFound = false;
      for (const opt of options) {
        const optText = opt.textContent.trim().toLowerCase();
        const optValue = opt.value.toLowerCase();
        const targetLower = targetState.toLowerCase();

        if (optText.includes(targetLower) || optValue.includes(targetLower)) {
          console.log('✅ Precard: Found and selecting state:', targetState);
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          stateFound = true;
          break;
        }
      }

      // Country-specific fallbacks
      if (!stateFound) {
        if (selectedCountry === 'KR') {
          for (const opt of options) {
            if (opt.textContent.includes('Seoul') || opt.value.includes('Seoul') || opt.textContent.includes('서울')) {
              console.log('✅ Precard: Found and selecting Seoul (fallback)');
              select.value = opt.value;
              select.dispatchEvent(new Event('change', { bubbles: true }));
              break;
            }
          }
        } else if (selectedCountry === 'GB') {
          for (const opt of options) {
            if (opt.textContent.toLowerCase().includes('london')) {
              console.log('✅ Precard: Found and selecting London (fallback)');
              select.value = opt.value;
              select.dispatchEvent(new Event('change', { bubbles: true }));
              break;
            }
          }
        } else if (selectedCountry === 'US') {
          for (const opt of options) {
            if (opt.textContent.includes('New York') || opt.value === 'NY') {
              console.log('✅ Precard: Found and selecting New York (fallback)');
              select.value = opt.value;
              select.dispatchEvent(new Event('change', { bubbles: true }));
              break;
            }
          }
        }
      }
    }

    // Fill billing address fields
    await sleep(300);

    const allInputs = document.querySelectorAll('input');
    for (const input of allInputs) {
      const placeholder = (input.getAttribute('placeholder') || '').toLowerCase();
      const name = (input.getAttribute('name') || '').toLowerCase();
      const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
      const combined = placeholder + name + ariaLabel;

      if ((combined.includes('address') && !combined.includes('line 2') && !combined.includes('email')) ||
        combined.includes('street')) {
        await simulateTyping(input, data.address);
      } else if (combined.includes('city') || combined.includes('town')) {
        await simulateTyping(input, data.city);
      } else if (combined.includes('zip') || combined.includes('postal')) {
        await simulateTyping(input, data.zip);
      } else if (combined.includes('district') || combined.includes('state') || combined.includes('province')) {
        await simulateTyping(input, data.state);
      }
    }

    showNotification('✅ Pre-card details filled successfully!', 'success');

  } catch (error) {
    showNotification('❌ Error: ' + error.message, 'error');
    console.error('Fill error:', error);
  }

  isProcessing = false;
}

function showNotification(message, type = 'info') {
  const existing = document.getElementById('auto-card-filler-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.id = 'auto-card-filler-notification';
  notification.textContent = message;

  const colors = {
    info: '#3498db',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c'
  };

  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: colors[type] || colors.info,
    color: 'white',
    padding: '15px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: '999999',
    fontSize: '14px',
    fontWeight: '600',
    maxWidth: '300px',
    animation: 'slideIn 0.3s ease-out'
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transition = 'all 0.3s ease-out';
    notification.style.transform = 'translateX(400px)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillCardForm();
    sendResponse({ success: true });
  } else if (request.action === 'fillFormWithPrecard') {
    fillCardFormWithPrecard(request.card, request.randomData);
    sendResponse({ success: true });
  } else if (request.action === 'fillStripeInput') {
    // Handle filling input inside Stripe iframe
    fillStripeIframeInput(request.fieldType, request.value);
    sendResponse({ success: true });
  } else if (request.action === 'start_live_cc_check') {
    // Handle Live CC Check on teamcsb.com
    handleLiveCCCheck(request.cardLines);
    sendResponse({ received: true });
  } else if (request.action === 'automateOpenAI') {
    // Handle OpenAI account creation automation
    console.log('[OpenAI Automation] Received automation request');
    automateOpenAISignup(request.credentials);
    sendResponse({ success: true });
  } else if (request.action === 'enterVerificationCode') {
    // Enter verification code on OpenAI
    console.log('[OpenAI Automation] Entering verification code:', request.code);
    enterVerificationCode(request.code);
    sendResponse({ success: true });
  }
  return true;
});

// ========== OpenAI Account Creation Automation ==========
let openaiCredentials = null;

async function automateOpenAISignup(credentials) {
  openaiCredentials = credentials;
  // Store credentials for use across page navigations
  chrome.storage.local.set({ openaiPendingCredentials: credentials });

  console.log('[OpenAI Automation] Starting signup with email:', credentials.email);
  showNotification('🤖 Starting OpenAI account creation...', 'info');

  // Detect which page we're on and act accordingly
  if (window.location.hostname === 'chatgpt.com' || window.location.hostname === 'chat.openai.com') {
    await handleChatGPTPage(credentials);
  } else if (window.location.hostname === 'auth.openai.com') {
    await handleAuthPage(credentials);
  }
}

async function handleChatGPTPage(credentials) {
  console.log('[OpenAI Automation] On ChatGPT page, looking for signup modal...');

  // Wait a bit for page to load
  await sleep(1000);

  // Look for "Create account" or "Sign up" button
  const createAccountBtn = await findButtonByText(['Create account', 'Sign up', 'Create free account'], 5000);

  if (createAccountBtn) {
    console.log('[OpenAI Automation] Found Create Account button, clicking...');
    showNotification('📝 Clicking Create Account...', 'info');
    createAccountBtn.click();
    await sleep(1500);
  }

  // Look for email input
  const emailInput = await waitForElement('input[type="email"], input[name="email"], input[placeholder*="Email"]', 5000).catch(() => null);

  if (emailInput) {
    console.log('[OpenAI Automation] Found email input, entering email...');
    showNotification('📧 Entering email...', 'info');
    await typeWithEvents(emailInput, credentials.email);
    await sleep(500);

    // Click continue/submit button
    const continueBtn = findContinueButton(emailInput.closest('form') || document);
    if (continueBtn) {
      console.log('[OpenAI Automation] Clicking continue button...');
      continueBtn.click();
      showNotification('⏳ Proceeding to password page...', 'info');
    }
  }
}

async function handleAuthPage(credentials) {
  const currentPath = window.location.pathname;
  console.log('[OpenAI Automation] On auth page:', currentPath);

  if (currentPath.includes('/authorize')) {
    // Initial signup page - enter email
    const emailInput = await waitForElement('input[type="email"], input[name="email"], input[id*="email"]', 5000).catch(() => null);
    if (emailInput && !emailInput.value) {
      console.log('[OpenAI Automation] Entering email on authorize page...');
      await typeWithEvents(emailInput, credentials.email);
      await sleep(500);
      const continueBtn = findContinueButton(document);
      if (continueBtn) continueBtn.click();
    }
  } else if (currentPath.includes('/create-account/password') || currentPath.includes('/password')) {
    // Password page
    await fillPasswordPageWithCreds(credentials.password);
  } else if (currentPath.includes('/about-you') || currentPath.includes('/onboarding')) {
    // Profile page
    await fillAboutYouPageWithCreds(credentials.fullName, credentials.birthday);
  } else if (currentPath.includes('/verify') || currentPath.includes('/verification')) {
    showNotification('📩 Check extension for verification code!', 'info');
  }
}

async function fillPasswordPageWithCreds(password) {
  const passwordInput = document.querySelector('input[type="password"], input[name="password"]');
  if (!passwordInput) {
    console.log('[OpenAI Automation] Password input not found');
    return;
  }

  console.log('[OpenAI Automation] Entering password...');
  showNotification('🔑 Entering password...', 'info');
  await typeWithEvents(passwordInput, password);
  await sleep(500);

  const continueBtn = findContinueButton(passwordInput.closest('form') || document);
  if (continueBtn) {
    console.log('[OpenAI Automation] Clicking continue on password page...');
    continueBtn.click();
  }
}

async function fillAboutYouPageWithCreds(fullName, birthday) {
  console.log('[OpenAI Automation] Filling about-you page...');
  showNotification('👤 Filling profile info...', 'info');

  await sleep(2000); // Wait for page to fully load

  // Find name input (first text input, or input without birthday-related attributes)
  const nameInput = document.querySelector('input[type="text"]:not([name="birthday"]):not([id="birthday"]):not([placeholder*="MM"])');

  if (nameInput) {
    const nameToFill = fullName || 'Alex Davis';
    console.log('[OpenAI Automation] Filling name input with:', nameToFill);
    nameInput.focus();
    await sleep(100);
    nameInput.value = '';
    await typeWithEvents(nameInput, nameToFill);
    await sleep(500);
  } else {
    console.log('[OpenAI Automation] No name input found!');
  }

  // Wait for birthday input to appear
  await sleep(1000);

  // DEBUG: Log ALL inputs on the page
  const aboutYouForm = document.querySelector('[data-testid="about-you-form"]') || document.querySelector('form') || document;
  console.log('[OpenAI Automation] Form found:', aboutYouForm?.tagName);

  const allFormInputs = Array.from(aboutYouForm.querySelectorAll('input'));
  console.log('[OpenAI Automation] All form inputs:', allFormInputs.length);

  // Log each input as STRING values (not object)
  allFormInputs.forEach((inp, i) => {
    console.log(`[OpenAI Automation] FormInput ${i}: id="${inp.id}" name="${inp.name}" placeholder="${inp.placeholder}" type="${inp.type}" autocomplete="${inp.autocomplete}"`);
  });

  // Find birthday input - try ALL inputs in form
  let birthdayInput = null;

  for (const inp of allFormInputs) {
    // Skip hidden inputs
    if (inp.type === 'hidden') continue;

    // Check if this could be the birthday input
    const isNameInput = inp.name === 'name' || inp.name === 'fullName' || inp.autocomplete === 'name';
    const isBirthdayInput = inp.name === 'birthdate' ||
      inp.name === 'birthday' ||
      inp.autocomplete === 'bday' ||
      inp.placeholder?.includes('MM') ||
      inp.placeholder?.includes('DD') ||
      inp.id?.toLowerCase().includes('birthday') ||
      inp.id?.toLowerCase().includes('birthdate');

    console.log(`[OpenAI Automation] Checking input: name="${inp.name}" isNameInput=${isNameInput} isBirthdayInput=${isBirthdayInput}`);

    if (isBirthdayInput && inp.type !== 'hidden') {
      birthdayInput = inp;
      console.log('[OpenAI Automation] Found birthday input by attributes!');
      break;
    }
  }

  const bday = birthday || {
    month: String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'),
    day: String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
    year: String(1970 + Math.floor(Math.random() * 30))
  };

  const dateNumbers = `${bday.month}${bday.day}${bday.year}`;
  const dateFormatted = `${bday.month}/${bday.day}/${bday.year}`;
  console.log('[OpenAI Automation] Birthday to fill:', dateNumbers, 'or', dateFormatted);

  // FIRST: Blur the name input so we don't type into it again
  if (document.activeElement) {
    document.activeElement.blur();
  }
  await sleep(200);

  // Strategy 1: Look for separate month, day, year fields (Grok's approach)
  const monthSelect = document.querySelector('select[name="month"]') || document.querySelector('[name="month"]');
  const dayInputSep = document.querySelector('input[name="day"]') || document.querySelector('[name="day"]');
  const yearInputSep = document.querySelector('input[name="year"]') || document.querySelector('[name="year"]');

  console.log('[OpenAI Automation] Separate fields found:', !!monthSelect, !!dayInputSep, !!yearInputSep);

  if (monthSelect && dayInputSep && yearInputSep) {
    console.log('[OpenAI Automation] Using separate month/day/year fields');

    // Fill month (select dropdown or input)
    if (monthSelect.tagName === 'SELECT') {
      monthSelect.value = parseInt(bday.month).toString();
      monthSelect.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      await typeWithEvents(monthSelect, bday.month);
    }
    await sleep(100);

    // Fill day
    dayInputSep.focus();
    await typeWithEvents(dayInputSep, bday.day);
    await sleep(100);

    // Fill year  
    yearInputSep.focus();
    await typeWithEvents(yearInputSep, bday.year);

    console.log('[OpenAI Automation] Filled separate month/day/year fields');
    await sleep(300);
  } else {
    // OpenAI uses a custom SEGMENTED date picker with visible span elements
    // The hidden input[name="birthday"] stores the value, but the UI shows clickable segments
    console.log('[OpenAI Automation] Looking for OpenAI segmented date picker...');

    // Find the date picker container - look for element containing "MM" text or birthday-related classes
    let datePickerContainer = null;

    // Strategy: Find elements that contain text "MM" and are near the birthday label
    const allElements = document.querySelectorAll('div, span, label');
    for (const el of allElements) {
      const text = el.textContent?.trim();
      // Look for the container that has "MM/DD/YYYY" pattern
      if (text && (text === 'MM/DD/YYYY' || text.match(/^MM\s*\/\s*DD\s*\/\s*YYYY$/))) {
        datePickerContainer = el;
        console.log('[OpenAI Automation] Found date picker container by text:', text);
        break;
      }
    }

    // Alternative: Find by looking for spans with contenteditable or specific classes
    if (!datePickerContainer) {
      // Look for the Birthday label and find the input area next to it
      const birthdayLabel = Array.from(document.querySelectorAll('label, div, span')).find(el =>
        el.textContent?.trim().toLowerCase() === 'birthday'
      );
      if (birthdayLabel) {
        // The date picker should be a sibling or nearby element
        datePickerContainer = birthdayLabel.parentElement?.querySelector('[class*="date"], [class*="input"], [role="textbox"]');
        if (!datePickerContainer) {
          // Try next sibling elements
          let sibling = birthdayLabel.nextElementSibling;
          while (sibling && !datePickerContainer) {
            if (sibling.textContent?.includes('MM') || sibling.querySelector('[contenteditable]')) {
              datePickerContainer = sibling;
            }
            sibling = sibling.nextElementSibling;
          }
        }
        console.log('[OpenAI Automation] Found date picker near birthday label:', !!datePickerContainer);
      }
    }

    // Find the clickable/editable segments within the container or page
    // OpenAI date picker likely uses spans with specific attributes
    const findDateSegments = () => {
      // Look for contenteditable elements or input-like spans
      const editableSpans = document.querySelectorAll('[contenteditable="true"], [role="spinbutton"], [role="textbox"]');
      if (editableSpans.length >= 3) {
        console.log('[OpenAI Automation] Found editable spans:', editableSpans.length);
        return Array.from(editableSpans).slice(0, 3); // month, day, year
      }

      // Look for spans containing MM, DD, YYYY that might be clickable
      const segments = [];
      const spans = document.querySelectorAll('span, div');
      for (const span of spans) {
        const text = span.textContent?.trim();
        const rect = span.getBoundingClientRect();
        // Only consider visible, small elements (segments are usually small)
        if (rect.width > 0 && rect.width < 100 && rect.height > 0 && rect.height < 50) {
          if (text === 'MM' || text === 'DD' || text === 'YYYY' || /^\d{1,4}$/.test(text)) {
            // Check if this element is interactive (has click handlers or is focusable)
            const style = window.getComputedStyle(span);
            if (style.cursor === 'text' || style.cursor === 'pointer' || span.tabIndex >= 0) {
              segments.push({ element: span, text });
            }
          }
        }
      }

      if (segments.length >= 3) {
        console.log('[OpenAI Automation] Found date segments by text:', segments.map(s => s.text));
        return segments.map(s => s.element);
      }

      return null;
    };

    const segments = findDateSegments();

    if (segments && segments.length >= 3) {
      console.log('[OpenAI Automation] Filling 3 date segments individually');

      // For spinbutton elements, we need to set textContent and trigger proper events
      const typeIntoSpinbutton = async (segment, value) => {
        // Click on the segment to focus it
        segment.click();
        await sleep(100);

        // For spinbutton role, directly set the text content
        // First, select all/clear existing content by simulating keystrokes
        segment.focus?.();
        await sleep(50);

        // Clear existing content - set to empty first
        const originalText = segment.textContent;
        console.log('[OpenAI Automation] Segment original text:', originalText, '-> setting to:', value);

        // Set textContent directly for spinbutton elements
        segment.textContent = value;

        // Trigger all necessary events for React to pick up the change
        segment.dispatchEvent(new Event('input', { bubbles: true }));
        segment.dispatchEvent(new Event('change', { bubbles: true }));

        // Also try beforeinput event which React sometimes listens to
        try {
          segment.dispatchEvent(new InputEvent('beforeinput', {
            data: value,
            inputType: 'insertText',
            bubbles: true,
            cancelable: true
          }));
        } catch (e) { }

        segment.dispatchEvent(new InputEvent('input', {
          data: value,
          inputType: 'insertText',
          bubbles: true
        }));

        // Blur to finalize
        segment.dispatchEvent(new Event('blur', { bubbles: true }));
        await sleep(50);
      };

      // Fill month
      console.log('[OpenAI Automation] Clicking and typing month:', bday.month);
      await typeIntoSpinbutton(segments[0], bday.month);
      await sleep(200);

      // Fill day
      console.log('[OpenAI Automation] Clicking and typing day:', bday.day);
      await typeIntoSpinbutton(segments[1], bday.day);
      await sleep(200);

      // Fill year
      console.log('[OpenAI Automation] Clicking and typing year:', bday.year);
      await typeIntoSpinbutton(segments[2], bday.year);
      await sleep(200);

      // IMPORTANT: Also update the hidden birthday input directly
      // This is what the form actually submits
      const hiddenBirthdayInput = document.querySelector('input[name="birthday"]');
      if (hiddenBirthdayInput) {
        const formattedDate = `${bday.year}-${bday.month}-${bday.day}`; // ISO format YYYY-MM-DD
        console.log('[OpenAI Automation] Setting hidden birthday input to:', formattedDate);

        // Use native setter to bypass React's control
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(hiddenBirthdayInput, formattedDate);

        // Dispatch events
        hiddenBirthdayInput.dispatchEvent(new Event('input', { bubbles: true }));
        hiddenBirthdayInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      console.log('[OpenAI Automation] Filled all 3 date segments');
    } else {
      // Fallback: Try to find any input-like element in the date area and use keyboard navigation
      console.log('[OpenAI Automation] Trying fallback: click date area and type with Tab navigation');

      // Find the date area wrapper (usually a div with border that looks like an input)
      const dateWrapper = document.querySelector('[class*="birthday"], [class*="date-input"], [class*="DateInput"]') ||
        (datePickerContainer || aboutYouForm.querySelector('div[class*="border"]'));

      if (dateWrapper) {
        console.log('[OpenAI Automation] Found date wrapper, clicking and typing with Tab...');

        // Click to focus the first segment
        dateWrapper.click();
        await sleep(200);

        // Type month
        for (const char of bday.month) {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: char, code: `Digit${char}`, bubbles: true }));
          document.dispatchEvent(new KeyboardEvent('keypress', { key: char, code: `Digit${char}`, bubbles: true }));
          await sleep(50);
        }
        await sleep(100);

        // Tab to day
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
        await sleep(150);

        // Type day
        for (const char of bday.day) {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: char, code: `Digit${char}`, bubbles: true }));
          document.dispatchEvent(new KeyboardEvent('keypress', { key: char, code: `Digit${char}`, bubbles: true }));
          await sleep(50);
        }
        await sleep(100);

        // Tab to year
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
        await sleep(150);

        // Type year
        for (const char of bday.year) {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: char, code: `Digit${char}`, bubbles: true }));
          document.dispatchEvent(new KeyboardEvent('keypress', { key: char, code: `Digit${char}`, bubbles: true }));
          await sleep(50);
        }

        console.log('[OpenAI Automation] Typed date using keyboard fallback');
      } else {
        console.log('[OpenAI Automation] Could not find date picker elements');
      }
    }

    await sleep(300);
  }

  // Loop to check for "Continue" button being enabled/clickable
  // We will try up to 600 times (roughly 60-120 seconds depending on loop speed)
  for (let i = 0; i < 600; i++) {
    // 1. Check for "I agree to all" checkbox (South Korea / specific regions)
    // The label text is usually "I agree to all of the following" or similar
    const labels = Array.from(document.querySelectorAll('label'));
    const agreeAllLabel = labels.find(l =>
      l.textContent.toLowerCase().includes('agree to all') ||
      l.textContent.includes('모두 동의') // Korean fallback just in case
    );

    if (agreeAllLabel) {
      // Find the checkbox associated with this label
      const checkboxId = agreeAllLabel.getAttribute('for');
      const checkbox = checkboxId ? document.getElementById(checkboxId) : agreeAllLabel.querySelector('input[type="checkbox"]');

      if (checkbox && !checkbox.checked) {
        console.log('[OpenAI Automation] Found "Agree to all" checkbox. Clicking it...');
        checkbox.click();
        await sleep(200);
      }
    }

    const continueBtn = findContinueButton(document);
    if (continueBtn && !continueBtn.disabled) {
      console.log('[OpenAI Automation] Continue button found and enabled. Clicking...');
      continueBtn.click();

      // Check if we navigated away or button disappeared
      await sleep(500);
      const btnAfter = findContinueButton(document);
      if (!btnAfter) {
        console.log('[OpenAI Automation] Successfully clicked Continue!');
        break;
      }
    }
    await sleep(200);
  }

}

async function fillBirthdayWithValues(birthday) {
  console.log('[OpenAI Automation] Filling birthday:', birthday);

  // Try select dropdowns first
  const monthSelect = document.querySelector('select[name*="month" i], select[id*="month" i], select[aria-label*="Month" i]');
  const daySelect = document.querySelector('select[name*="day" i], select[id*="day" i], select[aria-label*="Day" i]');
  const yearSelect = document.querySelector('select[name*="year" i], select[id*="year" i], select[aria-label*="Year" i]');

  if (monthSelect && daySelect && yearSelect) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNum = parseInt(birthday.month);
    const monthName = monthNames[monthNum - 1] || monthNames[0];

    setSelectValue(monthSelect, [monthNum, birthday.month, monthName, monthName.slice(0, 3)]);
    setSelectValue(daySelect, [parseInt(birthday.day), birthday.day]);
    setSelectValue(yearSelect, [birthday.year]);
    console.log('[OpenAI Automation] Filled birthday via dropdowns');
    return true;
  }

  // Try input fields with MM/DD/YYYY format
  const birthdayInput = document.querySelector('input[name*="birth" i], input[placeholder*="birth" i], input[placeholder*="MM/DD" i], input[type="date"], input[placeholder*="Birthday" i]');
  if (birthdayInput) {
    const dateStr = `${birthday.month}/${birthday.day}/${birthday.year}`;
    console.log('[OpenAI Automation] Found birthday input, entering:', dateStr);
    birthdayInput.focus();
    await sleep(100);

    // Clear existing value
    birthdayInput.value = '';
    birthdayInput.dispatchEvent(new Event('input', { bubbles: true }));

    await typeWithEvents(birthdayInput, dateStr);
    await sleep(300);
    return true;
  }

  // Try separate MM, DD, YYYY inputs
  const monthInput = document.querySelector('input[placeholder="MM"], input[aria-label*="Month" i], input[name*="month" i]');
  const dayInput = document.querySelector('input[placeholder="DD"], input[aria-label*="Day" i], input[name*="day" i]');
  const yearInput = document.querySelector('input[placeholder="YYYY"], input[aria-label*="Year" i], input[name*="year" i]');

  if (monthInput && dayInput && yearInput) {
    console.log('[OpenAI Automation] Found separate date inputs');
    await typeWithEvents(monthInput, birthday.month);
    await typeWithEvents(dayInput, birthday.day);
    await typeWithEvents(yearInput, birthday.year);
    return true;
  }

  console.log('[OpenAI Automation] No birthday field found');
  return false;
}

async function enterVerificationCode(code) {
  console.log('[OpenAI Automation] Entering verification code:', code);
  showNotification('🔢 Entering verification code...', 'info');

  // Look for 6 individual digit inputs or a single input
  const digitInputs = document.querySelectorAll('input[maxlength="1"], input[type="tel"][maxlength="1"]');

  if (digitInputs.length >= 6) {
    // Individual digit inputs
    for (let i = 0; i < 6 && i < digitInputs.length; i++) {
      digitInputs[i].value = code[i];
      digitInputs[i].dispatchEvent(new Event('input', { bubbles: true }));
      digitInputs[i].dispatchEvent(new Event('change', { bubbles: true }));
      await sleep(100);
    }
    showNotification('✅ Verification code entered!', 'success');
    return;
  }

  // Single input for all digits - try multiple selectors for auth.openai.com
  let codeInput = null;

  // Try specific selectors for the verification page
  const selectors = [
    'input[autocomplete="one-time-code"]',
    'input[name="code"]',
    'input[id*="code"]',
    'input[placeholder*="Code"]',
    'input[placeholder*="code"]',
    'input[type="text"]',
    'input[type="tel"]',
    'input[inputmode="numeric"]'
  ];

  for (const selector of selectors) {
    codeInput = document.querySelector(selector);
    if (codeInput && codeInput.offsetParent !== null) {  // Check if visible
      console.log('[OpenAI Automation] Found code input with selector:', selector);
      break;
    }
  }

  if (codeInput) {
    // Focus the input first
    codeInput.focus();
    await sleep(100);

    // Clear existing value
    codeInput.value = '';
    codeInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Type the code character by character with events
    for (const char of code) {
      codeInput.value += char;
      codeInput.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(50);
    }
    codeInput.dispatchEvent(new Event('change', { bubbles: true }));
    codeInput.dispatchEvent(new Event('blur', { bubbles: true }));

    await sleep(500);
    console.log('[OpenAI Automation] Code entered:', codeInput.value);

    // Auto-click Continue/Verify button
    console.log('[OpenAI Automation] Looking for Continue button...');
    const form = codeInput.closest('form');
    let continueBtn = null;

    if (form) {
      continueBtn = form.querySelector('button[type="submit"], button:not([type="button"])');
    }

    if (!continueBtn) {
      // Fallback: search globally for relevant buttons
      const buttons = Array.from(document.querySelectorAll('button'));
      continueBtn = buttons.find(btn => {
        const text = (btn.textContent || '').trim().toLowerCase();
        return (text === 'continue' || text === 'verify' || text === 'submit') && !btn.disabled && btn.offsetParent !== null;
      });
    }

    if (continueBtn) {
      console.log('[OpenAI Automation] Found Continue button, clicking...');
      continueBtn.click();
    } else {
      console.log('[OpenAI Automation] Could not find Continue button');
    }

    showNotification('✅ Verification code entered!', 'success');
  } else {
    console.log('[OpenAI Automation] Could not find code input field');
    showNotification('❌ Could not find code input', 'error');
  }
}

async function findButtonByText(texts, timeout = 5000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const buttons = document.querySelectorAll('button, a[role="button"], [role="button"]');
    for (const btn of buttons) {
      const btnText = (btn.textContent || btn.innerText || '').toLowerCase().trim();
      for (const text of texts) {
        if (btnText.includes(text.toLowerCase())) {
          return btn;
        }
      }
    }
    await sleep(300);
  }
  return null;
}

// Auto-detect OpenAI pages and load stored credentials
if (window.location.hostname === 'chatgpt.com' ||
  window.location.hostname === 'chat.openai.com' ||
  window.location.hostname === 'auth.openai.com') {

  // Load any pending credentials and auto-fill
  chrome.storage.local.get(['openaiPendingCredentials'], (result) => {
    if (result.openaiPendingCredentials) {
      const data = result.openaiPendingCredentials;

      // Check if credentials are fresh (less than 5 minutes old)
      // If timestamp is missing (legacy) or old, ignore and clear
      const isFresh = data.timestamp && (Date.now() - data.timestamp < 5 * 60 * 1000);

      if (!isFresh) {
        console.log('[OpenAI Automation] Found stale/invalid pending credentials, clearing...');
        chrome.storage.local.remove(['openaiPendingCredentials']);
        return;
      }

      openaiCredentials = data;
      console.log('[OpenAI Automation] Loaded pending credentials for:', openaiCredentials.email);

      // Wait for page to load then continue automation
      setTimeout(() => {
        if (window.location.hostname === 'auth.openai.com') {
          const currentPath = window.location.pathname;

          // If on verification page, auto-fetch the code
          if (currentPath.includes('/email-verification') || currentPath.includes('/verify')) {
            console.log('[OpenAI Automation] On verification page, auto-fetching code...');
            showNotification('📨 Auto-fetching verification code...', 'info');
            autoFetchVerificationCode();
          } else {
            handleAuthPage(openaiCredentials);
          }
        } else if (window.location.hostname === 'chatgpt.com' || window.location.hostname === 'chat.openai.com') {
          // Handle ChatGPT page - click "Create account" on Welcome back screen
          console.log('[OpenAI Automation] On ChatGPT page, triggering handleChatGPTPage...');
          handleChatGPTPage(openaiCredentials);
        }
      }, 2000);

      // MONITOR PATH CHANGES for SPA navigation (e.g., to /about-you)
      if (window.location.hostname === 'auth.openai.com') {
        let lastPath = window.location.pathname;
        let pathCheckInterval = setInterval(() => {
          const currentPath = window.location.pathname;
          if (currentPath !== lastPath) {
            console.log('[OpenAI Automation] Path changed from', lastPath, 'to', currentPath);
            lastPath = currentPath;

            // Re-trigger handleAuthPage with stored credentials
            setTimeout(() => {
              if (openaiCredentials) {
                console.log('[OpenAI Automation] Re-triggering for new path:', currentPath);
                handleAuthPage(openaiCredentials);
              }
            }, 1500);
          }
        }, 500);
      }
    }
  });
}

// ========== Auto-Skip ChatGPT Onboarding Popups ==========
// Automatically clicks "Skip" on post-signup onboarding dialogs
if (window.location.hostname === 'chatgpt.com' || window.location.hostname === 'chat.openai.com') {
  console.log('[Zarif] ChatGPT page detected - watching for onboarding popups to skip...');

  const skipOnboardingPopups = () => {
    // Look for skip/continue buttons on onboarding dialogs
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const btnText = (btn.textContent || btn.innerText || '').trim().toLowerCase();
      // Match "Skip", "Skip Tour", or "Continue" buttons
      if (btnText === 'skip' || btnText === 'skip tour' || btnText === 'continue') {
        console.log('[Zarif] Found "' + btnText + '" button on onboarding popup, clicking...');
        btn.click();
        return true;
      }
    }
    return false;
  };

  // Check periodically for onboarding popups (they may appear after page load)
  // Keep checking for multiple popups since there can be several in a row
  let onboardingCheckCount = 0;
  const maxOnboardingChecks = 60; // Check for 2 minutes (60 * 2s = 120s)

  const onboardingInterval = setInterval(() => {
    onboardingCheckCount++;
    skipOnboardingPopups(); // Keep trying to skip, don't stop after first one

    if (onboardingCheckCount >= maxOnboardingChecks) {
      console.log('[Zarif] Stopped checking for onboarding popups (timeout)');
      clearInterval(onboardingInterval);
    }
  }, 2000);
}

// Auto-fetch verification code from background script
async function autoFetchVerificationCode() {
  // Get the email info from stored credentials
  const stored = await chrome.storage.local.get(['openaiPendingCredentials']);
  if (!stored.openaiPendingCredentials) {
    console.log('[OpenAI Automation] No pending credentials found for auto-fetch');
    return;
  }

  const email = stored.openaiPendingCredentials.email;
  const parts = email.split('@');
  const login = parts[0];
  const domain = parts[1];

  console.log('[OpenAI Automation] Auto-fetching verification code for:', email);
  showNotification('📨 Fetching verification code from inbox...', 'info');

  try {
    // Request code from background script
    const result = await chrome.runtime.sendMessage({
      action: 'checkVerificationCode',
      login: login,
      domain: domain
    });

    if (result && result.success && result.code) {
      console.log('[OpenAI Automation] Got verification code:', result.code);
      showNotification(`✅ Code received: ${result.code}`, 'success');

      // Auto-enter the code
      await enterVerificationCode(result.code);

      // Clear pending credentials after successful verification
      chrome.storage.local.remove(['openaiPendingCredentials']);
    } else {
      console.error('[OpenAI Automation] Failed to get code:', result?.error);
      showNotification('❌ Could not fetch code: ' + (result?.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    console.error('[OpenAI Automation] Auto-fetch error:', error);
    showNotification('❌ Error: ' + error.message, 'error');
  }
}

// Function to fill inputs inside Stripe iframes
async function fillStripeIframeInput(fieldType, value) {
  const simulateTyping = async (element, val) => {
    element.focus();
    element.value = '';
    for (const char of val) {
      element.value += char;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
      await sleep(30);
    }
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  };

  let input = null;

  if (fieldType === 'cardNumber') {
    input = document.querySelector('input[name="cardnumber"], input[autocomplete="cc-number"], input[data-elements-stable-field-name="cardNumber"]');
  } else if (fieldType === 'expiry') {
    input = document.querySelector('input[name="exp-date"], input[autocomplete="cc-exp"], input[data-elements-stable-field-name="cardExpiry"]');
  } else if (fieldType === 'cvc') {
    input = document.querySelector('input[name="cvc"], input[autocomplete="cc-csc"], input[data-elements-stable-field-name="cardCvc"]');
  }

  if (input) {
    await simulateTyping(input, value);
    console.log(`[Zarif Stripe] Filled ${fieldType} in iframe`);
  }
}

// Auto-detect if we're in Stripe iframe and listen for fill commands
if (isStripeIframe) {
  console.log('[Zarif] Running inside Stripe iframe');
}

// ========== K12 Auth.OpenAI.com Page Handlers ==========

// Check if we're on an OpenAI auth page
if (window.location.hostname === 'auth.openai.com') {
  console.log('[Zarif K12] Detected auth.openai.com page');
  let lastAuthPath = window.location.pathname;

  // Wait for page to load then handle
  setTimeout(() => {
    handleOpenAIAuthPage();
  }, 2000);

  setInterval(() => {
    if (window.location.pathname !== lastAuthPath) {
      lastAuthPath = window.location.pathname;
      handleOpenAIAuthPage();
    }
  }, 1000);
}

async function handleOpenAIAuthPage() {
  if (isAuthHandling) return;
  isAuthHandling = true;

  try {
    const currentPath = window.location.pathname;
    console.log('[Zarif K12] Current path:', currentPath);

    const storage = await chrome.storage.local.get(['k12Accounts', 'k12PendingAccount']);
    const accounts = storage.k12Accounts || [];
    const pendingAccount = storage.k12PendingAccount || null;

    if (!pendingAccount && accounts.length === 0) {
      console.log('[Zarif K12] No K12 accounts found');
      return;
    }

    const candidates = [];
    if (pendingAccount) candidates.push(pendingAccount);
    candidates.push(...accounts);

    const emailDisplay = document.querySelector('[class*="email"], .email-address, input[type="email"][readonly], div[class*="Email"]');
    const pageEmail = emailDisplay ? (emailDisplay.textContent || emailDisplay.value || '') : '';

    let matchingAccount = null;
    if (pageEmail) {
      matchingAccount = candidates.find(acc => pageEmail.includes(acc.email) || acc.email.includes(pageEmail.split('@')[0]));
    }

    if (!matchingAccount) {
      const pageText = document.body.innerText;
      matchingAccount = candidates.find(acc => pageText.includes(acc.email));
    }

    const targetAccount = matchingAccount || pendingAccount || accounts[0];
    if (!targetAccount) {
      console.log('[Zarif K12] No target account found for autofill');
      return;
    }

    console.log('[Zarif K12] Using account:', targetAccount.email);

    if (currentPath.includes('/create-account/password') || currentPath.includes('/password')) {
      console.log('[Zarif K12] Detected password page, auto-filling...');
      await fillPasswordPage(targetAccount.password);
    }

    if (currentPath.includes('/email-verification') || currentPath.includes('/verification')) {
      console.log('[Zarif K12] Detected verification page');
      showVerificationNotification();
    }

    if (currentPath.includes('/about-you') || currentPath.includes('/onboarding') || currentPath.includes('/profile')) {
      console.log('[Zarif K12] Detected profile page, auto-filling...');
      await fillAboutYouPage();
    }
  } finally {
    isAuthHandling = false;
  }
}

function isVisible(element) {
  return !!(element && (element.offsetWidth || element.offsetHeight || element.getClientRects().length));
}

async function typeWithEvents(input, value) {
  input.focus();
  input.value = '';
  for (const char of value) {
    input.value += char;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
    await sleep(20);
  }
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

function findContinueButton(contextElement) {
  const scope = contextElement && contextElement.querySelectorAll ? contextElement : document;
  const submitButton = scope.querySelector('button[type="submit"]');
  if (submitButton && isVisible(submitButton)) return submitButton;

  const buttons = Array.from(scope.querySelectorAll('button')).filter(isVisible);
  return buttons.find(btn => {
    const text = (btn.textContent || '').toLowerCase();
    return text.includes('continue') || text.includes('next') || text.includes('create') || text.includes('verify');
  }) || null;
}

async function clickContinueButton(contextElement, maxAttempts = 12) {
  const form = contextElement && contextElement.closest ? contextElement.closest('form') : null;
  const scope = form || document;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const button = findContinueButton(scope);
    if (button && !button.disabled) {
      button.click();
      return true;
    }

    if (form && typeof form.requestSubmit === 'function') {
      form.requestSubmit();
    }

    await sleep(400);
  }

  return false;
}

function getRandomNameParts() {
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return {
    first: 'User',
    last: `Test${suffix}`,
    full: `User Test${suffix}`
  };
}

function getRandomBirthday() {
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  const year = 1980 + Math.floor(Math.random() * 21);
  return {
    month,
    day,
    year,
    monthStr: String(month).padStart(2, '0'),
    dayStr: String(day).padStart(2, '0')
  };
}

function setSelectValue(selectElement, values) {
  if (!selectElement) return false;
  const targets = values.map(value => String(value).toLowerCase());
  const option = Array.from(selectElement.options).find(opt => {
    const optValue = (opt.value || '').toLowerCase();
    const optText = (opt.textContent || '').trim().toLowerCase();
    return targets.includes(optValue) || targets.includes(optText);
  });

  if (!option) return false;
  selectElement.value = option.value;
  selectElement.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

async function fillBirthdayFields() {
  const birthday = getRandomBirthday();
  const monthSelect = document.querySelector('select[name*="month"], select[id*="month"], select[aria-label*="Month"]');
  const daySelect = document.querySelector('select[name*="day"], select[id*="day"], select[aria-label*="Day"]');
  const yearSelect = document.querySelector('select[name*="year"], select[id*="year"], select[aria-label*="Year"]');

  if (monthSelect && daySelect && yearSelect) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[birthday.month - 1];
    const monthAbbrev = monthName.slice(0, 3);
    setSelectValue(monthSelect, [birthday.month, birthday.monthStr, monthName, monthAbbrev]);
    setSelectValue(daySelect, [birthday.day, birthday.dayStr]);
    setSelectValue(yearSelect, [birthday.year]);
    return true;
  }

  const monthInput = document.querySelector('input[placeholder="MM"], input[aria-label*="Month"], input[name*="month"]');
  const dayInput = document.querySelector('input[placeholder="DD"], input[aria-label*="Day"], input[name*="day"]');
  const yearInput = document.querySelector('input[placeholder="YYYY"], input[aria-label*="Year"], input[name*="year"]');

  if (monthInput && dayInput && yearInput) {
    await typeWithEvents(monthInput, birthday.monthStr);
    await typeWithEvents(dayInput, birthday.dayStr);
    await typeWithEvents(yearInput, String(birthday.year));
    return true;
  }

  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    dateInput.value = `${birthday.year}-${birthday.monthStr}-${birthday.dayStr}`;
    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  const birthdayInput = document.querySelector('input[placeholder*="Birthday"], input[name*="birth"]');
  if (birthdayInput) {
    await typeWithEvents(birthdayInput, `${birthday.monthStr}/${birthday.dayStr}/${birthday.year}`);
    return true;
  }

  return false;
}

async function fillPasswordPage(password) {
  const passwordInput = document.querySelector('input[type="password"]') ||
    document.querySelector('input[name="password"]');

  if (!passwordInput) return;

  await typeWithEvents(passwordInput, password);
  showNotification('🔑 Password auto-filled from K12 account!', 'success');
  console.log('[Zarif K12] Password filled');

  await sleep(400);
  const clicked = await clickContinueButton(passwordInput);
  if (!clicked) {
    console.log('[Zarif K12] Continue button not clickable yet');
  }
}

async function fillAboutYouPage() {
  const nameParts = getRandomNameParts();
  const firstNameInput = document.querySelector('input[name*="first"], input[placeholder*="First"]');
  const lastNameInput = document.querySelector('input[name*="last"], input[placeholder*="Last"]');
  const nameInput = document.querySelector('input[name="name"], input[autocomplete="name"], input[placeholder*="name"]');

  if ((firstNameInput || lastNameInput) && (!firstNameInput?.value || !lastNameInput?.value)) {
    if (firstNameInput && !firstNameInput.value) {
      await typeWithEvents(firstNameInput, nameParts.first);
    }
    if (lastNameInput && !lastNameInput.value) {
      await typeWithEvents(lastNameInput, nameParts.last);
    }
  } else if (nameInput && !nameInput.value) {
    await typeWithEvents(nameInput, nameParts.full);
  }

  const birthdayFilled = await fillBirthdayFields();
  if (!birthdayFilled) {
    console.log('[Zarif K12] Birthday fields not found');
  }

  showNotification('👤 Profile info auto-filled!', 'success');

  // Auto-click continue after short delay
  await sleep(400);
  const contextElement = firstNameInput || lastNameInput || nameInput || document.querySelector('form');
  const clicked = await clickContinueButton(contextElement);
  if (!clicked) {
    console.log('[Zarif K12] Continue button not clickable on profile step');
  }
}

function showVerificationNotification() {
  showNotification('📩 Use the extension to fetch the verification code!', 'info');
}

// ========== Live CC Checker Handler (teamcsb.com) ==========

async function handleLiveCCCheck(cardLines) {
  console.log('[Zarif Live CC] Starting check process on teamcsb.com...');

  // 1. Wait for textarea
  const textarea = await waitForElement('textarea', 10000).catch(() => null);

  if (!textarea) {
    console.error('[Zarif Live CC] Textarea not found');
    return { success: false, error: 'Textarea not found' };
  }

  // 2. Clear and Input Cards (Nuclear Method)
  console.log('[Zarif Live CC] Found textarea, inserting cards...');
  textarea.focus();
  textarea.select();
  document.execCommand('insertText', false, cardLines);

  // Verify input
  await sleep(100);
  if (!textarea.value || textarea.value.trim() === '') {
    console.warn('[Zarif Live CC] execCommand failed, fallback to native value setter');
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeTextAreaValueSetter.call(textarea, cardLines);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Dispatch events to wake up React
  textarea.dispatchEvent(new Event('change', { bubbles: true }));
  textarea.dispatchEvent(new Event('blur', { bubbles: true }));

  await sleep(500);

  // 3. Find and Click Start Button
  console.log('[Zarif Live CC] Looking for Start Validation button...');

  const findAndClickButton = async () => {
    const buttons = Array.from(document.querySelectorAll('button'));
    // Filter for "Start Validation" or just "Start"
    const startBtn = buttons.find(b => {
      const t = b.textContent.toLowerCase().trim();
      return (t.includes('start') && t.includes('validation')) ||
        (t.includes('start') && !t.includes('stop'));
    });

    if (startBtn) {
      console.log('[Zarif Live CC] Found button:', startBtn.textContent);
      startBtn.scrollIntoView({ behavior: 'auto', block: 'center' });
      await sleep(200);

      // NUCLEAR OPTION: Try to find and invoke React's internal onClick handler directly
      let reactClicked = false;

      // Find React internal props key
      const reactPropsKey = Object.keys(startBtn).find(key =>
        key.startsWith('__reactProps$') || key.startsWith('__reactFiber$')
      );

      if (reactPropsKey) {
        console.log('[Zarif Live CC] Found React key:', reactPropsKey);
        const props = startBtn[reactPropsKey];

        // Try to find onClick in props chain
        if (props && props.onClick) {
          console.log('[Zarif Live CC] INVOKING React onClick DIRECTLY!');
          props.onClick({
            preventDefault: () => { },
            stopPropagation: () => { },
            target: startBtn,
            currentTarget: startBtn,
            nativeEvent: new MouseEvent('click')
          });
          reactClicked = true;
        } else if (props && props.children && props.children.props && props.children.props.onClick) {
          console.log('[Zarif Live CC] INVOKING nested React onClick!');
          props.children.props.onClick({ preventDefault: () => { }, stopPropagation: () => { } });
          reactClicked = true;
        }
      }

      // Also try __reactFiber$ for function components
      const fiberKey = Object.keys(startBtn).find(key => key.startsWith('__reactFiber$'));
      if (fiberKey && !reactClicked) {
        console.log('[Zarif Live CC] Found React Fiber:', fiberKey);
        let fiber = startBtn[fiberKey];

        // Walk up the fiber tree to find onClick
        while (fiber) {
          if (fiber.memoizedProps && fiber.memoizedProps.onClick) {
            console.log('[Zarif Live CC] INVOKING Fiber onClick!');
            fiber.memoizedProps.onClick({ preventDefault: () => { }, stopPropagation: () => { }, target: startBtn });
            reactClicked = true;
            break;
          }
          fiber = fiber.return;
        }
      }

      if (!reactClicked) {
        console.log('[Zarif Live CC] No React handler found, trying debugger click...');
        // Fallback to debugger click
        const rect = startBtn.getBoundingClientRect();
        const x = Math.round(rect.left + rect.width / 2);
        const y = Math.round(rect.top + rect.height / 2);

        try {
          await chrome.runtime.sendMessage({ action: 'trustedClick', x, y });
        } catch (e) {
          startBtn.click();
        }
      }

      return true;
    }
    return false;
  };

  // Retry clicking a few times
  for (let i = 0; i < 3; i++) {
    if (await findAndClickButton()) {
      console.log(`[Zarif Live CC] Clicked button (attempt ${i + 1})`);
      await sleep(1500); // Wait longer for debugger-based click
    } else {
      await sleep(500);
    }
  }

  // 4. Start Extracting Results (Polling)
  let maxAttempts = 120; // 2 minutes
  let attempts = 0;

  // Clear any existing interval if we restart
  if (window.liveCCPollInterval) clearInterval(window.liveCCPollInterval);

  window.liveCCPollInterval = setInterval(() => {
    attempts++;

    // Check for results
    const result = extractLiveCCResults();

    // Send progress/result to background
    try {
      if (result.done || attempts >= maxAttempts) {
        clearInterval(window.liveCCPollInterval);
        chrome.runtime.sendMessage({
          action: 'liveccExtractResults', // Match the background.js handler
          results: { result } // Wrap to match expected format
        });
        console.log('[Zarif Live CC] Complete:', result);
      } else {
        // Just log progress internally, background.js polls independently? 
        // Actually background.js expects a message or we can send one.
        // Let's rely on background.js polling OR send explicit progress
        // But background.js currently polls using executeScript. We will change that.
      }
    } catch (e) {
      // Connection lost (tab closed?)
      console.log('[Zarif Live CC] Connection lost, stopping poll');
      clearInterval(window.liveCCPollInterval);
    }

  }, 1000);
}

function extractLiveCCResults() {
  const result = {
    done: false,
    liveCards: [],
    total: 0,
    live: 0,
    dead: 0
  };

  // Parse stats
  const statDivs = document.querySelectorAll('div');
  for (const div of statDivs) {
    const text = div.textContent.trim().toLowerCase();
    if (text === 'total' || text === 'valid' || text === 'live' || text === 'dead') {
      const parent = div.closest('div[class]');
      if (parent) {
        const numDiv = parent.querySelector('div:not(:first-child)') || parent.querySelector('span');
        if (numDiv) {
          const num = parseInt(numDiv.textContent);
          if (!isNaN(num)) {
            if (text === 'total' || text === 'valid') result.total = num;
            else if (text === 'live') result.live = num;
            else if (text === 'dead') result.dead = num;
          }
        }
      }
    }
  }

  // Check completion
  if (result.total > 0 && (result.live + result.dead >= result.total)) {
    result.done = true;
  }

  // Extract LIVE cards
  // Strategy: Look for the specific "Live" section or cards
  // We'll iterate all card elements again
  const cardElements = document.querySelectorAll('[class*="card"], [class*="result"]');
  const liveCards = [];

  for (const el of cardElements) {
    const text = el.textContent.toLowerCase();
    if (text.includes('live') && !text.includes('dead')) {
      const cardText = el.textContent;
      const cardMatch = cardText.match(/(\d{16})/);
      const expMatch = cardText.match(/(\d{2}\/\d{2,4})/);
      const cvvMatch = cardText.match(/CVV[:\s]*(\d{3})/i) || cardText.match(/(\d{3})(?!\d)/);

      if (cardMatch) {
        liveCards.push({
          cardNumber: cardMatch[1],
          expiry: expMatch ? expMatch[1] : 'N/A',
          cvv: cvvMatch ? cvvMatch[1] : 'N/A'
        });
      }
    }
  }

  // If we found live count > 0 but no cards, try broader search
  if (result.live > 0 && liveCards.length === 0) {
    // Try to find any text looking like a card that is NOT in a red/dead container
    // This is hard to do generically without seeing DOM.
    // But let's look for "Approved" or "Charged" text
  }

  result.liveCards = liveCards;
  return result;
}


