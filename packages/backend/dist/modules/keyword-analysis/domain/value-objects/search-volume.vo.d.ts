export declare class SearchVolume {
    private readonly _pc;
    private readonly _mobile;
    constructor(pc: number, mobile: number);
    get pc(): number;
    get mobile(): number;
    get total(): number;
    get pcRatio(): number;
    get mobileRatio(): number;
    private validate;
    equals(other: SearchVolume): boolean;
    toString(): string;
    static zero(): SearchVolume;
    static fromTotal(total: number, pcRatio?: number): SearchVolume;
}
