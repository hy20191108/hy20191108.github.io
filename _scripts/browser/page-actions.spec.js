const { test, expect } = require("@playwright/test");

for (const profile of [
  {
    path: "/",
    markdown: "/index.md",
    copy: "ページをコピー",
    copied: "コピーしました．",
  },
  {
    path: "/en/",
    markdown: "/en/index.md",
    copy: "Copy page",
    copied: "Copied.",
  },
]) {
  test(`${profile.path}: copy and view the matching Markdown`, async ({
    page,
    context,
    request,
  }) => {
    const response = await request.get(profile.markdown);
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    await page.goto(profile.path);
    for (let attempt = 0; attempt < 2; attempt++) {
      await page.getByRole("button", { name: profile.copy }).click();
      await expect(page.getByRole("status")).toHaveText(profile.copied);
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        markdown,
      );
    }
    const popup = page.waitForEvent("popup");
    await page.locator(".page-actions a").click();
    const view = await popup;
    await view.waitForLoadState("domcontentloaded");
    expect(new URL(view.url()).pathname).toBe(profile.markdown);
    expect((await view.locator("body").innerText()).trim()).toBe(
      markdown.trim(),
    );
    await view.close();
  });

  test(`${profile.path}: controls fit a mobile viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(profile.path);
    for (const control of await page.locator(".page-action").all()) {
      await expect(control).toBeVisible();
      const box = await control.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(375);
    }
  });
}

test("copy failure offers the Markdown link and allows retry", async ({
  page,
}) => {
  await page.addInitScript(() => {
    navigator.clipboard.write = () =>
      Promise.reject(new DOMException("Denied", "NotAllowedError"));
  });
  await page.goto("/");
  await page.getByRole("button", { name: "ページをコピー" }).click();
  await expect(page.getByRole("status")).toContainText(
    "コピーできませんでした",
  );
  await expect(
    page.getByRole("button", { name: "ページをコピー" }),
  ).toBeEnabled();
  await expect(page.locator(".page-actions a")).toHaveAttribute(
    "href",
    "/index.md",
  );
});

test("failed Markdown fetch is reported without copying an error page", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/index.md", (route) =>
    route.fulfill({ status: 503, body: "Unavailable" }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "ページをコピー" }).click();
  await expect(page.getByRole("status")).toContainText(
    "コピーできませんでした",
  );
  expect(errors).toEqual([]);
});

test("copy works with the text-only Clipboard API", async ({
  page,
  request,
}) => {
  await page.addInitScript(() => {
    window.ClipboardItem = undefined;
  });
  const markdown = await (await request.get("/index.md")).text();
  await page.goto("/");
  await page.getByRole("button", { name: "ページをコピー" }).click();
  await expect(page.getByRole("status")).toHaveText("コピーしました．");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    markdown,
  );
});

test("Markdown remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("[data-copy-page]")).toBeHidden();
  await expect(page.locator(".page-actions a")).toBeVisible();
  await context.close();
});
