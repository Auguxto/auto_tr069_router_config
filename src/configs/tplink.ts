import { Page } from "puppeteer";

import delay from "../lib/delay";
import autoScroll from "../lib/autoScroll";
import clearInputValue from "../lib/replaceInputValue";
import replaceInputValue from "../lib/replaceInputValue";
import configAuthParams from "../lib/configAuthParams";

const env = process.env;

export default async function configTpLink(ip: string, page: Page) {
  try {
    // Esperando a campo da senha renderizar
    const input_password = await page.waitForSelector("#pc-login-password");
    // Digitando a senha padrão, configurada no arquivo .env (caso não exista crie-o, seguindo o exemplo do .env-example)
    await input_password?.type(env.DEFAULT_ROUTER_PASSWORD);
    // Clicando no botão entrar
    await page.click("#pc-login-btn");

    // Checando se a senha está correta para o roteador
    const error = await page.$eval(
      "div.error-tips-content > span.errorContent",
      (element) => element.innerHTML
    );

    // Checando se exista uma mensagem de erro
    if (error !== "") {
      console.log(`Senha incorreta para o TPLink ${ip}`);
      // Se exister algum erro, ele vai para o proximo roteador da lista
      return;
    }

    // Verificando se apareu a mensagem ("Apenas um dispositivo pode fazer login de uma vez. Deseja continuar e forçar o outro dispositivo para")
    const confirm = await page.waitForSelector("#confirm-yes");
    // Clicando em entrar
    await confirm?.click();

    await delay(1000);

    // Esperando a aba avançada renderizar
    const advanced = await page.waitForSelector(".T_adv");
    // Clicando na aba avançada
    await advanced?.click();

    // Esperando o botão Ferramentas de sistemas renderizar
    const tools = await page.waitForSelector('a[url="time.htm"]');
    // Clicando no botão
    await tools?.click();

    // Fazendo um scroll para o final da pagina
    await autoScroll(page);

    await delay(1000);

    // Aguardando o botão de Configurações CWMP renderizar
    const cwmp = await page.waitForSelector('a[url="cwmp.htm"]');
    // Clicando no botão
    await cwmp?.click();

    // Esperando o botão on/off do CWMP renderizar
    const cwmp_on = await page.waitForSelector("#cwmp_on");
    // Verificando se o CWMP esta ativo
    if (
      (await page.$("ul.button-group-container > li > #cwmp_off.selected")) !==
      null
    ) {
      // Caso não esteja, ativando ele
      await cwmp_on?.click();
      await delay(1500);
    }

    // Esperando o botão on/off do Inform renderizar
    const inform_on = await page.waitForSelector("#inform_on");
    // Verificando se o Inform esta ativo
    if (
      (await page.$(
        "ul.button-group-container > li > #inform_off.selected"
      )) !== null
    ) {
      // Caso não esteja, ativando ele
      await inform_on?.click();
      await delay(1500);
    }

    await delay(1000);

    // Alterando o tempo de inform de acordo com a configuração do arquivo .env
    await clearInputValue(
      page,
      "#inform_interval",
      env.ACS_INFORM_INTERVAL.toString()
    );

    // Alterando a url do ACS de acordo com a configuração do arquivo .env
    await clearInputValue(page, "#acs_url", env.ACS_URL);

    // Se tiver um usuário setado no arquivo de configuração .env
    if (env.ACS_USER) {
      // Alterando o usuário de conexão do ACS
      await clearInputValue(page, "#acs_user_name", env.ACS_USER);
    }

    // Se tiver uma senha setada no arquivo de configuração .env
    if (env.ACS_PASSWORD) {
      // Alterando a senha de conexão do ACS
      await clearInputValue(page, "#acs_user_pwd", env.ACS_PASSWORD);
    }

    const auth_active =
      (await page.$("label[for=CR_Auth_en] > span.span-click")) !== null;

    if (env.AUTH_CONNECTION_REQUEST === "true") {
      if (auth_active === true) {
        await configAuthParams(page);
      } else {
        await page.click("label[for=CR_Auth_en]");
        await configAuthParams(page);
      }
    } else if (env.AUTH_CONNECTION_REQUEST === "false") {
      if (auth_active === true) {
        await page.click("label[for=CR_Auth_en]");
      }
    }

    await delay(1500);

    // Salvando as configuraçõe
    const save_button = await page.waitForSelector("#t_save");
    await save_button?.click();

    await delay(2000);
  } catch {
    console.log(`Falha ao configurar TPLink ${ip}`);
  }
}
