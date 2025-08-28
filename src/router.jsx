import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "./Sign-up";
import SignIn from "./Sign-in";

export  const router = createBrowserRouter([
    {path: '/', element: <App /> },
    {path: '/signup', element: <SignUp /> },
    {path: '/signin', element: <SignIn /> },
    
]);