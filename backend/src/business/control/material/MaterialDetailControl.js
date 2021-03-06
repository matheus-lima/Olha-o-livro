/*
    Classe para controle para pegar os dados de um material
*/

const MaterialControl = require('./MaterialControl');

class MaterialDatailControl extends MaterialControl{
    constructor (materialDao) {
        super(materialDao);
    }

    execute (req, res) {
        if (req.params.id && req.params.id !== ''){
            this.materialDao.find(req, res);
        } else {
            res.send({'error' : true, 'message' : 'O id do material não é válido!'})
        }
    }
}

module.exports = MaterialDatailControl;