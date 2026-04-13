import { CustomRuntimeProvider } from "@/lib/runtime/custom/provider";
import type { GatewayClient } from "@/lib/gateway/GatewayClient";
import { DemoRuntimeProvider } from "@/lib/runtime/demo/provider";
import { HermesRuntimeProvider } from "@/lib/runtime/hermes/provider";
import type { RuntimeProvider } from "@/lib/runtime/types";

export const createRuntimeProvider = (
  providerId: RuntimeProvider["id"],
  client: GatewayClient,
  runtimeUrl: string
): RuntimeProvider => {
  switch (providerId) {
    case "custom":
      return new CustomRuntimeProvider(client, runtimeUrl);
    case "demo":
      return new DemoRuntimeProvider(client);
    case "hermes":
    default:
      return new HermesRuntimeProvider(client);
  }
};
