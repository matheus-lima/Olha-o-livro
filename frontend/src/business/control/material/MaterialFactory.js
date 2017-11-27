import MaterialAbstractFactory from './MaterialAbstractFactory';
import {
    Material,
    PhysicalMaterial,
    VirtualMaterial
} from '../../model/material';

export default class MaterialFactory extends MaterialAbstractFactory {
    constructor() { super(); }

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