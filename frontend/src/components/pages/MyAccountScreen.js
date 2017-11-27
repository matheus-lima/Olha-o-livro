import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback
} from 'react-native';

import ImageHeader from '../ImageHeader';
import { UserDonator } from '../../business/model/user';
import BusinessFacade from '../../business/BusinessFacade';
import MyAccountNav from '../MyAccountNav';

// Responsavel pela tela inicial da aba de navegação MyAccount
// Renderiza os componentes ImageHeader e MyAccountNav
export default class MyAccountScreen extends Component {
    constructor(props) {
        super(props)
        this._businessFacade = new BusinessFacade();
        this.state = {
            donator: {},
            name: "",
            mail: "",
            phone: "",
            imageURL: "",
            materials: [],
            from: '',
        }
        this._onPress = this._onPress.bind(this)
    }

    // inicializa o objeto de teste
    componentWillMount() {
        let donator = new UserDonator();
        donator.name = "Donator 1";
        donator.mail = "donator@olhaolivro.com";
        donator.phone = "(83) 9 9988-8899";
        donator.imageURL = "https://scontent.frec3-2.fna.fbcdn.net/v/t1.0-9/20292831_1563732526991471_5299144803312892119_n.jpg?oh=82be979c7aebcc7dac4a9d6599e4e7a5&oe=5AA57AA0";
        donator.materials = [
            this._businessFacade.createMaterial(),
            this._businessFacade.createMaterial(),
            this._businessFacade.createMaterial(),
            this._businessFacade.createMaterial()
        ];
        donator.from = 'UFPB';

        this.setState({ ...this.state, donator })
    }

    _onPress(editAccount) {
        //console.log(this.state.material.title)
        if (editAccount === 'edit') {
            this.props.navigation.navigate('EditAccount', { donator: this.state.donator })
        } else {
            this.props.navigation.navigate('MyItems', { donator: this.state.donator })
        }
    }

    static navigationOptions = {
        title: 'Minha Conta'
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageHeader
                    imageURL={this.state.donator.imageURL}
                    circle
                    title={this.state.donator.name}
                    local={this.state.donator.from}
                />
                <MyAccountNav _onPress={this._onPress} />
            </View>
        )
    }
}

