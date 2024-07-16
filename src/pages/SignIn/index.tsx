import React, { useState, useContext } from "react";

//contexto de Autenticação
import { AuthContext } from "../../contexts/AuthContext";

//componentes utilizados na aplicação
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

export default function SignIn() {
    //usando o contexto de autencitação do usuário
    const { signIn, loadingAuth } = useContext(AuthContext);

    //useState
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //função para verificar se os campos não estão vazios
    async function handleLogin() {
        if (email === '' || password === '') {
            return;
        }

        await signIn({ email, password });

    }

    //renderização dos componentes em tela
    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../assets/logo.png')}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#F0F0F0"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#F0F0F0"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                {/*
                    -- ActivityIndicator -- é o spiner que fica girando no botão
                    -- é controlado pelo loading

                    --quando coloca dessa forma é devido renderizar se for verdadeiro se não para: 
                        { loadingAuth ?(
                           
                        ):(
                        
                        )}
                
                */}

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    {loadingAuth ? (
                    <ActivityIndicator size={25} color="#FFF"/>
                    ): (
                    <Text style={styles.buttonText}>Acessar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>

    )
}

//estilização da página com o grupo de estilos StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d1d2e'
    },
    logo: {
        marginBottom: 18
    },
    inputContainer: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 34,
        paddingHorizontal: 14
    },
    input: {
        width: '95%',
        height: 40,
        backgroundColor: '#101026',
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: '#FFF'
    },
    button: {
        width: '95%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101026'
    }
})