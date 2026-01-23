import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import Router from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <Toaster position="top-right" reverseOrder={false}/>
          <Router />
        </ChatProvider>
      </AuthProvider>
      {/* React Query Devtools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
