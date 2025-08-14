import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { DataProvider } from "./contexts/DataContext";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { StripeProvider } from "./contexts/StripeContext";
import { MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountProvider } from "./contexts/AccountContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <DataProvider>
              <AccountProvider>
                <UserPreferencesProvider>
                  <NotificationsProvider>
                    <StripeProvider>
                      <App />
                    </StripeProvider>
                  </NotificationsProvider>
                </UserPreferencesProvider>
              </AccountProvider>
            </DataProvider>
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>
);
