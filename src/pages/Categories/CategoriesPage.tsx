import styled from 'styled-components';
import { Loader2 } from 'lucide-react';
import { Container, Section, Heading, Text, Grid, GradientText } from '../../components/ui';
import { CategoryCard } from '../../components/shared';
import { useCategories } from '../../hooks/useProducts';

const PageHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing[16]} 0 ${theme.spacing[8]}`};
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

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  color: ${({ theme }) => theme.colors.error.main};
`;

export function CategoriesPage() {
  const { categories, loading, error } = useCategories();

  return (
    <>
      <PageHeader>
        <Container>
          <Heading as="h1" $size="5xl" $align="center" style={{ marginBottom: '16px' }}>
            Nuestras <GradientText>Categorías</GradientText>
          </Heading>
          <Text $color="secondary" $size="lg" $align="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Explora nuestra amplia selección de joyas organizadas por categoría.
            Encuentra exactamente lo que buscas.
          </Text>
        </Container>
      </PageHeader>

      <Section $padding="md">
        <Container>
          {loading ? (
            <LoadingWrapper>
              <Loader2 size={32} />
            </LoadingWrapper>
          ) : error ? (
            <ErrorMessage>
              <Text $color="muted" style={{ color: '#EF4444' }}>{error}</Text>
            </ErrorMessage>
          ) : (
            <Grid $minChildWidth="300px" $gap={8}>
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  id={category.slug}
                  name={category.name}
                  description={category.description}
                  image={category.image}
                  productCount={category.productCount || 0}
                />
              ))}
            </Grid>
          )}
        </Container>
      </Section>
    </>
  );
}
