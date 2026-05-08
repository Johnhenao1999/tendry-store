import styled, { css } from 'styled-components';

interface InputWrapperProps {
  $hasError?: boolean;
  $fullWidth?: boolean;
}

export const InputWrapper = styled.div<InputWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[200]};
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.neutral.white};
  background: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.error.main : theme.colors.primary[400]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error.main : theme.colors.secondary[500]};
    box-shadow: 0 0 0 3px ${({ $hasError }) => 
      $hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(212, 168, 67, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.neutral.white};
  background: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.error.main : theme.colors.primary[400]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error.main : theme.colors.secondary[500]};
    box-shadow: 0 0 0 3px ${({ $hasError }) => 
      $hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(212, 168, 67, 0.2)'};
  }
`;

export const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.error.main};
`;

export const HelperText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[400]};
`;

export const SearchInput = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  
  input {
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]} ${theme.spacing[12]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.neutral.white};
    background: ${({ theme }) => theme.colors.primary[700]};
    border: 1px solid ${({ theme }) => theme.colors.primary[400]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    transition: all ${({ theme }) => theme.transitions.fast};
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.neutral[400]};
    }
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.secondary[500]};
    }
  }
  
  svg {
    position: absolute;
    left: ${({ theme }) => theme.spacing[4]};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;
