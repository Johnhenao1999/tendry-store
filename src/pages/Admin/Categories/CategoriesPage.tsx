import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit2, Trash2, X, Save, FolderTree, Image } from 'lucide-react';
import api from '../../../services/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
  isActive: boolean;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
    });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        description: formData.description || undefined,
        image: formData.image || undefined,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory._id, data);
      } else {
        await api.createCategory(data);
      }

      setShowModal(false);
      loadCategories();
    } catch (error: any) {
      alert(error.message || 'Error al guardar categoría');
    }
  };

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0) {
      alert('No se puede eliminar una categoría con productos asociados');
      return;
    }

    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await api.deleteCategory(id);
      loadCategories();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar categoría');
    }
  };

  return (
    <Container>
      <PageHeader>
        <div>
          <Title>Categorías</Title>
          <Subtitle>Organiza tus productos en categorías</Subtitle>
        </div>
        <CreateButton onClick={openCreateModal}>
          <Plus size={20} />
          Nueva Categoría
        </CreateButton>
      </PageHeader>

      {isLoading ? (
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      ) : categories.length > 0 ? (
        <CategoriesGrid>
          {categories.map((category) => (
            <CategoryCard key={category._id}>
              <CategoryImage>
                {category.image ? (
                  <img src={category.image} alt={category.name} />
                ) : (
                  <PlaceholderIcon>
                    <FolderTree size={32} />
                  </PlaceholderIcon>
                )}
              </CategoryImage>
              <CategoryContent>
                <CategoryName>{category.name}</CategoryName>
                <CategorySlug>/{category.slug}</CategorySlug>
                {category.description && (
                  <CategoryDescription>{category.description}</CategoryDescription>
                )}
                <CategoryMeta>
                  <ProductCount>{category.productCount} productos</ProductCount>
                  <StatusBadge $active={category.isActive}>
                    {category.isActive ? 'Activa' : 'Inactiva'}
                  </StatusBadge>
                </CategoryMeta>
              </CategoryContent>
              <CategoryActions>
                <ActionButton onClick={() => openEditModal(category)} title="Editar">
                  <Edit2 size={16} />
                </ActionButton>
                <ActionButton
                  $danger
                  onClick={() => handleDelete(category._id, category.productCount)}
                  title="Eliminar"
                  disabled={category.productCount > 0}
                >
                  <Trash2 size={16} />
                </ActionButton>
              </CategoryActions>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      ) : (
        <EmptyState>
          <FolderTree size={48} />
          <p>No hay categorías creadas</p>
          <CreateButton onClick={openCreateModal}>
            <Plus size={20} />
            Crear primera categoría
          </CreateButton>
        </EmptyState>
      )}

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Nombre *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Esencias Clásico"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Descripción de la categoría..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Imagen (URL)</Label>
                <ImageInputRow>
                  <Image size={18} />
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                  />
                </ImageInputRow>
                {formData.image && (
                  <ImagePreview>
                    <img src={formData.image} alt="Preview" />
                  </ImagePreview>
                )}
              </FormGroup>

              <ModalFooter>
                <CancelButton type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </CancelButton>
                <SubmitButton type="submit">
                  <Save size={18} />
                  {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                </SubmitButton>
              </ModalFooter>
            </Form>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div``;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[800]};
    transform: translateY(-2px);
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[16]};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.neutral[100]};
  border-top-color: ${({ theme }) => theme.colors.primary[600]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const CategoryCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CategoryImage = styled.div`
  height: 160px;
  background: ${({ theme }) => theme.colors.neutral[50]};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.neutral[400]};
`;

const CategoryContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  flex: 1;
`;

const CategoryName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const CategorySlug = styled.code`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  padding: 2px 8px;
  border-radius: 4px;
`;

const CategoryDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-top: ${({ theme }) => theme.spacing[2]};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CategoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const ProductCount = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 4px 10px;
  background: ${({ $active }) => ($active ? '#ecfdf5' : '#fef2f2')};
  color: ${({ $active }) => ($active ? '#059669' : '#dc2626')};
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  background: ${({ theme }) => theme.colors.neutral[50]};
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]};
  background: white;
  color: ${({ $danger, theme }) => ($danger ? '#dc2626' : theme.colors.neutral[500])};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? '#fee2e2' : '#f3f4f6')};
    border-color: ${({ $danger }) => ($danger ? '#fecaca' : '#d1d5db')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]};
  background: white;
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.neutral[500]};

  svg {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    opacity: 0.3;
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }

  button {
    margin: 0 auto;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[6]};
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[500]};

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[700]};
  }
`;

const Form = styled.form`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ImageInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  svg {
    color: ${({ theme }) => theme.colors.neutral[500]};
    flex-shrink: 0;
  }
`;

const ImagePreview = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const CancelButton = styled.button`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  color: ${({ theme }) => theme.colors.neutral[700]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[800]};
  }
`;

export default CategoriesPage;
