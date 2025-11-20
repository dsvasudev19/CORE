import { Toaster } from "react-hot-toast";
import "./App.css";
import Router from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Toaster position="top-right" reverseOrder={false}/>
        <Router />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
