export interface PasswordValidation {
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
  isValid: boolean;
}

export const validatePassword = (password: string): PasswordValidation => {
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password);
  const hasMinLength = password.length >= 8;

  const isValid = hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && hasMinLength;

  return {
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    hasMinLength,
    isValid,
  };
};

export const getPasswordValidationMessage = (validation: PasswordValidation): string => {
  const messages: string[] = [];
  
  if (!validation.hasMinLength) messages.push('at least 8 characters');
  if (!validation.hasLowerCase) messages.push('one lowercase letter');
  if (!validation.hasUpperCase) messages.push('one uppercase letter');
  if (!validation.hasNumber) messages.push('one number');
  if (!validation.hasSpecialChar) messages.push('one special character');

  if (messages.length === 0) return 'Password is strong!';
  
  return `Password must contain: ${messages.join(', ')}.`;
};