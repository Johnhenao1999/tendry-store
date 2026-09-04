import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Grid as GridIcon, List, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container, Section, Heading, Text, Grid, GradientText, Tag } from '../../components/ui';
import { ProductCard } from '../../components/shared';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';

const PageHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[16]} 0 ${theme.spacing[8]}`};
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  
  input {
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]} ${theme.spacing[2]} ${theme.spacing[10]}`};
    background: ${({ theme }) => theme.colors.primary[700]};
    border: 1px solid ${({ theme }) => theme.colors.primary[500]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.neutral.white};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    
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
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.neutral[400]};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ViewButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${({ $active, theme }) => $active ? theme.colors.secondary[500] : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary[900] : theme.colors.neutral[400]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.secondary[500] : theme.colors.primary[600]};
  }
`;

const SortSelect = styled.select`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.neutral.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.secondary[500]};
  }
  
  option {
    background: ${({ theme }) => theme.colors.primary[800]};
  }
`;

const ResultsInfo = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[12]};
  color: ${({ theme }) => theme.colors.secondary[500]};
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const PageButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: ${({ theme }) => `0 ${theme.spacing[3]}`};
  background: ${({ $active, theme }) => $active ? theme.colors.secondary[500] : theme.colors.primary[700]};
  color: ${({ $active, theme }) => $active ? theme.colors.primary[900] : theme.colors.neutral.white};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.secondary[500] : theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background: ${({ $active, theme }) => $active ? theme.colors.secondary[400] : theme.colors.primary[600]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function ProductsPage() {
  const { categoryId } = useParams();
  const { addItem } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { categories } = useCategories();
  
  // Map sort option to API format
  const sortMap: Record<string, string> = {
    'featured': '-isFeatured',
    'price-low': 'price',
    'price-high': '-price',
    'newest': '-createdAt',
    'name': 'name',
  };

  const { products, pagination, loading, error } = useProducts({
    page: currentPage,
    limit: 12,
    category: selectedCategory || undefined,
    search: debouncedSearch || undefined,
    sort: sortMap[sortBy],
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update category from URL params
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const categoryName = useMemo(() => {
    if (!selectedCategory) return null;
    const cat = categories.find(c => c.slug === selectedCategory);
    return cat?.name || selectedCategory;
  }, [selectedCategory, categories]);

  return (
    <>
      <PageHeader>
        <Container>
          <Heading as="h1" $size="5xl" $align="center" style={{ marginBottom: '16px' }}>
            {categoryName ? (
              <>{categoryName}</>
            ) : (
              <>Nuestros <GradientText>Productos</GradientText></>
            )}
          </Heading>
          <Text $color="secondary" $size="lg" $align="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {categoryName 
              ? `Explora nuestra selección de ${categoryName.toLowerCase()}`
              : 'Descubre nuestra colección completa de joyas premium'
            }
          </Text>
        </Container>
      </PageHeader>

      <Section $padding="sm">
        <Container>
          <FiltersBar>
            <FilterTags>
              <Tag
                $active={!selectedCategory}
                onClick={() => handleCategoryChange('')}
              >
                Todos
              </Tag>
              {categories.map((category) => (
                <Tag
                  key={category._id}
                  $active={selectedCategory === category.slug}
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  {category.name}
                </Tag>
              ))}
            </FilterTags>
            
            <FilterActions>
              <SearchWrapper>
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchWrapper>
              
              <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Destacados</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="newest">Más Recientes</option>
                <option value="name">Nombre A-Z</option>
              </SortSelect>
              
              <ViewToggle>
                <ViewButton $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
                  <GridIcon size={18} />
                </ViewButton>
                <ViewButton $active={viewMode === 'list'} onClick={() => setViewMode('list')}>
                  <List size={18} />
                </ViewButton>
              </ViewToggle>
            </FilterActions>
          </FiltersBar>

          <ResultsInfo $color="muted" $size="sm">
            Mostrando {products?.length || 0} de {pagination?.total || 0} productos
          </ResultsInfo>

          {loading ? (
            <LoadingWrapper>
              <Loader2 size={32} />
            </LoadingWrapper>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Text $color="muted" $size="lg" style={{ color: '#EF4444' }}>{error}</Text>
            </div>
          ) : (
            <>
              <Grid $minChildWidth={viewMode === 'grid' ? '260px' : '100%'} $gap={6}>
                {(products || []).map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    slug={product.slug}
                    name={product.name}
                    brand={product.brand || ''}
                    price={product.price}
                    originalPrice={product.compareAtPrice}
                    image={product.images[0] || 'https://via.placeholder.com/300'}
                    category={product.category?.name || ''}
                    inStock={product.stock > 0}
                    isNew={new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                    onAddToCart={() => addItem({
                      productId: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0] || '',
                      stock: product.stock,
                    })}
                    onAddToWishlist={() => console.log('Add to wishlist:', product._id)}
                  />
                ))}
              </Grid>

              {(!products || products.length === 0) && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Text $color="muted" $size="lg">
                    No se encontraron productos con los filtros seleccionados
                  </Text>
                </div>
              )}

              {pagination && pagination.pages > 1 && (
                <Pagination>
                  <PageButton
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={20} />
                  </PageButton>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(page => {
                      if (pagination.pages <= 5) return true;
                      if (page === 1 || page === pagination.pages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, index, arr) => (
                      <>
                        {index > 0 && arr[index - 1] !== page - 1 && (
                          <span key={`ellipsis-${page}`} style={{ color: '#666' }}>...</span>
                        )}
                        <PageButton
                          key={page}
                          $active={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PageButton>
                      </>
                    ))
                  }
                  
                  <PageButton
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === pagination.pages}
                  >
                    <ChevronRight size={20} />
                  </PageButton>
                </Pagination>
              )}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
