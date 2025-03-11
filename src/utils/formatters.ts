
/**
 * Formats a phone number to a readable format: +X (XXX) XXX-XX-XX
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Clean the phone number to only contain digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if we have a standard Russian number
  if (cleaned.length === 11) {
    const countryCode = cleaned[0];
    const areaCode = cleaned.substring(1, 4);
    const firstPart = cleaned.substring(4, 7);
    const secondPart = cleaned.substring(7, 9);
    const thirdPart = cleaned.substring(9, 11);
    
    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`;
  }
  
  // For other lengths, just try to format it nicely
  if (cleaned.length === 10) {
    const areaCode = cleaned.substring(0, 3);
    const firstPart = cleaned.substring(3, 6);
    const secondPart = cleaned.substring(6, 8);
    const thirdPart = cleaned.substring(8, 10);
    
    return `(${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`;
  }
  
  // Return original for other formats
  return phoneNumber;
};

/**
 * Parses phone numbers from text (one per line)
 */
export const parsePhoneNumbers = (text: string): string[] => {
  // Split by newlines and filter empty lines
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Try to extract the first sequence that looks like a phone number
      const match = line.match(/(\+?\d[\d\s()-]{8,}\d)/);
      return match ? match[0] : line;
    });
};

/**
 * Validates if a string might be a valid phone number
 */
export const isValidPhoneNumber = (input: string): boolean => {
  // Clean the input of any non-digit characters
  const digits = input.replace(/\D/g, '');
  
  // Check if we have at least 10 digits (minimal for a phone number)
  return digits.length >= 10;
};

/**
 * Prepares number data for export in a specific format
 */
export const prepareExportData = (
  data: any[], 
  format: 'csv' | 'json' | 'text' = 'csv'
): string => {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  if (format === 'csv') {
    // Handle different object shapes
    if (data.length === 0) return '';
    
    const firstItem = data[0];
    const headers = Object.keys(firstItem).join(',');
    const rows = data.map(item => Object.values(item).join(','));
    
    return [headers, ...rows].join('\n');
  }
  
  // Default to text format
  return data.map(item => {
    if (typeof item === 'string') return item;
    return Object.entries(item)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }).join('\n');
};

/**
 * Downloads data as a file
 */
export const downloadAsFile = (
  data: string, 
  filename: string, 
  type: 'text/csv' | 'application/json' | 'text/plain' = 'text/plain'
): void => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
