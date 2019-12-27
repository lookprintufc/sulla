/// <reference types="node" />
import * as puppeteer from 'puppeteer';
import EventEmitter from 'events';
export declare const ev: EventEmitter;
export declare const isAuthenticated: (waPage: puppeteer.Page) => Promise<boolean>;
export declare const needsToScan: (waPage: puppeteer.Page) => import("rxjs").Observable<boolean>;
export declare const isInsideChat: (waPage: puppeteer.Page) => import("rxjs").Observable<boolean>;
export declare function retrieveQR(waPage: puppeteer.Page): Promise<boolean>;
export declare function keepHere(waPage: puppeteer.Page): Promise<void>;
export declare function randomMouseMovements(waPage: puppeteer.Page): Promise<boolean>;
