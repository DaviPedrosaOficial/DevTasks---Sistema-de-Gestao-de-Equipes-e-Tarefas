import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#27272a",
            color: "#fff",
            border: "1px solid #3f3f46",
          },
        }}
      />

      <AppRoutes />
    </>
  );
}

export default App;
