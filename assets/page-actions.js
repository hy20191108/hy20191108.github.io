const copyButton = document.querySelector("[data-copy-page]");

if (copyButton && navigator.clipboard) {
  const actions = copyButton.closest(".page-actions");
  const markdownLink = actions.querySelector("a");
  const status = actions.querySelector('[role="status"]');
  copyButton.hidden = false;

  copyButton.addEventListener("click", async () => {
    copyButton.disabled = true;
    status.textContent = copyButton.dataset.copying;

    try {
      const markdown = fetch(markdownLink.href).then((response) => {
        if (!response.ok) throw new Error("Could not load Markdown");
        return response.text();
      });

      if (window.ClipboardItem && navigator.clipboard.write) {
        // Start the write during the click, including when the fetch is slow.
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": markdown.then(
              (text) => new Blob([text], { type: "text/plain" }),
            ),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(await markdown);
      }
      status.textContent = copyButton.dataset.copied;
    } catch {
      status.textContent = copyButton.dataset.failed;
    } finally {
      copyButton.disabled = false;
    }
  });
}
