export const validatePhoneNumber = (number: string) => {
    return /^0\d{9}$/.test(number);
  };
  