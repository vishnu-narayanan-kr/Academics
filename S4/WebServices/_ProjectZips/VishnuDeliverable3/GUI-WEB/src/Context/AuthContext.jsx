import { createContext, useState } from "react"

export const Auth = createContext({});

export const AuthContext = ({ children }) => {

    const [ authUser, setAuthUser ] = useState({});
    
    return (
        <Auth.Provider value={{ authUser, setAuthUser }}>
            {children}
        </Auth.Provider>
    );
}