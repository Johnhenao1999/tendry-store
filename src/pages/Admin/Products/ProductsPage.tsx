import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../../services/api';
import { ImageUpload } from '../../../components/shared/ImageUpload';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: { _id: string; name: string; slug: string };
  stock: number;
  sku?: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    images: [''],
    category: '',
    stock: '',
    sku: '',
    tags: '',
    isFeatured: false,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [pagination.page]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.getProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
      });
      setProducts(response.data || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0,
      }));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadProducts();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      compareAtPrice: '',
      images: [''],
      category: categories[0]?._id || '',
      stock: '',
      sku: '',
      tags: '',
      isFeatured: false,
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      images: product.images.length > 0 ? product.images : [''],
      category: product.category._id,
      stock: product.stock.toString(),
      sku: product.sku || '',
      tags: product.tags.join(', '),
      isFeatured: product.isFeatured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        images: formData.images.filter((img) => img.trim()),
        category: formData.category,
        stock: parseInt(formData.stock),
        sku: formData.sku || undefined,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isFeatured: formData.isFeatured,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, data);
      } else {
        await api.createProduct(data);
      }

      setShowModal(false);
      loadProducts();
    } catch (error: any) {
      alert(error.message || 'Error al guardar producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar producto');
    }
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Container>
      <PageHeader>
        <div>
          <Title>Productos</Title>
          <Subtitle>Gestiona el catálogo de productos</Subtitle>
        </div>
        <CreateButton onClick={openCreateModal}>
          <Plus size={20} />
          Nuevo Producto
        </CreateButton>
      </PageHeader>

      <Toolbar>
        <SearchBox>
          <Search size={20} />
          <SearchInput
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </SearchBox>
        <SearchButton onClick={handleSearch}>Buscar</SearchButton>
      </Toolbar>

      <TableCard>
        {isLoading ? (
          <LoadingWrapper>
            <Spinner />
          </LoadingWrapper>
        ) : products.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Producto</Th>
                  <Th>Categoría</Th>
                  <Th>Precio</Th>
                  <Th>Stock</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <Tr key={product._id}>
                    <Td>
                      <ProductInfo>
                        <ProductImage src={product.images[0] || '/placeholder.png'} alt={product.name} />
                        <div>
                          <ProductName>{product.name}</ProductName>
                          <ProductSku>SKU: {product.sku || 'N/A'}</ProductSku>
                        </div>
                      </ProductInfo>
                    </Td>
                    <Td>{product.category?.name || 'Sin categoría'}</Td>
                    <Td>
                      <PriceWrapper>
                        <CurrentPrice>{formatCurrency(product.price)}</CurrentPrice>
                        {product.compareAtPrice && (
                          <OldPrice>{formatCurrency(product.compareAtPrice)}</OldPrice>
                        )}
                      </PriceWrapper>
                    </Td>
                    <Td>
                      <StockBadge $low={product.stock < 10}>{product.stock}</StockBadge>
                    </Td>
                    <Td>
                      <StatusBadge $active={product.isActive}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </StatusBadge>
                      {product.isFeatured && <FeaturedBadge>Destacado</FeaturedBadge>}
                    </Td>
                    <Td>
                      <Actions>
                        <ActionButton onClick={() => openEditModal(product)} title="Editar">
                          <Edit2 size={16} />
                        </ActionButton>
                        <ActionButton $danger onClick={() => handleDelete(product._id)} title="Eliminar">
                          <Trash2 size={16} />
                        </ActionButton>
                      </Actions>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>

            {pagination.pages > 1 && (
              <Pagination>
                <PageInfo>
                  Página {pagination.page} de {pagination.pages} ({pagination.total} productos)
                </PageInfo>
                <PageButtons>
                  <PageButton
                    disabled={pagination.page === 1}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  >
                    <ChevronLeft size={18} />
                  </PageButton>
                  <PageButton
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  >
                    <ChevronRight size={18} />
                  </PageButton>
                </PageButtons>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>No se encontraron productos</EmptyState>
        )}
      </TableCard>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGrid>
                <FormGroup $full>
                  <Label>Nombre *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </FormGroup>

                <FormGroup $full>
                  <Label>Descripción *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Precio *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Precio Anterior</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, compareAtPrice: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Categoría *</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Stock *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>SKU</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Tags (separados por coma)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="anillo, pulsera, acero"
                  />
                </FormGroup>

                <FormGroup $full>
                  <Label>Imágenes</Label>
                  <ImagesGrid>
                    {formData.images.map((img, index) => (
                      <ImageUpload
                        key={index}
                        value={img}
                        onChange={(url) => updateImage(index, url)}
                        onRemove={() => removeImageField(index)}
                        showRemove={formData.images.length > 1}
                      />
                    ))}
                  </ImagesGrid>
                  <AddImageButton type="button" onClick={addImageField}>
                    <Plus size={16} /> Agregar otra imagen
                  </AddImageButton>
                </FormGroup>

                <FormGroup $full>
                  <CheckboxLabel>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    />
                    Producto destacado
                  </CheckboxLabel>
                </FormGroup>
              </FormGrid>

              <ModalFooter>
                <CancelButton type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </CancelButton>
                <SubmitButton type="submit">
                  <Save size={18} />
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
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

const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SearchBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 10px;
  padding: 0 ${({ theme }) => theme.spacing[4]};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  font-size: 14px;

  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.secondary[600]};
  color: ${({ theme }) => theme.colors.primary[800]};
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.neutral[500]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const Tr = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  vertical-align: middle;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.neutral[50]};
`;

const ProductName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const ProductSku = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const PriceWrapper = styled.div``;

const CurrentPrice = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const OldPrice = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-decoration: line-through;
`;

const StockBadge = styled.span<{ $low: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  background: ${({ $low }) => ($low ? '#fef2f2' : '#f0fdf4')};
  color: ${({ $low }) => ($low ? '#dc2626' : '#16a34a')};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  background: ${({ $active }) => ($active ? '#ecfdf5' : '#fef2f2')};
  color: ${({ $active }) => ($active ? '#059669' : '#dc2626')};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const FeaturedBadge = styled.span`
  display: inline-block;
  margin-left: ${({ theme }) => theme.spacing[1]};
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.secondary[600]};
  color: ${({ theme }) => theme.colors.primary[800]};
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ $danger }) => ($danger ? '#fef2f2' : '#f3f4f6')};
  color: ${({ $danger, theme }) => ($danger ? '#dc2626' : theme.colors.neutral[500])};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $danger }) => ($danger ? '#fee2e2' : '#e5e7eb')};
    color: ${({ $danger, theme }) => ($danger ? '#b91c1c' : theme.colors.primary[600])};
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[100]};
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const PageButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const PageButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[16]};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
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
  max-width: 700px;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div<{ $full?: boolean }>`
  grid-column: ${({ $full }) => ($full ? 'span 2' : 'span 1')};
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

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const AddImageButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background: none;
  border: 1px dashed ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.neutral[500]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[600]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[8]};
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

export default ProductsPage;
