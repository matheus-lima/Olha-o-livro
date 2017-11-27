import MaterialFactory from './control/material/MaterialFactory';
import { mainColor } from './util/colors';

export default class BusinessFacade {

    constructor() {
        this._materialFactory = new MaterialFactory();
    }

    // MaterialFactory methods
    createMaterial() {
        return this._materialFactory.createMaterial();
    }
    createPhysicalMaterial() {
        return this._materialFactory.createPhysicalMaterial();
    }
    createVirtualMaterial() {
        return this._materialFactory.createVirtualMaterial();
    }
    
    // util.colors Methods
    getMainColor() {
        return mainColor;
    }

}