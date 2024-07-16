

//importação do useContext para usar o contexto
import React,  {useContext} from "react";

//componentes utilizados do react-native
import { View, ActivityIndicator } from "react-native";

import AppRoutes from "./app.routs";
import AuthRoutes from "./auth.routes";

//contexto que verifica os dados do usuário logado
import { AuthContext } from "../contexts/AuthContext";

function Routes() {
    //usando o isAuthenticated do AuthContext
    const {isAuthenticated, loading} = useContext(AuthContext)
    

    //se o loading for verdadeiro vai renderizar o spiner ActivityIndicator do react-native
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#1D1D2E',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <ActivityIndicator size={60} color="#FFF" />
            </View>
        )
    }

    return (
        //se estiver logado renderiza AppRoutes se não estiver logado renderiza AuthRoutes
        isAuthenticated ? <AppRoutes /> : <AuthRoutes />
    )
}

export default Routes;