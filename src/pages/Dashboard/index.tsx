import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackPramsList } from "../../routes/app.routs";
import { api } from '../../services/api';

//componentes da aplicação
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert
} from 'react-native';

//contexto da aplicação
import { AuthContext } from "../../contexts/AuthContext";

//renderização dos componentes
export default function Dashboard() {

    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

    //useState para pegar a mesa informada
    const [number, setNumber] = useState('');

    //chamando o método para deslogar o usuário do contexto da aplicação
    const { signOut } = useContext(AuthContext);

    //abrir mesa
    async function openOrder() {
        //verificando se está tentando enviar null
        if (number === '') {
            return;
        }

        //criando order
        try {
            const response = await api.post('/order', {
                table: Number(number)
                
            })

            //console.log(response.data);
            //precisa fazer a requisição e abrir a mesa e navegar para a proxima tela
             navigation.navigate('Order', {number: number, order_id: response.data.id})

             //limpando os campos
             setNumber('');

        }catch(error){
            Alert.alert("Já existe pedido para essa mesa");
        }

        
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo pedido</Text>
            <TextInput
                style={styles.input}
                placeholder="Numero da mesa"
                placeholderTextColor="#F0F0F0"
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text>Abrir Mesa</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#1d1d2e'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 24
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 22,
        color: '#FFF'
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold'
    }
})