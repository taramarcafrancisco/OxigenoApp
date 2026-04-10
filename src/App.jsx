import { Toaster } from "./components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import UserPlans from "./pages/UserPlans";
import NavigationTracker from "./lib/NavigationTracker";
import { pagesConfig } from "./pages.config";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "./lib/AuthContext";
import Planes from "./pages/Planes";
import RequireAuth from "./lib/RequireAuth";
import ProductDetail from "./pages/ProductDetail";
import Contacto from "./pages/Contacto";
import Usage from "./pages/Usage";

import Settings from "./pages/Settings";

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    <>{children}</>
  );

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        }
      />

      <Route element={<RequireAuth />}>
        {Object.entries(Pages).map(([path, Page]) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                <Page />
              </LayoutWrapper>
            }
          />
        ))}

        <Route
          path="/planes"
          element={
            <LayoutWrapper currentPageName="planes">
              <Planes />
            </LayoutWrapper>
          }
        />

        <Route
          path="/consumo"
          element={
            <LayoutWrapper currentPageName="consumo">
              <Usage />
            </LayoutWrapper>
          }
        />

        <Route
          path="/settings"
          element={
            <LayoutWrapper currentPageName="settings">
              <Settings />
            </LayoutWrapper>
          }
        />

        <Route
          path="/contacto"
          element={
            <LayoutWrapper currentPageName="contacto">
              <Contacto />
            </LayoutWrapper>
          }
        />
        <Route
          path="/user-plans/:id"
          element={
            <LayoutWrapper currentPageName="user-plans">
              <UserPlans />
            </LayoutWrapper>
          }
        />

        <Route
          path="/my-plan/:productId"
          element={
            <LayoutWrapper currentPageName="my-plan">
              <ProductDetail />
            </LayoutWrapper>
          }
        />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router basename="/ui">
          <NavigationTracker />
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
