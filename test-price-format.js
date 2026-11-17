// Test file to verify price formatting fixes
// Run with: node test-price-format.js

const formatPrice = (price, t) => {
  if (!price) return 'Price on request';
  
  // Remove all whitespace first to handle various formats
  const cleanPrice = price.replace(/\s+/g, ' ').trim();
  
  // More robust regex to match various currency formats
  const match = cleanPrice.match(/^([€$£¥₹]|[A-Z]{3})?\s*([0-9]+(?:[,\.][0-9]+)*)\s*([A-Z]{3})?/i);
  
  if (!match) return price;
  
  // Extract currency (before or after number)
  const currencyBefore = match[1] || '';
  const numberStr = match[2];
  const currencyAfter = match[3] || '';
  const currency = (currencyBefore || currencyAfter).trim();
  
  // Clean the number string by removing all separators
  let cleanNumber = numberStr;
  
  // Count periods and commas to determine format
  const periodCount = (cleanNumber.match(/\./g) || []).length;
  const commaCount = (cleanNumber.match(/,/g) || []).length;
  
  if (periodCount > 0 && commaCount > 0) {
    // Mixed format: determine which is decimal separator
    const lastPeriodIndex = cleanNumber.lastIndexOf('.');
    const lastCommaIndex = cleanNumber.lastIndexOf(',');
    
    if (lastCommaIndex > lastPeriodIndex) {
      // European format: periods are thousands, comma is decimal
      cleanNumber = cleanNumber.replace(/\./g, '').replace(',', '.');
    } else {
      // US format: commas are thousands, period is decimal
      cleanNumber = cleanNumber.replace(/,/g, '');
    }
  } else if (periodCount > 1) {
    // Multiple periods = European format with periods as thousand separators
    cleanNumber = cleanNumber.replace(/\./g, '');
  } else if (commaCount > 1) {
    // Multiple commas = error or unusual format, remove all commas
    cleanNumber = cleanNumber.replace(/,/g, '');
  } else if (periodCount === 1) {
    // Single period: check if it's thousand separator or decimal
    const parts = cleanNumber.split('.');
    if (parts[1] && parts[1].length === 3 && !commaCount) {
      // Likely a thousand separator
      cleanNumber = cleanNumber.replace('.', '');
    }
  } else if (commaCount === 1) {
    // Single comma: likely decimal in European format, convert to period
    const parts = cleanNumber.split(',');
    if (parts[1] && parts[1].length <= 2) {
      cleanNumber = cleanNumber.replace(',', '.');
    } else {
      // Comma with 3 digits after = thousand separator
      cleanNumber = cleanNumber.replace(',', '');
    }
  }
  
  const number = parseFloat(cleanNumber);
  
  // Validate number
  if (isNaN(number) || number <= 0) return price;
  
  // Determine currency symbol/code position
  const currencyFirst = !!currencyBefore || currency === '€' || currency === '$' || currency === '£';
  
  // Format with appropriate suffix
  let formattedNumber;
  
  if (number >= 1000000) {
    const millions = number / 1000000;
    formattedNumber = millions.toFixed(1).replace(/\.0$/, '');
    formattedNumber = formattedNumber + 'M';
  } else if (number >= 1000) {
    const thousands = number / 1000;
    formattedNumber = thousands.toFixed(1).replace(/\.0$/, '');
    formattedNumber = formattedNumber + 'K';
  } else {
    formattedNumber = new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(number);
  }
  
  // Return with currency in appropriate position
  if (currency) {
    // Add space after currency code (3+ chars) but not after symbols
    const needsSpace = currency.length > 2;
    return currencyFirst 
      ? `${currency}${needsSpace ? ' ' : ''}${formattedNumber}`.trim()
      : `${formattedNumber} ${currency}`.trim();
  }
  
  return formattedNumber;
};

// Test cases
const testCases = [
  // European format (Spain)
  { input: '€3.000.000', expected: '€3M', description: '3 million euros (European format)' },
  { input: '€7.000.000', expected: '€7M', description: '7 million euros (European format)' },
  { input: '€9.500.000', expected: '€9.5M', description: '9.5 million euros (European format)' },
  { input: '€500.000', expected: '€500K', description: '500k euros (European format)' },
  { input: '€250.000', expected: '€250K', description: '250k euros (European format)' },
  { input: '€1.000', expected: '€1K', description: '1k euros (European format)' },
  
  // US format (UAE/Dubai)
  { input: 'AED 3,000,000', expected: 'AED 3M', description: '3 million AED (US format)' },
  { input: 'AED 7,500,000', expected: 'AED 7.5M', description: '7.5 million AED (US format)' },
  { input: 'AED 500,000', expected: 'AED 500K', description: '500k AED (US format)' },
  
  // Edge cases
  { input: '€3000000', expected: '€3M', description: '3 million euros (no separators)' },
  { input: '€999', expected: '€999', description: '999 euros (below 1000)' },
  { input: '€1.200.000,50', expected: '€1.2M', description: '1.2 million euros with decimals (European)' },
];

console.log('Testing Price Formatting Function\n' + '='.repeat(50) + '\n');

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = formatPrice(test.input);
  const success = result === test.expected;
  
  if (success) {
    passed++;
    console.log(`✅ Test ${index + 1}: PASSED`);
  } else {
    failed++;
    console.log(`❌ Test ${index + 1}: FAILED`);
    console.log(`   Description: ${test.description}`);
    console.log(`   Input:    ${test.input}`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Got:      ${result}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Price formatting is working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the formatPrice function.');
}
