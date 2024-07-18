export default class Logo {
    constructor ({ x, y, height }) {
        this.x = this.defineX(x, height);
        this.y = this.defineY(y, height);
    }

    defineX (x, height) {
        const xValue = x + (height / 2);
        return xValue;
    }
    
    defineY (y, height) {
        const yValue = y + (height / 2);
        return yValue;
    }
}