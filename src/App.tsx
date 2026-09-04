import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyles } from './design-system';
import { Header, Footer } from './components/layout';
import { HomePage, CategoriesPage, ProductsPage, ProductDetailPage } from './pages';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import LoginPage from './pages/Admin/Login/LoginPage';
import DashboardPage from './pages/Admin/Dashboard/DashboardPage';
import AdminProductsPage from './pages/Admin/Products/ProductsPage';
import AdminCategoriesPage from './pages/Admin/Categories/CategoriesPage';
import OrdersPage from './pages/Admin/Orders/OrdersPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';

// Layout component that wraps all pages with Header and Footer
function RootLayout() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'categorias',
        element: <CategoriesPage />,
      },
      {
        path: 'categorias/:categoryId',
        element: <ProductsPage />,
      },
      {
        path: 'productos',
        element: <ProductsPage />,
      },
      {
        path: 'productos/:productId',
        element: <ProductDetailPage />,
      },
      {
        path: 'ofertas',
        element: <ProductsPage />,
      },
      {
        path: 'carrito',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'contacto',
        element: (
          <section style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '16px' }}>Contacto Tendryx Joyería</h1>
            <p style={{ marginBottom: '8px' }}>Dirección: Avenida Jesús Morante Borrás 232, España</p>
            <p style={{ marginBottom: '8px' }}>Teléfono: +34 613 427 440</p>
            <p style={{ marginBottom: '24px' }}>Realizamos envíos a toda España.</p>
            <a
              href="https://wa.me/34613427440"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#D4A843', fontWeight: 600 }}
            >
              Escribir por WhatsApp
            </a>
          </section>
        ),
      },
      {
        path: '*',
        element: <div style={{ padding: '100px 20px', textAlign: 'center' }}>404 - Page Not Found</div>,
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <AdminProductsPage />,
      },
      {
        path: 'categories',
        element: <AdminCategoriesPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
