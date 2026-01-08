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
  }
  return true;
});

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
