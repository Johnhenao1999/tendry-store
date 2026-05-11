import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinary';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  showRemove = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const result = await uploadToCloudinary(file);
      onChange(result.secure_url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container>
      <UploadArea onClick={handleClick} $hasImage={!!value} $isUploading={isUploading}>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />

        {isUploading ? (
          <UploadingState>
            <Loader2 size={24} className="spinner" />
            <span>Subiendo...</span>
          </UploadingState>
        ) : value ? (
          <PreviewImage>
            <img src={value} alt="Preview" />
            <Overlay className="overlay">
              <Upload size={20} />
              <span>Cambiar imagen</span>
            </Overlay>
            {uploadSuccess && (
              <SuccessBadge>
                <Check size={16} />
              </SuccessBadge>
            )}
          </PreviewImage>
        ) : (
          <PlaceholderContent>
            <ImageIcon size={32} />
            <span>Click para subir imagen</span>
            <small>JPG, PNG, WEBP (máx. 5MB)</small>
          </PlaceholderContent>
        )}
      </UploadArea>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <InputRow>
        <UrlInput
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="O pega una URL directamente..."
        />
        {showRemove && value && (
          <RemoveButton type="button" onClick={onRemove}>
            <X size={16} />
          </RemoveButton>
        )}
      </InputRow>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const UploadArea = styled.div<{ $hasImage: boolean; $isUploading: boolean }>`
  position: relative;
  width: 100%;
  height: 180px;
  border: 2px dashed ${({ theme, $hasImage }) =>
    $hasImage ? theme.colors.neutral[200] : theme.colors.neutral[300]};
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
  background: ${({ theme }) => theme.colors.neutral[50]};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.neutral[100]};

    .overlay {
      opacity: 1;
    }
  }

  ${({ $isUploading }) =>
    $isUploading &&
    `
    pointer-events: none;
    opacity: 0.7;
  `}
`;

const HiddenInput = styled.input`
  display: none;
`;

const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.neutral[500]};

  span {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.neutral[600]};
  }

  small {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const PreviewImage = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background: rgba(0, 0, 0, 0.6);
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 14px;
  font-weight: 500;
`;

const UploadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.primary[600]};

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuccessBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.success || '#10b981'};
  color: white;
  border-radius: 50%;
  animation: fadeIn 0.2s;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.error || '#ef4444'};
`;

const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const UrlInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 8px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.error || '#fef2f2'};
  color: ${({ theme }) => theme.colors.error || '#dc2626'};
  border: 1px solid ${({ theme }) => theme.colors.error || '#fecaca'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    color: white;
  }
`;

export default ImageUpload;
