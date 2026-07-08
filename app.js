const APP_CHUNKS = [
  "./chunks/app.00.b64.txt",
  "./chunks/app.01.b64.txt",
  "./chunks/app.02.b64.txt",
  "./chunks/app.03.b64.txt",
  "./chunks/app.04.b64.txt",
  "./chunks/app.05.b64.txt",
];

try {
  const encoded = await Promise.all(
    APP_CHUNKS.map(async (path) => {
      const response = await fetch(new URL(path, import.meta.url));
      if (!response.ok) {
        throw new Error(`Unable to load ${path}`);
      }
      return response.text();
    }),
  );

  const binary = atob(encoded.join("").replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const source = new TextDecoder().decode(bytes);
  const moduleUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  await import(moduleUrl);
  URL.revokeObjectURL(moduleUrl);
} catch (error) {
  console.error(error);
  document.body.dataset.appLoadError = "true";
}
