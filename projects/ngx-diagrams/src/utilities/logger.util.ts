import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isDev } from '../config';

export enum LOG_LEVEL {
	'LOG',
	'ERROR'
}

// @internal
export let __LOG__: LOG_LEVEL = LOG_LEVEL.ERROR;

// @internal
export function setLogLevel(level: LOG_LEVEL): void {
	__LOG__ = level;
}

// @internal
export function log(message: string, level: LOG_LEVEL = LOG_LEVEL.LOG, ...args: any[]): void {
	if (isDev() && __LOG__ === level) {
		if (__LOG__ === LOG_LEVEL.ERROR) {
			console.error(message, ...args);
		}
		console.log(message, ...args);
	}
}

/**
 * rxjs log operator
 * @internal
 */
export function withLog(message: string, level: LOG_LEVEL = LOG_LEVEL.LOG, ...args: any) {
	return <T>(source: Observable<T>) => (isDev() ? source.pipe(tap(val => log(message, level, val, ...args))) : source);
}
