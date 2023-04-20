import { Page } from "puppeteer";

import replaceInputValue from "./replaceInputValue";

const env = process.env;

export default async function configAuthParams(page: Page) {
  await replaceInputValue(page, "#CR_name", env.AUTH_CONNECTION_REQUEST_USER);
  await replaceInputValue(
    page,
    "#CR_pwd",
    env.AUTH_CONNECTION_REQUEST_PASSWORD
  );
}
