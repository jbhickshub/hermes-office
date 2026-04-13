import { afterEach, describe, expect, it, vi } from "vitest";

describe("loadLocalGatewayDefaults with CLAW3D_GATEWAY_URL", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("returns env-based defaults when CLAW3D_GATEWAY_URL is set", async () => {
    process.env.CLAW3D_GATEWAY_URL = "ws://my-gateway:18789";
    process.env.CLAW3D_GATEWAY_TOKEN = "my-token";
    process.env.HERMES_STATE_DIR = "/tmp/claw3d-test-nonexistent-" + Date.now();
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    expect(result).toEqual({
      url: "ws://my-gateway:18789",
      token: "my-token",
      adapterType: "hermes",
      profiles: {
        hermes: { url: "ws://my-gateway:18789", token: "my-token" },
      },
    });
  });

  it("returns env-based defaults with empty token when only URL is set", async () => {
    process.env.CLAW3D_GATEWAY_URL = "ws://my-gateway:18789";
    delete process.env.CLAW3D_GATEWAY_TOKEN;
    process.env.HERMES_STATE_DIR = "/tmp/claw3d-test-nonexistent-" + Date.now();
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    expect(result).toEqual({
      url: "ws://my-gateway:18789",
      token: "",
      adapterType: "hermes",
      profiles: {
        hermes: { url: "ws://my-gateway:18789", token: "" },
      },
    });
  });

  it("returns null when no env vars are set", async () => {
    delete process.env.CLAW3D_GATEWAY_URL;
    delete process.env.CLAW3D_GATEWAY_TOKEN;
    delete process.env.HERMES_ADAPTER_PORT;
    delete process.env.DEMO_ADAPTER_PORT;
    process.env.HERMES_STATE_DIR = "/tmp/claw3d-test-nonexistent-" + Date.now();
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    expect(result).toBeNull();
  });

  it("uses CLAW3D_GATEWAY_ADAPTER_TYPE for Hermes env defaults", async () => {
    process.env.CLAW3D_GATEWAY_URL = "ws://my-hermes:18789";
    process.env.CLAW3D_GATEWAY_ADAPTER_TYPE = "hermes";
    delete process.env.CLAW3D_GATEWAY_TOKEN;
    process.env.HERMES_STATE_DIR = "/tmp/claw3d-test-nonexistent-" + Date.now();
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    expect(result).toEqual({
      url: "ws://my-hermes:18789",
      token: "",
      adapterType: "hermes",
      profiles: {
        hermes: { url: "ws://my-hermes:18789", token: "" },
      },
    });
  });

  it("exposes local Hermes adapter defaults when only HERMES_ADAPTER_PORT is set", async () => {
    delete process.env.CLAW3D_GATEWAY_URL;
    delete process.env.CLAW3D_GATEWAY_TOKEN;
    process.env.HERMES_ADAPTER_PORT = "19444";
    process.env.HERMES_STATE_DIR = "/tmp/claw3d-test-nonexistent-" + Date.now();
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    expect(result).toEqual({
      url: "ws://localhost:19444",
      token: "",
      adapterType: "hermes",
      profiles: {
        hermes: { url: "ws://localhost:19444", token: "" },
      },
    });
  });

  it("merges Hermes and Demo adapter ports when both are set", async () => {
    delete process.env.CLAW3D_GATEWAY_URL;
    delete process.env.CLAW3D_GATEWAY_TOKEN;
    delete process.env.CLAW3D_GATEWAY_ADAPTER_TYPE;
    process.env.HERMES_ADAPTER_PORT = "19444";
    process.env.DEMO_ADAPTER_PORT = "19555";
    process.env.HERMES_STATE_DIR = "/tmp/claw3d-test-nonexistent-" + Date.now();

    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();

    expect(result).toEqual({
      url: "ws://localhost:19444",
      token: "",
      adapterType: "hermes",
      profiles: {
        hermes: { url: "ws://localhost:19444", token: "" },
        demo: { url: "ws://localhost:19555", token: "" },
      },
    });
  });

  it("prefers CLAW3D_GATEWAY_URL over adapter port when both are set", async () => {
    process.env.CLAW3D_GATEWAY_URL = "ws://env-gateway:19999";
    process.env.CLAW3D_GATEWAY_TOKEN = "env-token";
    delete process.env.CLAW3D_GATEWAY_ADAPTER_TYPE;
    process.env.HERMES_ADAPTER_PORT = "19444";
    process.env.HERMES_STATE_DIR = "/tmp/claw3d-test-nonexistent-" + Date.now();

    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();

    expect(result).toEqual({
      url: "ws://env-gateway:19999",
      token: "env-token",
      adapterType: "hermes",
      profiles: {
        hermes: { url: "ws://env-gateway:19999", token: "env-token" },
      },
    });
  });
});
