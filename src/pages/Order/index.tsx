import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    FlatList
} from 'react-native';

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";

import { ListItem } from '../../components/ListItem';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackPramsList} from '../../routes/app.routs'

//recebento os detalhes da rota
type RouteDetailParams = {
    Order: {
        number: string | number;
        order_id: string;
    }
}

//usando o hoock RouteProp
type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export type CategoryProps = {
    id: string;
    name: string;
}

type ProductProps = {
    id: string;
    name: string;
}

type ItemProps = {
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
}

export default function Order() {

    //usando o hoock RouteProp
    const route = useRoute<OrderRouteProps>();

    //navegar as telas
    const navigation = useNavigation<NativeStackNavigationProp<StackPramsList>>();

    const [category, setCategory] = useState<CategoryProps[] | []>([]); //buscar as categorias na base
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>(); //categoria selecionada
    const [amount, setAmount] = useState('1'); //quantidade digitada
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

    const [products, setProducts] = useState<ProductProps[] | []>([]); //buscar os produtos na base
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>(); //produto selecionado
    const [modalProductVisible, setModalProductVisible] = useState(false); //exibir modal na tela

    const [items, setItems] = useState<ItemProps[]>([]);


    //quando a tela for carregada executa o que tiver aqui dentro
    useEffect(() => {
        async function loadInfo() {
            const response = await api.get('/category');

            //verificando resposta da api no console
            //console.log(response.data);

            //passando as categorias recebidas da api
            setCategory(response.data);
            //passando a categoria selecionada
            setCategorySelected(response.data[0]);
        }

        loadInfo();
    }, [])

    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/category/product', {
                params: {
                    category_id: categorySelected?.id
                }
            })
            // console.log('------------------------------------')
            // console.log(response.data);

            setProducts(response.data);
            setProductSelected(response.data[0]);
        }
        loadProducts();
    }, [categorySelected])



    //função para excluir o pedido da mesa
    async function handleCloseOrder() {
        //Alert.alert('Clicou');
        try {
            await api.delete('/order', {
                params: {
                    order_id: route.params?.order_id
                }
            })

            //volta para a tela anterior
            navigation.goBack();

        } catch (err) {
            console.log(err);
        }
    }

    //receber categoria selecionada e passar para useState
    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item);
    }

    //receber categoria selecionada e passar para useState
    function handleChangeProducts(item: ProductProps) {
        setProductSelected(item);
    }

    //adicionando o produto na mesa
    async function handleAdd() {
        try {
            const response = await api.post('/order/add', {
                order_id: route.params.order_id,
                product_id: productSelected?.id,
                amount: Number(amount)
            })

            console.log(response.data.id);

            let data = {
                id: response.data.id,
                product_id: productSelected?.id as string,
                name: productSelected?.name as string,
                amount: amount
            }

            //oldArray é para pegar todos os items que já tem no array + o que vc está adicionando.
            setItems(oldArray => [...oldArray, data])

        } catch (error) {
            console.error('Error: ', error);
        }

    }

    async function handleDeleteItem(item_id:string) {
        //alert("ID " + item_id);
        await api.delete('/order/item/delete',{
            params:{
                id: item_id
            }
        })

        //apos remover da api remove o item da nossa lista
        let removeItem = items.filter( item => {
            return(item.id !== item_id)
        })

        setItems(removeItem)
    }

    //função que redireciona para a tela FinishOrder e recebe dois parâmetros: number e order_id
    function handleFinishOrder(){
        //alert("Teste")
        navigation.navigate("FinishOrder",{
            number: route.params?.number, 
            order_id: route.params?.order_id
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mesa {route.params.number}</Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        <Feather name="trash-2" size={28} color="#FF3F4b" />
                    </TouchableOpacity>
                )}
            </View>


            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisible(true)}>
                    <Text style={{ color: '#FFF' }}>
                        {categorySelected?.name}
                    </Text>
                </TouchableOpacity>
            )}

            {products.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)}>
                    <Text style={{ color: '#FFF' }}>
                        {productSelected?.name}
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    style={[styles.input, { width: '60%', textAlign: 'center' }]}
                    placeholder="1"
                    placeholderTextColor="#F0F0F0"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
                    disabled={items.length === 0}
                    onPress={handleFinishOrder}
                >
                    <Text
                        style={styles.buttonText}

                    >Avançar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} />}
            />

            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />
            </Modal>

            <Modal
                transparent={true}
                visible={modalProductVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={() => setModalProductVisible(false)}
                    options={products}
                    selectedItem={handleChangeProducts}
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, //pega o tamanho da tela do celular
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%'
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24

    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 14
    },
    input: {
        backgroundColor: '#101026',
        borderRadius: 4,
        width: '100%',
        height: 40,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: '#FFF',
        fontSize: 20

    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF'
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    buttonAdd: {
        width: '20%',
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center'

    }
})