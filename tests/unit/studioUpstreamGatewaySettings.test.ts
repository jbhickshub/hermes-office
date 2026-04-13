import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const makeTempDir = (name: string) => fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));

describe("server studio upstream gateway settings", () => {
  const priorStateDir = process.env.HERMES_STATE_DIR;
  let tempDir: string | null = null;

  afterEach(() => {
    process.env.HERMES_STATE_DIR = priorStateDir;
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("falls back to default url and empty token when studio settings are missing", async () => {
    tempDir = makeTempDir("studio-upstream-hermes-defaults");
    process.env.HERMES_STATE_DIR = tempDir;

    const { loadUpstreamGatewaySettings } = await import("../../server/studio-settings");
    const settings = loadUpstreamGatewaySettings(process.env);
    expect(settings.url).toBe("ws://localhost:18789");
    expect(settings.token).toBe("");
  });

  it("keeps a configured url and empty token when no token in settings", async () => {
    tempDir = makeTempDir("studio-upstream-url-keep");
    process.env.HERMES_STATE_DIR = tempDir;

    fs.mkdirSync(path.join(tempDir, "claw3d"), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, "claw3d", "settings.json"),
      JSON.stringify({ gateway: { url: "ws://gateway.example:18789", token: "" } }, null, 2),
      "utf8"
    );

    const { loadUpstreamGatewaySettings } = await import("../../server/studio-settings");
    const settings = loadUpstreamGatewaySettings(process.env);
    expect(settings.url).toBe("ws://gateway.example:18789");
    expect(settings.token).toBe("");
  });
});
