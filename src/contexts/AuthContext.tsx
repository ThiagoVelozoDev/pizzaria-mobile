import React, { useState, createContext, ReactNode, useEffect } from "react";

//api utilizada para manipulações no banco de dados
import { api } from "../services/api";

//biblioteca para salvar localmente
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>
    signOut: () => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
    token: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);


//função para prover dados da autenticação
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    })
    const [loadingAuth, setLoadingAuth]= useState(false);
    const [loading, setLoading] = useState(true);

    //verificando se está logado ou não
    const isAuthenticated = !!user.name;

    //ao recarregar a aplicação executar o que está dentro do useEffect
    useEffect(()=>{
        async function getUser() {
            //pegar os dados salvos do user na base local
            const userInfo = await AsyncStorage.getItem('@sujeitopizzaria');
            //fazendo a conversão para objeto json e caso não tenha nada retorne um objeto vazio
            let hasUser: UserProps = JSON.parse(userInfo || '{}');;

            //verificar se recebemos as informações dele e validar se possue o token
            //caso tenha, retornar as informações do usuário
            if(Object.keys(hasUser).length > 0){
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;

                setUser({
                    id: hasUser.id,
                    name: hasUser.name,
                    email: hasUser.email,
                    token: hasUser.token
                })
            }

            setLoading(false);
        }

        getUser();
    },[])

    //método de login
    async function signIn({ email, password }: SignInProps) {
        //iniciar o carregamento do loading
        setLoadingAuth(true);

        //enviar recebidas da interface na rota para realizar o login
        try{
            const response = await api.post('/session',{
                email,
                password
            })

            //console.log(response.data);

            const {id, name, token} = response.data;

            //recebendo tudo que temos na resposta de dados do usuário
            const data ={
                ...response.data
            }

            //salvando no banco local os dados do usuário. os dados foram feito a conversão para json
            await AsyncStorage.setItem('@sujeitopizzaria',JSON.stringify(data))

            //passando para as próximas requisições na api o token.
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setUser({
                id,
                name,
                email,
                token
            })

            setLoadingAuth(false);

        }catch(err){
            console.log('erro ao acessar', err)
            setLoadingAuth(false);
        }
    }

    //método de deslogar
    async function signOut() {
        //limpando os dados do banco local e do useState
        await AsyncStorage.clear()
        .then(()=>{
            setUser({
                id: '',
                name: '',
                email: '',
                token: ''
            })
        })
    }

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                isAuthenticated, 
                signIn, 
                signOut, 
                loadingAuth, 
                loading 
            }}>
            {children}
        </AuthContext.Provider>
    )
}