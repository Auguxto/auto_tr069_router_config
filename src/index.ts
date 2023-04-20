import { config } from "dotenv";
config();

import path from "node:path";
import puppeteer from "puppeteer";

import readTxtFile from "./lib/readTxtFile";

// Configurações
import configTpLink from "./configs/tplink";

// Lendo o arquivo ips.txt
let ips = readTxtFile(path.join("ips.txt"));

const env = process.env;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--start-maximized"],
  });

  const [page] = await browser.pages();

  for (let ip of ips) {
    try {
      await page.goto(`http://${ip}:${env.ROUTER_PORT}`, {
        timeout: 7000,
      });

      const page_title = await page.title();

      switch (page_title) {
        case "EC220-G5":
          await configTpLink(ip, page, browser);
          break;
        case "Archer C5":
          await configTpLink(ip, page, browser);
          break;
        default:
          break;
      }
    } catch {
      console.log(`Erro ao acessar o ip: ${ip}`);
    }
  }
})();
