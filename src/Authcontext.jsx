import { createContext, useEffect, useState, useContext } from "react";
import  supabase  from "./config/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    // SIGN UP NEW USER
    const signUpNewUser = async (email, password,name, occupation = "") => {
        const { data, error } = await supabase.auth.signUp({
             email:email,
             password:password,
             options: {
            data: { name: name, occupation: occupation} 
        }
            });

        if (error) {
            console.error("Error signing up:", error.message);
            return { success: false, error};
        }
         // 2. Insert user into custom 'users' table
        const authUserId = data.user?.id;
        if (authUserId) {
            const { error: tableError } = await supabase
            .from("users")
            .insert([
                { auth_id: authUserId, name, email, occupation }
            ]);
            if (tableError) {
            console.error("Error saving to user table:", tableError.message);
            return { success: false, error: tableError };
            }
        }
        return { success: true, data };
    };

    // SIGN IN

    const signIn = async (email,password) => {
        try{
            const {data,error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
        });
        if(error) {
            console.error("Error signing in:", error.message);
            return { success: false, error};
        }
        console.log(data);
        return { success: true, data }
        }
        catch(error){
            console.error("Error signing in:", error.message);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    //sign out
    const signOut = async () => {
        await supabase.auth.signOut();  
        if(error){
            console.error("Error signing out:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ session, signIn, signUpNewUser, signOut }}>
            {children}
        </AuthContext.Provider>
        )
}


export const useAuth = () => useContext(AuthContext);