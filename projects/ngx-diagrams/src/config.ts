// @internal
export let __DEV__ = true;

export function enableDiagramProdMode(): void {
	__DEV__ = false;
}

// @internal
export function isDev(): boolean {
	return __DEV__;
}
