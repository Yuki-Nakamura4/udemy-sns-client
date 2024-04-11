import apiClient from "@/lib/apiClient";
import React, {ReactNode, useContext, useEffect, useState} from "react"

interface AuthContextType {
    user: null | {id:number, username: string, email:string}
    login: (token: string) => void;
    logout:  () => void
}

interface AuthProviderProps {
    children: ReactNode; // ReactNodeはReactコンポーネントが子要素（children）として受け入れられるデータ型を表す
}

const AuthContext = React.createContext<AuthContextType>({
    user:null,
    login: () => {},
    logout: () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<null |{id: number; email:string; username: string;}>(null);

    useEffect(() => {
        const token = localStorage.getItem("auth_token")
        if(token){
        apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

        apiClient.get("/users/find").then((res) => {
            setUser(res.data.user)
        }).catch((err)=>{
            console.log(err)
        })
        }
    },[])

    const login = async (token: string) => {
        localStorage.setItem("auth_token", token); // 受け取ったトークンをローカルストレージにセット
        apiClient.defaults.headers["Authorization"] = `Bearer ${token}`; // Axiosのリクエストヘッダーに認証トークンをセット

        try {
            apiClient.get("/users/find").then((res) => {
                setUser(res.data.user)
            })
        }catch(err){
            console.log(err)
        }
    }

    const logout = () => {
        localStorage.removeItem("auth_token");
        delete apiClient.defaults.headers["Authorization"];
        setUser(null);
    };

    const value = {
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value= {value}>{children}</AuthContext.Provider> // valueの値をchildrenに共有してどこでも使えるようにする
    )
}