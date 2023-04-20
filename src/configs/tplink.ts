import { Page, Browser } from "puppeteer";

import delay from "../lib/delay";

const env = process.env;

export default async function configTpLink(
  ip: string,
  page: Page,
  browser: Browser
) {
  try {
    // Esperando a campo da senha renderizar
    await page.waitForSelector("#pc-login-password");
    // Digitando a senha padrão, configurada no arquivo .env (caso não exista crie-o, seguindo o exemplo do .env-example)
    await page.type("#pc-login-password", env.DEFAULT_ROUTER_PASSWORD);
    // Clicando no botão entrar
    await page.click("#pc-login-btn");

    // Checando se a senha está correta para o roteador
    const error = await page.$eval(
      "div.error-tips-content > span.errorContent",
      (element) => element.innerHTML
    );

    if (error !== "") {
      console.log(`Senha incorreta para o TPLink ${ip}`);
      return;
    }

    // Esperando a aba avançada renderizar
    await page.waitForSelector(".T_adv");
    // Clicando na aba avançada
    await page.click(".T_adv");

    await delay(2000);
  } catch {
    console.log(`Falha ao configurar TPLink ${ip}`);
  }
}
