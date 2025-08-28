import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Authcontext";


const neoBrutalStyles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9f871",
    },
    card: {
        background: "#fff",
        border: "4px solid #222",
        borderRadius: "16px",
        boxShadow: "8px 8px 0 #222",
        padding: "2rem",
        width: "350px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#222",
        textShadow: "2px 2px 0 #f9f871",
        marginBottom: "1rem",
        letterSpacing: "2px",
    },
    input: {
        padding: "0.75rem",
        border: "3px solid #222",
        borderRadius: "8px",
        fontSize: "1rem",
        background: "#f9f871",
        color: "#222",
        outline: "none",
        marginBottom: "1rem",
        boxShadow: "2px 2px 0 #222",
    },
    button: {
        padding: "0.75rem",
        background: "#222",
        color: "#fff",
        border: "3px solid #222",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "1rem",
        cursor: "pointer",
        boxShadow: "2px 2px 0 #f9f871",
        transition: "background 0.2s",
    },
    error: {
        color: "#e63946",
        fontWeight: "bold",
        marginBottom: "1rem",
        textShadow: "1px 1px 0 #fff",
    },
};

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const{ session, signIn } = useAuth();
    const navigate = useNavigate();
    console.log(session);

    const handleSignIn =async (e) => {
        e.preventDefault();
        // Dummy validation
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        try{
            const res= await signIn(email,password);
            if(res.success){
                navigate("/"); // Redirect to dashboard on successful sign-in
            }
        }
        catch(err){
            setError("Failed to sign in. Please check your credentials.");
        }
    };

    return (
        <div style={neoBrutalStyles.container}>
            <form style={neoBrutalStyles.card} onSubmit={handleSignIn}>
                <div style={neoBrutalStyles.title}>Sign In</div>
                {error && <div style={neoBrutalStyles.error}>{error}</div>}
                <input
                    style={neoBrutalStyles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                />
                <input
                    style={neoBrutalStyles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button style={neoBrutalStyles.button} type="submit">
                    Sign In
                </button>
                <p className="text-sm text-gray-600">
                    Don't have an account? <a href="/signup" className="text-blue-600 font-bold">Sign Up</a>
                </p>
            </form>
        </div>
    );
}