const APP_VERSION = "2026-07-09-nxn-events";
const APP_CHUNKS = [
  "./chunks/app.00.b64.txt",
  "./chunks/app.01.b64.txt",
  "./chunks/app.02.b64.txt",
  "./chunks/app.03.b64.txt",
  "./chunks/app.04.b64.txt",
  "./chunks/app.05.b64.txt",
];

const SOURCE_PATCHES = [
  [
    'const EVENTS = [\n  { id: "333", label: "3x3", type: "nxn", size: 3, length: 20 },\n];',
    'const EVENTS = [\n  { id: "222", label: "2x2", type: "nxn", size: 2, length: 9 },\n  { id: "333", label: "3x3", type: "nxn", size: 3, length: 20 },\n  { id: "444", label: "4x4", type: "nxn", size: 4, length: 40 },\n  { id: "555", label: "5x5", type: "nxn", size: 5, length: 60 },\n  { id: "666", label: "6x6", type: "nxn", size: 6, length: 80 },\n  { id: "777", label: "7x7", type: "nxn", size: 7, length: 100 },\n];',
  ],
  [
    '  const stickerSize = Math.max(7, 15 - size);\n  net.style.setProperty("--sticker", `${stickerSize}px`);',
    '  const stickerSize = getPreviewStickerSize(size);\n  net.style.setProperty("--sticker", `${stickerSize}px`);\n  net.style.setProperty("--sticker-gap", size >= 6 ? "1px" : "2px");\n  net.style.setProperty("--face-padding", size >= 6 ? "2px" : "3px");',
  ],
  [
    'function createScrambledCube(size, scramble) {',
    'function getPreviewStickerSize(size) {\n  return {\n    2: 18,\n    3: 14,\n    4: 11,\n    5: 9,\n    6: 7,\n    7: 6,\n  }[size] ?? Math.max(5, Math.floor(42 / size));\n}\n\nfunction createScrambledCube(size, scramble) {',
  ],
  [
    '  const parsed = parseCubeMove(move);\n  if (!parsed) return;\n\n  const { axis, direction: turnDirection } = getMoveAxisDirection(parsed);',
    '  const parsed = parseCubeMove(move);\n  if (!parsed) return;\n  if (parsed.depth && parsed.depth > size) return;\n\n  const { axis, direction: turnDirection } = getMoveAxisDirection(parsed);',
  ],
  [
    '  const faces = ["U", "D", "R", "L", "F", "B"];',
    '  const faces = size === 2 ? ["U", "R", "F"] : ["U", "D", "R", "L", "F", "B"];',
  ],
];

try {
  const encoded = await Promise.all(
    APP_CHUNKS.map(async (path) => {
      const url = new URL(path, import.meta.url);
      url.searchParams.set("v", APP_VERSION);
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Unable to load ${path}`);
      }
      return response.text();
    }),
  );

  const binary = atob(encoded.join("").replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  let source = new TextDecoder().decode(bytes).replace(/\bTHREQ\b/g, "THREE");

  SOURCE_PATCHES.forEach(([from, to], index) => {
    if (!source.includes(from)) {
      throw new Error(`Unable to apply app patch ${index + 1}`);
    }
    source = source.replace(from, to);
  });

  const moduleUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  await import(moduleUrl);
  URL.revokeObjectURL(moduleUrl);
} catch (error) {
  console.error("Unable to load erno", error);
  document.body.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;padding:24px;text-align:center;"><div><p style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#888;">erno</p><h1 style="font-size:clamp(32px,8vw,72px);font-weight:500;margin:0 0 16px;">Unable to load the timer.</h1><p style="color:#777;max-width:520px;">Refresh the page. If this keeps happening, the app script did not finish loading.</p></div></main>';
}
