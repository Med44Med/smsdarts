import WebSocketWrapper from "./context/webSocketContext";
import Routes from "./routes/Routes";
import AuthContextWrapper from "@/context/AuthContext";

function App() {
  return (
    <>
      <AuthContextWrapper>
        <WebSocketWrapper>
          <Routes />
        </WebSocketWrapper>
      </AuthContextWrapper>
    </>
  );
}

export default App;
