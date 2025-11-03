import React,{useEffect} from "react";
import AppRouter from "./routes/AppRouter";
import { SonnerToaster } from './components/ui/sonner-toaster';
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./utils/navigateHelper";

function App() {

  const navigate = useNavigate();
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <>
      <SonnerToaster />
      <AppRouter />
    </>
  );
}

export default App;
