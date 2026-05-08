import styled from 'styled-components';
import { ArrowRight, Sparkles, Truck, Shield, Headphones, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, Section, Button, Heading, Text, Grid, GradientText } from '../../components/ui';
import { ProductCard, CategoryCard } from '../../components/shared';
import { useFeaturedProducts, useCategories } from '../../hooks/useProducts';

// Hero Section
const HeroSection = styled.section`
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[900]} 0%,
    ${({ theme }) => theme.colors.primary[800]} 50%,
    ${({ theme }) => theme.colors.primary[700]} 100%
  );
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 80%;
    height: 150%;
    background: radial-gradient(
      circle,
      rgba(212, 168, 67, 0.1) 0%,
      transparent 70%
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
`;

const HeroSubtitle = styled(Text)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background: rgba(212, 168, 67, 0.1);
  border: 1px solid rgba(212, 168, 67, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  svg {
    color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;

const HeroTitle = styled(Heading)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.1;
`;

const HeroDescription = styled(Text)`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  max-width: 500px;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
`;

const HeroImage = styled.div`
  position: absolute;
  right: 5%;
  bottom: 0;
  width: 45%;
  max-width: 500px;
  z-index: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
  
  img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
  }
`;

// Features Section
const FeaturesSection = styled(Section)`
  background: ${({ theme }) => theme.colors.primary[900]};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary[600]};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary[500]};
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary[600]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  svg {
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

const FeatureTitle = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

// Section Header
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const SectionTitle = styled(Heading)`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-top: ${({ theme }) => theme.spacing[8]};
  
  &:hover {
    gap: ${({ theme }) => theme.spacing[3]};
  }
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

const features = [
  {
    icon: <Sparkles size={28} />,
    title: 'Calidad Premium',
    description: 'Fragancias seleccionadas con los más altos estándares de calidad.',
  },
  {
    icon: <Truck size={28} />,
    title: 'Envío Rápido',
    description: 'Entrega en 24-48h en península. Envíos a toda Europa.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Garantía Total',
    description: '30 días de garantía de devolución sin preguntas.',
  },
  {
    icon: <Headphones size={28} />,
    title: 'Atención 24/7',
    description: 'Soporte por WhatsApp disponible todos los días.',
  },
];

export function HomePage() {
  const { categories, loading: loadingCategories } = useCategories();
  const { products: featuredProducts, loading: loadingProducts } = useFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <HeroContent>
            <HeroSubtitle $size="sm" $color="gold">
              <Sparkles size={16} />
              Nueva colección disponible
            </HeroSubtitle>
            
            <HeroTitle as="h1" $size="5xl">
              Descubre tu <GradientText>fragancia</GradientText> perfecta
            </HeroTitle>
            
            <HeroDescription $color="secondary">
              Explora nuestra exclusiva colección de perfumes y esencias. 
              Desde clásicos atemporales hasta las últimas tendencias en fragancias de lujo.
            </HeroDescription>
            
            <HeroButtons>
              <Button as={Link} to="/productos" $variant="primary" $size="lg">
                Ver Catálogo
                <ArrowRight size={20} />
              </Button>
              <Button as={Link} to="/categorias" $variant="outline" $size="lg">
                Categorías
              </Button>
            </HeroButtons>
          </HeroContent>
        </Container>
        
        <HeroImage>
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=600&fit=crop" 
            alt="Perfume destacado"
          />
        </HeroImage>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection $padding="md">
        <Container>
          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle $color="white">{feature.title}</FeatureTitle>
                <Text $size="sm" $color="muted">{feature.description}</Text>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Container>
      </FeaturesSection>

      {/* Categories Section */}
      <Section $padding="lg">
        <Container>
          <SectionHeader>
            <SectionTitle as="h2" $size="4xl">
              Nuestras <GradientText>Categorías</GradientText>
            </SectionTitle>
            <Text $color="secondary" $size="lg">
              Encuentra exactamente lo que buscas en nuestra variedad de colecciones
            </Text>
          </SectionHeader>
          
          {loadingCategories ? (
            <LoadingWrapper>
              <Loader2 size={32} />
            </LoadingWrapper>
          ) : (
            <Grid $minChildWidth="280px" $gap={6}>
              {categories.slice(0, 4).map((category) => (
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
          
          <div style={{ textAlign: 'center' }}>
            <ViewAllLink to="/categorias">
              Ver todas las categorías
              <ArrowRight size={18} />
            </ViewAllLink>
          </div>
        </Container>
      </Section>

      {/* Featured Products Section */}
      <Section $padding="lg" style={{ background: 'rgba(15, 28, 46, 0.5)' }}>
        <Container>
          <SectionHeader>
            <SectionTitle as="h2" $size="4xl">
              Productos <GradientText>Destacados</GradientText>
            </SectionTitle>
            <Text $color="secondary" $size="lg">
              Los más vendidos y las mejores ofertas de la temporada
            </Text>
          </SectionHeader>
          
          {loadingProducts ? (
            <LoadingWrapper>
              <Loader2 size={32} />
            </LoadingWrapper>
          ) : (
            <Grid $minChildWidth="260px" $gap={6}>
              {featuredProducts.map((product) => (
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
                  onAddToCart={() => console.log('Add to cart:', product._id)}
                  onAddToWishlist={() => console.log('Add to wishlist:', product._id)}
                />
              ))}
            </Grid>
          )}
          
          <div style={{ textAlign: 'center' }}>
            <ViewAllLink to="/productos">
              Ver todos los productos
              <ArrowRight size={18} />
            </ViewAllLink>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section $padding="lg">
        <Container $maxWidth="md">
          <div style={{ textAlign: 'center' }}>
            <Heading as="h2" $size="3xl" $align="center" style={{ marginBottom: '24px' }}>
              ¿Tienes alguna pregunta?
            </Heading>
            <Text $color="secondary" $align="center" $size="lg" style={{ marginBottom: '32px' }}>
              Contáctanos por WhatsApp y te ayudaremos a encontrar la fragancia perfecta para ti.
            </Text>
            <Button
              as="a"
              href="https://wa.me/34611242280"
              target="_blank"
              rel="noopener noreferrer"
              $variant="primary"
              $size="lg"
            >
              Contactar por WhatsApp
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
