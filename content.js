let isProcessing = false;

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
    const isGooglePay = window.location.hostname.includes('payments.google.com') || window.location.hostname.includes('pay.google.com');

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

