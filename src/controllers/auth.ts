import ora from 'ora';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode-terminal';
import { from, merge } from 'rxjs';
import { take } from 'rxjs/operators';
import { width, height } from '../config/puppeteer.config';
const spinner = ora();
import EventEmitter from 'events';
export const ev = new EventEmitter();

/**
 * Validates if client is authenticated
 * @returns true if is authenticated, false otherwise
 * @param waPage
 */
export const isAuthenticated = (waPage: puppeteer.Page) => {
  return merge(needsToScan(waPage), isInsideChat(waPage))
    .pipe(take(1))
    .toPromise();
};

export const needsToScan = (waPage: puppeteer.Page) => {
  return from(
    waPage
      .waitForSelector('body > div > div > .landing-wrapper', {
        timeout: 0
      })
      .then(() => false)
  );
};

export const isInsideChat = (waPage: puppeteer.Page) => {
  return from(
    waPage
      .waitForFunction(
        "document.getElementsByClassName('app')[0] && document.getElementsByClassName('app')[0].attributes && !!document.getElementsByClassName('app')[0].attributes.tabindex",
        { timeout: 0 }
      )
      .then(() => true)
  );
};

export async function retrieveQR(waPage: puppeteer.Page) {
  spinner.start('Loading QR');
  await waPage.waitForSelector("img[alt='Scan me!']", { timeout: 0 });
  const qrData = await waPage.evaluate(
    `document.querySelector("img[alt='Scan me!']").parentElement.getAttribute("data-ref")`
  );
  const qrImage = await waPage.evaluate(
    `document.querySelector("img[alt='Scan me!']").getAttribute("src")`
  );
  spinner.succeed();
  ev.emit('qr', qrImage);
  qrcode.generate(qrData, {
    small: true
  });
  return true;
}

export async function keepHere(waPage: puppeteer.Page) {
  await waPage.waitForFunction(
    `[...document.querySelectorAll("div[role=button")].find(e=>{return e.innerHTML=="Usar Aqui"})`,
    { timeout: 0 }
  );
  await waPage.evaluate(
    `[...document.querySelectorAll("div[role=button")].find(e=>{return e.innerHTML=="Usar Aqui"}).click()`
  );
  await keepHere(waPage);
}

export async function randomMouseMovements(waPage: puppeteer.Page) {
  var twoPI = Math.PI * 2.0;
  var h = (height / 2 - 10) / 2;
  var w = width / 2;
  for (var x = 0; x < w; x++) {
    const y = h * Math.sin((twoPI * x) / width) + h;
    await waPage.mouse.move(x + 500, y);
  }
  return true;
}
