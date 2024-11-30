export const luhnCheck = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
  
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
  
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
  };
  
  export const getCardType = (cardNumber: string): string => {
    const cleanedNumber = cardNumber.replace(/\D/g, '');
    if (cleanedNumber.startsWith('4')) return 'visa';
    if (cleanedNumber.startsWith('5')) return 'mastercard';
    if (cleanedNumber.startsWith('3')) return 'amex';
    if (cleanedNumber.startsWith('6')) return 'discover';
    return 'generic';
  };
  
  export const getMaxCardLength = (cardType: string): number => {
    return cardType === 'amex' ? 15 : 16;
  };
  
  export const getMaxCvvLength = (cardType: string): number => {
    return cardType === 'amex' ? 4 : 3;
  };
  
  export const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const cardType = getCardType(v)
    const parts = []
    const maxLength = getMaxCardLength(cardType)
  
    if (cardType === 'amex') {
      for (let i = 0; i < v.length && i < maxLength; i += (i === 0 ? 4 : 6)) {
        parts.push(v.substring(i, i + (i === 0 ? 4 : 6)))
      }
    } else {
      for (let i = 0; i < v.length && i < maxLength; i += 4) {
        parts.push(v.substring(i, i + 4))
      }
    }
  
    return parts.join(' ')
  }
  
  export const formatExpirationDate = (value: string): string => {
    const cleanedValue = value.replace(/[^\d]/g, '')
    if (cleanedValue.length === 0) {
      return ''
    }
    if (cleanedValue.length === 1 && parseInt(cleanedValue) > 1) {
      return `0${cleanedValue}/`
    }
    if (cleanedValue.length === 2) {
      return `${cleanedValue}/`
    }
    if (cleanedValue.length > 2) {
      return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`
    }
    return cleanedValue
  }
  