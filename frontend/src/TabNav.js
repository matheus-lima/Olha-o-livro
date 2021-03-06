import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  TabNavigator,
  TabBarBottom,
  StackNavigator
} from 'react-navigation';

import BusinessFacade from './business/BusinessFacade';
import MaterialsScreen from './components/pages/MaterialsScreen';
import MyAccountScreen from './components/pages/MyAccountScreen';
import AnnounceScreen from './components/pages/AnnounceScreen';
import DetailsScreen from './components/pages/DetailsScreen';
import DonatorDetailsScreen from './components/pages/DonatorDetailsScreen';
import MyItemsScreen from './components/pages/MyItemsScreen';
import EditMaterialScreen from './components/pages/EditMaterialScreen';
import EditAccountScreen from './components/pages/EditAccountScreen';
import LoginScreen from './components/pages/LoginScreen';
import CreateAccountScreen from './components/pages/CreateAccountScreen';

const mainColor = new BusinessFacade().getMainColor();

//Controle das cores de navegação.
const navOptions = {
  headerStyle: {
    backgroundColor: mainColor,
  },
  headerTitleStyle: {
    color: 'white',
  },
  headerBackTitleStyle: {
    color: 'white',
  },
  headerTintColor: 'white',
};

//Controle de navegação da aba MATERIAL.
const MaterialNav = StackNavigator(
  {
    Material: {
      screen: MaterialsScreen
    },
    Details: {
      screen: DetailsScreen
    },
    DonatorDetails: {
      screen: DonatorDetailsScreen
    }
  },
  {
    navigationOptions: navOptions
  }
);

//Controle de navegação da aba ANUNCIAR.
const AnnounceNav = StackNavigator(
  {
    Announce: {
      screen: AnnounceScreen
    }
  },
  {
    navigationOptions: navOptions
  }
);

//Controle de navegação da aba MINHA CONTA.
const MyAccountNav = StackNavigator(
  {
    MyAccount: {
      screen: MyAccountScreen
    },
    MyItems: {
      screen: MyItemsScreen
    },
    EditMaterial: {
      screen: EditMaterialScreen
    },
    EditAccount: {
      screen: EditAccountScreen
    },
    Login: {
      screen: LoginScreen
    },
    CreateAccount: {
      screen: CreateAccountScreen
    }
  },
  {
    navigationOptions: navOptions
  }
);


//Componente principal que é exportado pro Index, controla a barra de navevegação inferior.
const TabNav = TabNavigator(
  {
    Material: {
      screen: MaterialNav,
      navigationOptions: {
        tabBarLabel: 'Materiais',
        tabBarIcon: ({ tintColor, focused }) => (
          <Entypo //Componente do icone da barra de navegação inferior
            name={focused ? 'open-book' : 'book'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    Announce: {
      screen: AnnounceNav,
      navigationOptions: {
        tabBarLabel: 'Anunciar',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons //Componente do icone da barra de navegação inferior
            name={focused ? 'ios-megaphone' : 'ios-megaphone-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    MyAccount: {
      screen: MyAccountNav,
      navigationOptions: {
        tabBarLabel: 'Minha conta',
        tabBarIcon: ({ tintColor, focused }) => (
          <MaterialCommunityIcons //Componente do icone da barra de navegação inferior
            name={focused ? 'account' : 'account-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    }
  },
  {
    tabBarOptions: {
      activeTintColor: mainColor,
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
  }
);


export default TabNav;
