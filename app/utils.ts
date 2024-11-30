export const isAmex = (value: string): boolean => {
    return value.startsWith('34') || value.startsWith('37');
  };
  
  export const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (isAmex(v)) {
      const matches = v.match(/\d{4}|\d{1,6}/g)
      const match = matches ? matches.join(' ') : ''
      return match.substring(0, 17)
    } else {
      const matches = v.match(/\d{4}/g)
      const match = matches ? matches.join(' ') : ''
      return match.substring(0, 19)
    }
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
  
  