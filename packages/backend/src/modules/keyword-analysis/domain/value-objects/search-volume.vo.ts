// 검색량 값 객체 - 검색량 데이터의 유효성 검증과 계산을 담당
export class SearchVolume {
  private readonly _pc: number;
  private readonly _mobile: number;

  constructor(pc: number, mobile: number) {
    this.validate(pc, mobile);
    this._pc = pc;
    this._mobile = mobile;
  }

  get pc(): number {
    return this._pc;
  }

  get mobile(): number {
    return this._mobile;
  }

  get total(): number {
    return this._pc + this._mobile;
  }

  get pcRatio(): number {
    if (this.total === 0) return 0;
    return Math.round((this._pc / this.total) * 100);
  }

  get mobileRatio(): number {
    if (this.total === 0) return 0;
    return Math.round((this._mobile / this.total) * 100);
  }

  private validate(pc: number, mobile: number): void {
    if (typeof pc !== 'number' || typeof mobile !== 'number') {
      throw new Error('검색량은 숫자여야 합니다.');
    }

    if (pc < 0 || mobile < 0) {
      throw new Error('검색량은 0 이상이어야 합니다.');
    }

    if (!Number.isInteger(pc) || !Number.isInteger(mobile)) {
      throw new Error('검색량은 정수여야 합니다.');
    }

    // 네이버 데이터랩의 최대 비율은 100
    if (pc > 100 || mobile > 100) {
      throw new Error('검색량 비율은 100을 초과할 수 없습니다.');
    }
  }

  equals(other: SearchVolume): boolean {
    return this._pc === other._pc && this._mobile === other._mobile;
  }

  toString(): string {
    return `PC: ${this._pc}, Mobile: ${this._mobile}, Total: ${this.total}`;
  }

  static zero(): SearchVolume {
    return new SearchVolume(0, 0);
  }

  static fromTotal(total: number, pcRatio: number = 50): SearchVolume {
    if (total < 0 || pcRatio < 0 || pcRatio > 100) {
      throw new Error('유효하지 않은 검색량 데이터입니다.');
    }

    const pc = Math.round(total * (pcRatio / 100));
    const mobile = total - pc;

    return new SearchVolume(pc, mobile);
  }
}
