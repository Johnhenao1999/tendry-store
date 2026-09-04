import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Check if user is admin after login
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Logo>
          <LogoIcon>T</LogoIcon>
          <LogoText>TENDRYX JOYERÍA</LogoText>
        </Logo>
        <Title>Panel de Administración</Title>
        <Subtitle>Inicia sesión para continuar</Subtitle>

        {error && (
          <ErrorMessage>
            <AlertCircle size={18} />
            {error}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TogglePassword onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </TogglePassword>
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </SubmitButton>
        </Form>

        <BackLink href="/">← Volver a la tienda</BackLink>
      </LoginCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[800]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  padding: ${({ theme }) => theme.spacing[6]};
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing[12]};
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary[600]}, ${({ theme }) => theme.colors.secondary[400]});
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary[800]};
`;

const LogoText = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[800]};
  letter-spacing: 2px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 24px;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: #fee2e2;
  color: #dc2626;
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: 8px;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 48px;
  border: 2px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[600]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[600]}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[500]};
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[800]});
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${({ theme }) => theme.spacing[2]};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(216, 154, 51, 0.28);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BackLink = styled.a`
  display: block;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-decoration: none;
  font-size: 14px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export default LoginPage;
