# Olha o Livro!
__Backend__: API Restful feita em **NodeJS** + **Express** + **MongoDB**

__Frontend__: Aplicação Mobile Nativa para Android e iOS feito em **React Native**.

Para testar a aplicação, vá para [Execução](#execução).

Para visualizar os Padrões de Projetos Implementados, vá para [Padrões](#padrões-de-projetos-implementados).

## Documento de requisitos

[Documento de requisitos do projeto](MPS_DocumentoDeRequisitos_Olha_O_Livro.pdf)

## Screenshots
Materiais             |  Minha Conta
:-------------------------:|:-------------------------:
![](/images/app2.jpg)  |  ![](/images/app1.jpg)

## Diagrama de Classes

![](/images/diagrama-de-classes.png)
[Link para melhor visualização](https://drive.google.com/file/d/1hPq59W4qblZldZfL5nnQ3yYx2V-ix-E4/view?usp=sharing)

## Padrões de Projetos Implementados

### Criação

* [Singleton](#singleton)
* [Abstract Factory](#abstract-factory)
* [Factory Method](#factory-method)

### Estrutural

* [Facade](#facade)
* [Proxy](#proxy)
* [Decorator](#decorator)

### Comportamental

* [Iterator](#iterator)

## Implemetações

### Singleton

O padrão **Singleton** por se tratar de um padrão criacional, possibilitou que seu uso fosse feito em várias partes. Tais utilizações foram feitas isoladamente em alguns casos, como também em conjunto com outro padrão que foi o *Factory Method*.

A principio utilizousse o *Singleton* para que houvesse uma única instância para cada um dos dois *Factorys Methods*, trazendo assim maior controle para a gerência das instâncias desse outro padrão.

O *Singleton* também foi utilizado em conjunto com o banco de dados, com a mesma intenção, que é de facilitar a gerência das instâncias que acessam ao banco de dados.

Segue abaixo trechos dos códigos respectivos a implementação do padrão e a utilização dele junto à outras entidades.
```js
// Arquivo frontend/src/business/control/material/MaterialFactory

...

let instance = null;

export default class MaterialFactory extends MaterialAbstractFactory {
    
    constructor() { 
        super();
        
        if (!instance) {
            instance = this;
        }

        return instance;
    }
    
    ...
}

```

```js
// Arquivo frontend/src/business/control/user/UserFactory

...

let instance = null;

export default class UserFactory extends UserAbstractFactory {
    
    constructor() { 
        super();
        
        if (!instance) {
            instance = this;
        }

        return instance;
    }
    
    ...
}

```

```js
// Arquivo backend/src/infra/api/DAO/UserDAO

...


let _instance = null;

class UserDAO{

    constructor () {
        if (!_instance) _instance = this;

        return _instance;
    }
    ...
}

```

```js
// Arquivo backend/src/infra/api/DAO/MaterialDAO

...


let _instance = null;

class MaterialDAO{

    constructor () {
        if (!_instance) _instance = this;

        return _instance;
    }
    ...
}

```


### Proxy

O padrão **Proxy** foi utiliziado com o intuíto de limitar o acesso às operações com o banco de dados, o que impede o acesso para quem não possui a permissão necessária.

O padrão foi implementado tanto para a manipulação dos dados do usuário quanto dos materiais.

Segue abaixo trechos de códigos de onde o padrão foi utilizado.

```js
// Arquivo backend/src/infra/api/DAO/UserDAOProxy

...

class UserDAOProxy{
    constructor(){
        this.dao = new UserDAO();
    }

    insert (req, res){
        if (this._defaultValidation(req.headers)){
            this.dao.insert(req.body, res);

        }else{
            res.send({'error' : true, 'message' : 'Sem permissão!'});
        }
    }
    ...

    _defaultValidation (headers) {
        return (headers.token && (headers.token === "oolivro" ||                 headers.token === "oolivroadm"));
    }
}
```

```js
// Arquivo backend/src/infra/api/DAO/MaterialDAOProxy

...

class MaterialDAOProxy{
    constructor(){
        this.dao = new MaterialDAO();
    }

    insert (req, res){
        if (this._defaultValidation(req.headers)){
            this.dao.insert(req.body, res);

        }else{
            res.send({'error' : true, 'message' : 'Sem permissão!'});
        }
    }
    ...

    _defaultValidation (headers) {
        return (headers.token && (headers.token === "oolivro" || headers.token === "oolivroadm"));
    }
}
```

### Decorator

O padrão **Decorator** foi utilizada para possibilitar uma maior flexibilidade da interface de controle do usuário, quanto ao uso de validadores de dados. Com isso, é possível se aproveitar do polimorfísmo que a utilização da interface provê (apesar do Javascript não levar isso em consideração durante a execução, mas utiliza-se para fins estruturais dos projeto) e possibilitar a utilização de diferentes classes de validação de dados do usuário.

Segue abaixo trechos de códigos das partes que compõem a implementação do padrão Decorator e a implementação de uma classe de controle de usuário concreta utilizando a classe do padrão.

```js
// Arquivo backend/src/business/control/Control

class Control{
    constructor () {}

    execute () {}
}


// Arquivo backend/src/business/control/user/UserControl

...

class UserControl extends Control{
    constructor (userDao ,daoOperation) {
        super();
        this.userDao = userDao;
        this.daoOperation = daoOperation;
    }

    execute(req, res){
        this.userDao[this.daoOperation](req, res)
    }

    getDaoOperation () {
        return this.daoOperation;
    }

    getUserDao() {
        return this.userDao;
    }
}

// Arquivo backend/src/business/control/user/UserControlDecorator

...

class UserControlDecorator extends UserControl{
    constructor (userControl){
        super(userControl.getUserDao(), userControl.getDaoOperation());
        this.control = userControl;
    }

    execute (req, res) {
        this.control.execute(req, res);
    }
}

// Arquivo backend/src/business/control/user/UserRemoveControl

...

class UserRemoveControl extends UserControlDecorator{
    constructor (userControl, voidValidator) {
        super(userControl);
        this.voidValidator = voidValidator
    }

    execute (req, res) {
        let message = '';

        message = this.voidValidator.valid(req.query)
        
        if (message !== ''){
            res.send({'error' : true, 'message' : message});

        } else {
            super.execute(req, res);
        }
    }
}

```


### Iterator

O padrão **Iterator** foi utilizado para que fossemos capazes de acessar um conjunto de objetos do tipo *Material* de forma sequêncial, sem que houvesse a necessidade de conhecer intimamente a estrutura desse objeto.  

A implementação do padrão também permitiu a possibilidade do acesso à outros conjuntos de objetos caso sejam necessários futuramente, de forma mais simplificada e proporcionando que haja um menor acoplamento entre os conjuntos de objetos a serem iterados, e as entidades que utilizam os conjuntos.

Outro ponto que vale ressalva além dos citados anteriormente, é que caso haja a necessidade de alteração na forma de acesso dos itens do conjunto, essa alteração tornou-se simplificada e disponível para reutilização por outros conjuntos de objetos do mesmo tipo, ou tipos diferentes.

Segue abaixo trechos dos códigos respectivos a implementação do padrão e a utilização dele junto à outras entidades.
```js
// Arquivo frontend/src/business/Iterator

export default class Iterator {
  constructor() {
  }

  first() {
    throw new Error('Abstract method!');
  }

  next() {
    throw new Error('Abstract method!');
  }

  isDone() {
    throw new Error('Abstract method!');
  }

  currentItem() {
    throw new Error('Abstract method!');
  }
}

```

```js
// Arquivo frontend/src/business/control/material/MaterialsIterator

...
export default class MaterialsIterator extends Iterator {
  constructor(aggregate) {
    super();
    this.index = 0;
    this.aggregate = aggregate;
  }

  first() {
    return this.aggregate.list[0];
  }

  next() {
    this.index += 1;
    return this.aggregate.list[this.index];
  }

  isDone() {
    return this.index === this.aggregate.list.length;
  }

  currentItem() {
    if (this.isDone()) {
      this.index = this.aggregate.list.length - 1;
    } else if (this.index < 0) {
      this.index = 0;
    }
    return this.aggregate.list[this.index];
  }
}

```

```js
// Arquivo frontend/src/business/Aggregate

export default class Aggregate {
  constructor() {
  }

  createIterator() {
    throw new Error('Abstract method!');
  }
}

```

```js
// Arquivo frontend/src/business/control/material/MaterialsAggretate

...
export default class MaterialsAggregate extends Aggregate {
  constructor(list) {
    super();
    this.list = list;
  }

  createIterator() {
    this.iterator = new MaterialsIterator(this);
  }
}

```

```js
// Arquivo frontend/src/business/BusinessFacade
...
getMaterialsAggregate(list) {
    return new MaterialsAggregate(list);
  }

...

```

```js
// Arquivo frontend/src/components/MaterialDetails

...
  buildDonator() {
    const donatorID = this.state.material.donator;
    const nav = this.props.navigation;
    this.businessFacade.getAllMyMaterials(donatorID, (isSuccess, res) => {
      if (isSuccess) {
        let alreadyHelped = 0;
        let registeredMaterials = 0;
        registeredMaterials = res.length;
        const materialsAggregate = this.businessFacade.getMaterialsAggregate(res);
        for (
          materialsAggregate.createIterator(res); 
          !materialsAggregate.iterator.isDone(); 
          materialsAggregate.iterator.next()) {
          const material = materialsAggregate.iterator.currentItem();
          if (!material.available) {
            alreadyHelped++;
          }
        }
        const donator = this.state.donator;
        donator.alreadyHelped = alreadyHelped;
        donator.registeredMaterials = registeredMaterials;
        nav.navigate('DonatorDetails', { donator });
      }
    });
  }
...

```

### Facade

O padrão **Facade** foi utilizado para centralizar e facilitar a utilização de vários subsistemas dentro do nosso sistema. A sua implementação possibilitou o desacoplamento entre a parte de *View* do sistema e os subsistemas da parte do *Business*, fazendo com que a View mantivesse comunicação apenas com a Facade, e essa por consequência se comunicaria com as partes desejadas do sistema.

Segue abaixo trechos do código respectivo a implementação do padrão. 
```js
// Arquivo frontend/src/business/BusinessFacade

import MaterialFactory from './control/material/MaterialFactory';
import MaterialRegisterForm from './control/material/MaterialRegisterForm';
import MaterialEditForm from './control/material/MaterialEditForm';
import ListMaterials from './control/material/ListMaterials';
import UserEditForm from './control/user/UserEditForm';
import UserRegisterForm from './control/user/UserRegisterForm';
import UserLoginForm from './control/user/UserLoginForm';
import UserFactory from './control/user/UserFactory';
import UserGetDonator from './control/user/UserGetDonator';
import { mainColor } from './util/colors';
import MaterialsAggregate from './control/material/MaterialsAggregate';

let currentUserLogged = null;

export default class BusinessFacade {
  constructor() {
    this.materialFactory = new MaterialFactory(); // Singleton
    this.userFactory = new UserFactory(); // Singleton

    // Material
    this.materialRegisterForm = new MaterialRegisterForm();
    this.materialEditForm = new MaterialEditForm();
    this.listMaterials = new ListMaterials();

    // User
    this.userRegisterForm = new UserRegisterForm();
    this.userEditForm = new UserEditForm();
    this.userLoginForm = new UserLoginForm();
    this.userGetDonator = new UserGetDonator();
  }

  // MaterialFactory methods
  getMaterial(type) {
    return this.materialFactory.getMaterial(type);
  }

  // UserFactory methods
  getUser(type) {
    return this.userFactory.getUser(type);
  }

  /***** Materials Methods *****/

  // ListMaterials Methods
  
  getListAllMaterials(promisse) {
    this.listMaterials.getListAllMaterials((isSuccess, res) =>
      this.handlePromisseResponse(isSuccess, res, promisse));
  }

  getAllMyMaterials(donatorID, promisse) {
    this.listMaterials.getListAllMaterials((isSuccess, res) => {
      if (isSuccess) {
        const myItems = [];
        const materials = res.data.data;
        for (let index = 0; index < materials.length; index++) {
          const material = materials[index];
          if (material.donator === donatorID) {
            myItems.push(material);
          }
        }
        promisse(isSuccess, myItems);
      } else {
        this.handlePromisseResponse(isSuccess, res, promisse);
      }
    });
  }

  getDataMaterial(material, promisse) {
    this.listMaterials.getMaterial(material, 
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  getMaterialCategory(category, promisse) {
    this.listMaterials.getMaterialCategory(category,
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  getMaterialTitle(title, promisse) {
    this.listMaterials.getMaterialTitle(title,
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  // MaterialRegister Methods
  
  registerMaterial(material, promisse) {
    this.materialRegisterForm.registerMaterial(material, 
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  // MaterialEditForm Methods

  deleteMaterial(material, promisse) {
    this.materialEditForm.deleteMaterial(material,
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  editMaterial(material, promisse) {
    this.materialEditForm.editMaterial(material,
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  increasesMaterialRate(material, promisse) {
    this.materialEditForm.increasesMaterialRate(material,
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  getMaterialsAggregate(list) {
    return new MaterialsAggregate(list);
  }

  /***** User Methods *****/

  /* UserEditForm Methods */
  registerUser(user, promisse) {
    this.userRegisterForm.registerUser(user,
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  /* UserLoginForm Methods */ 

  loginUser(user, promisse) {
    this.userLoginForm.getUserLogin(user,
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  getCurrentUser(response) {
    if (!currentUserLogged) {
      // Usuario ainda nao foi criado
      this.userLoginForm.getCurrentUser(user => {
        // console.log('[Facade - getCurrentUser] user do business');
        // console.log(user);
        if (user) {
          currentUserLogged = user;
          response(user);
        } else {
          response(false);
        }
      });
    } else {
      // Usuario ja foi criado
      // console.log('[Facade - getCurrentUser] usuario ja salvo e recuperado');
      response(currentUserLogged);
    }
  }

  /* UserEditForm Methods */

  signOut() {
    this.userEditForm.deleteCurrentUser();
    currentUserLogged = null;
  }

  deleteCurrentUser(promisse) {
    this.getCurrentUser(user => {
      if (user) {
        // console.log(`[Facade - deleteCurrentUser] Deletando ${user.mail}`);
        this.userEditForm.deleteUser(user,
          (isSuccess, res) => {
            currentUserLogged = null;
            this.handlePromisseResponse(isSuccess, res, promisse);
          });
      }
    });
  }

  updateUser(user, promisse) {
    this.userEditForm.editUser(user,
      (isSuccess, res) => {
        if (!res.data.error) {
          currentUserLogged = user;
        }
        this.handlePromisseResponse(isSuccess, res, promisse);
      });
  }

  /* UserGetDonator */
  getDataDonator(donatorID, promisse) {
    this.userGetDonator.getDonator(donatorID, 
      (isSuccess, res) => this.handlePromisseResponse(isSuccess, res, promisse));
  }

  // util.colors Methods
  getMainColor() {
    return mainColor;
  }

  // helper
  handlePromisseResponse(isSuccess, res, promisse) {
    if (isSuccess) {
      // console.log('[Facade - handlePromisseResponse] Conectou ao DB!');
      const data = res.data;
      if (!data.error) {
        // console.log('[Facade - handlePromisseResponse] Query Sucesso!');
        promisse(true, data.data);
      } else {
        // console.log('[Facade - handlePromisseResponse] Query Falhou!');
        // console.log(res.data);
        promisse(false, res.data);
      }
    } else {
      // console.log('[Facade - handlePromisseResponse] Nao Conectou ao DB!');
      // console.log(res);
      promisse(false, res);
    }
  }
}


```

### Abstract Factory

O padrão **Abstract Factory** possibilitou que famlias de entidades que tem algum relacionamento, pudessem ser criadas de diferentes formas atraves de uma implementação concreta da interface que foi provida pelo padrão. Isso fez com que o sistema ganhasse em estabilidade, pois a implementação do padrão é uma implementação estavel, e facilita uma possível extensão para implementação de novas familias que a principio não existem na primeira versão da aplicação.

Esse padrão também interage diretamente com outro padrão que é o *Factory Method* e que será exposto em seguida.

Segue abaixo trechos do código respectivo a implementação do padrão.
```js
// Arquivo frontend/src/business/control/material/MaterialAbstractFactory

export default class MaterialAbstractFactory {
    constructor() { 

    }
    createMaterial() {
        throw new Error("Abstract method!");
    }
    createPhysicalMaterial() {
        throw new Error("Abstract method!");
    }
    createVirtualMaterial() {
        throw new Error("Abstract method!");
    }
}

```

```js
// Arquivo frontend/src/business/control/user/UserAbstractFactory

export default class UserAbstractFactory {
    constructor() { 

    }
    createUser() {
        throw new Error("Abstract method!");
    }
    createUserAdm() {
        throw new Error("Abstract method!");
    }
    createUserDonator() {
        throw new Error("Abstract method!");
    }
}

```

### Factory Method

O padrão **Factory Method** foi utilizado em conjunto com o *Abstract Factory* na parte do *Business Control* do sistema, para criação de famílias de objetos que tem um mesmo domínio, mas dando oportunidade a subclasse decidir qual seria o objeto criado.

No servidor o **Factory Method** foi utilizado para a instanciação dos objetos das classes de controle de Usuário e de Materiais.

Segue abaixo trechos do código respectivo a implementação do padrão.

```js
// Arquivo frontend/src/business/control/material/MaterialFactory

export default class MaterialFactory extends MaterialAbstractFactory {
    
    ...

    getMaterial(type) {
        switch (type) {
            case 'material':
                return this.createMaterial();
            case 'physicalMaterial':
                return this.createPhysicalMaterial();
            case 'virtualMaterial':
                return this.createVirtualMaterial();
            default:
                throw new Error("Material type error!");
        }
    }

    createMaterial() {
        return new Material();
    }

    createPhysicalMaterial() {
        return new PhysicalMaterial();
    }

    createVirtualMaterial() {
        return new VirtualMaterial();
    }
}

```

```js
// Arquivo frontend/src/business/control/user/UserFactory

export default class UserFactory extends UserAbstractFactory {
    
    ...

    getMaterial(type) {
        switch (type) {
            case 'user':
                return this.createUser();
            case 'userAdm':
                return this.createUserAdm();
            case 'userDonator':
                return this.createUserDonator();
            default:
                throw new Error("Material type error!");
        }
    }

    createUser() {
        return new User();
    }

    createUserAdm() {
        return new UserAdm();
    }

    createUserDonator() {
        return new UserDonator();
    }
}

```

```js
// Arquivo backend/src/business/control/user/UserControlFactory

...

class UserControlFactory{

    constructor () {
        this.controls = {}
        this.controls.register = new UserRegisterControl(new UserControl(new UserDaoProxy(), 'insert'),
                                                         new UserCompleteValidator());
        this.controls.edit = new UserEditControl (new UserControl(new UserDaoProxy(), 'update'),
                                                  new UserCompleteValidator());
        this.controls.donator = new DonatorDetailControl(new UserControl(new UserDaoProxy(), 'find'),
                                                     new VoidValidator());
        this.controls.login = new LoginControl(new UserControl(new UserDaoProxy(), 'login'),
                                               new LoginValidator());
        this.controls.remove = new UserRemoveControl(new UserControl(new UserDaoProxy(), 'remove'),
                                                     new VoidValidator());
        this.controls.report = new UserReportControl(new UserControl(new UserDaoProxy(), 'report'));
    }

    getControl (controlType) {
        return this.controls[controlType];
    }
}

```

```js
// Arquivo backend/src/business/control/material/MaterialControlFactory

...

class MaterialControlFactory{
    constructor () {
        this.controls = {};
        this.controls.list = ListMaterialControl;
        this.controls.delete = MaterialDeleteControl;
        this.controls.rate = MaterialRateControl;
        this.controls.search = SearchMaterialControl;
        this.controls.detail = MaterialDetailControl;
        this.controls.edit = MaterialEditControl;
        this.controls.register = MaterialRegisterControl;
        this.controls.all = MaterialListAllControl;
        this.controls.report = MaterialReportControl;
    }

    getControl (controlType) {
        let control = this.controls[controlType];

        return new control(new MaterialDaoProxy());
    }
}

```

## Rotas API Olha o Livro!

URL = localhost:3003/api

Rota                       | Request | Passagem de dado                   |Descrição 
-----------                | ------  | -----------                        |---------
URL/user                   | POST    | Todos os dados no usuário pelo body|Cria usuário
URL/user                   | PUT     | Todos os dados do usuário pelo body com o rótulo '_id' (String)          |Atualiza usuário
URL/user/                  | DELETE  | Passagem do 'id' como parâmetro |Deleta usuário
URL/user/login             | GET     | Passagem por parâmetro: E-mail com o rótulo 'mail' e a senha pelo rótulo 'password' |Efetua login
URL/user/donator/:id       | GET     | Passagem do 'id' como parâmetro |Recupera dados do doador
URL/user/get/report        | GET     | Não precisa de nenhum parâmetro |Retorna um json com informações sobre os usuários em geral cadastrados no sistema
URL/material               | POST    | Todos os do material pelo body|Cria Material
URL/material/:id           | GET     | Passagem do 'id' como parâmetro |Recupera material
URL/material/              | PUT     | Todos os dados do material com o rótulo '_id' (String) | Atualiza material
URL/material/              | DELETE  | Passagem do 'id' como parâmetro|Deleta material
URL/material/list/:category| GET     | Passagem da categoria como parâmentro pelo rótulo 'category'|Recupera lista de materiais
URL/material/search/:title | GET     | Passagem do titulo como parâmentro pelo rótulo 'title'|Busca Material
URL/material/rate          | PUT     | Passagem do id pelo body com o rótulo '_id'|Atualiza nota do material
URL/material/get/all       | GET     | Não precisa de nenhum parâmetro    | Pegar todos os materiais do banco
URL/material/get/report    | GET     | Não precisa de nenhum parâmetro |Retorna um json com informações sobre os materiais em geral cadastrados no sistema


## Execução
### Instale as dependencias:
#### Backend
```console
    cd backend && npm install
```
#### Frontend
```console
    cd frontend && npm install && react-native link
```

### Inicie o mongodb

```console
    mongod
```

### Inicie o backend
#### Para dev

```console
    cd backend && npm run dev
```
#### Para produção

```console
    cd backend && npm run prod
```

### Inicie a aplicação React Native
#### Para iOS
```console
    react-native run-ios
```

#### Para Android
```console
    react-native run-android
```