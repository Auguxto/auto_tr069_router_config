import { Page } from "puppeteer";

export default async function replaceInputValue(
  page: Page,
  selector: string,
  value: string
): Promise<boolean> {
  try {
    await page.evaluate((input_selector: string) => {
      const inform_interval = document.querySelector(
        input_selector
      ) as HTMLInputElement;

      inform_interval.value = "";
    }, selector);

    await page.type(selector, value);

    return true;
  } catch {
    return false;
  }
}
