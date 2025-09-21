"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchVolume = void 0;
class SearchVolume {
    constructor(pc, mobile) {
        this.validate(pc, mobile);
        this._pc = Math.round(pc);
        this._mobile = Math.round(mobile);
    }
    get pc() {
        return this._pc;
    }
    get mobile() {
        return this._mobile;
    }
    get total() {
        return this._pc + this._mobile;
    }
    get pcRatio() {
        if (this.total === 0)
            return 0;
        return Math.round((this._pc / this.total) * 100);
    }
    get mobileRatio() {
        if (this.total === 0)
            return 0;
        return Math.round((this._mobile / this.total) * 100);
    }
    validate(pc, mobile) {
        if (typeof pc !== 'number' || typeof mobile !== 'number') {
            throw new Error('검색량은 숫자여야 합니다.');
        }
        if (isNaN(pc) || isNaN(mobile)) {
            throw new Error('검색량은 유효한 숫자여야 합니다.');
        }
        if (pc < 0 || mobile < 0) {
            throw new Error('검색량은 0 이상이어야 합니다.');
        }
        if (pc > 100 || mobile > 100) {
            throw new Error('검색량 비율은 100을 초과할 수 없습니다.');
        }
    }
    equals(other) {
        return this._pc === other._pc && this._mobile === other._mobile;
    }
    toString() {
        return `PC: ${this._pc}, Mobile: ${this._mobile}, Total: ${this.total}`;
    }
    static zero() {
        return new SearchVolume(0, 0);
    }
    static fromTotal(total, pcRatio = 50) {
        if (total < 0 || pcRatio < 0 || pcRatio > 100) {
            throw new Error('유효하지 않은 검색량 데이터입니다.');
        }
        const pc = Math.round(total * (pcRatio / 100));
        const mobile = total - pc;
        return new SearchVolume(pc, mobile);
    }
}
exports.SearchVolume = SearchVolume;
//# sourceMappingURL=search-volume.vo.js.map