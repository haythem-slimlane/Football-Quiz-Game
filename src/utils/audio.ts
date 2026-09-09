// Audio disabled per user request - completely silent mode
export function toggleSound(_enabled?: boolean): boolean {
  return false;
}

export function isSoundEnabled(): boolean {
  return false;
}

export function playTapSound(): void {}
export function playTickSound(): void {}
export function playCorrectSound(): void {}
export function playWrongSound(): void {}
export function playLifelineSound(): void {}
export function playFanfareSound(): void {}
