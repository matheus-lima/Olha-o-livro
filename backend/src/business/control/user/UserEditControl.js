/*
    Classe para controlar a atualização de dados de um usuário
*/
const UserControlDecorator = require('./UserControlDecorator');

class UserEditControl extends UserControlDecorator{
    constructor (userControl, completeValidator) {
        super(userControl);
        this.completeValidator = completeValidator;
    }

    execute (req, res) {
        let message = '';

        message = this.completeValidator.valid(req.body);

        if (message !== ''){
            res.send({'error' : true, 'message' : message});
        } else {
            super.execute(req, res);
        }
    }
}

module.exports = UserEditControl;