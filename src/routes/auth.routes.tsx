import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../pages/SignIn";

const Stack = createNativeStackNavigator();

//somente usuários não logados podem acessar
function AuthRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
}

export default AuthRoutes;