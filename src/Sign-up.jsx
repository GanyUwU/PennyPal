import React, { useState } from "react";
import { useAuth } from "./Authcontext";
import { useNavigate } from "react-router-dom";

const neoBrutalStyles = {
    container: {
        background: "#fff200",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial Black, Arial, sans-serif",
    },
    card: {
        background: "#fff",
        border: "4px solid #000",
        boxShadow: "8px 8px 0 #000",
        padding: "2rem",
        borderRadius: "16px",
        width: "350px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#000",
        marginBottom: "1rem",
        textAlign: "center",
        letterSpacing: "2px",
    },
    label: {
        fontWeight: "bold",
        color: "#000",
        marginBottom: "0.5rem",
        fontSize: "1rem",
    },
    input: {
        padding: "0.75rem",
        border: "3px solid #000",
        borderRadius: "8px",
        fontSize: "1rem",
        background: "#fff",
        outline: "none",
        marginBottom: "1rem",
    },
    button: {
        background: "#ff3c00",
        color: "#fff",
        border: "3px solid #000",
        borderRadius: "8px",
        padding: "0.75rem",
        fontWeight: "bold",
        fontSize: "1.1rem",
        cursor: "pointer",
        boxShadow: "4px 4px 0 #000",
        transition: "background 0.2s",
    },
    error: {
        color: "#ff3c00",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: "-1rem",
    },
};

export default function SignUp() {
    const [form, setForm] = useState({ name: "", occupation:"",email: "", password: "" });
    const [error, setError] = useState("");

    const {session, signUpNewUser} = useAuth();
    const navigate = useNavigate();
    console.log(session);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            setError("Please fill all fields.");
            return;
        }
        console.log("Email being sent:", form.email);
        try {
            const res = await signUpNewUser(form.email, form.password,form.name, form.occupation);
            if(res.success){
                navigate('/');
            }
        }
        catch (err) {
            setError("Failed to create account. " + err.message);
        }
    };

    return (
        <div style={neoBrutalStyles.container}>
            <form style={neoBrutalStyles.card} onSubmit={handleSubmit}>
                <div style={neoBrutalStyles.title}>Sign Up</div>
                <label style={neoBrutalStyles.label} htmlFor="name">
                    Name
                </label>
                <input
                    style={neoBrutalStyles.input}
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label style={neoBrutalStyles.label} htmlFor="Occupation">
                    Occupation
                </label>
                <input
                    style={neoBrutalStyles.input}
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    autoComplete="off"
                />

                <label style={neoBrutalStyles.label} htmlFor="email">
                    Email
                </label>
                <input
                    style={neoBrutalStyles.input}
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label style={neoBrutalStyles.label} htmlFor="password">
                    Password
                </label>
                <input
                    style={neoBrutalStyles.input}
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="off"
                />
                {error && <div style={neoBrutalStyles.error}>{error}</div>}
                <button style={neoBrutalStyles.button} type="submit">
                    Create Account
                </button>
                <p style={neoBrutalStyles.label}>
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </form>
        </div>
    );
}