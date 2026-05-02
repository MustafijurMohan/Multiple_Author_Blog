import { createContext, useContext, useEffect, useState } from "react";


export const AuthContext = createContext()
export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(() => localStorage.getItem('token') || null)
    const [user,  setUser]  = useState(() => {
        try { return JSON.parse(localStorage.getItem("user")) || null; }
        catch { return null; }
    });



    // ── Sync token → localStorage ─────────────────────────────────────────────
    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else       localStorage.removeItem("token");
    }, [token]);

        // ── Sync user → localStorage ──────────────────────────────────────────────
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else      localStorage.removeItem("user");
    }, [user]);





    const value = {token, setToken, user,  setUser}

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
//     return context;
// };