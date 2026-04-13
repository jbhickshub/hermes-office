/**
 * Tests for the voice transcription API route.
 * Voice transcription is not available (returns 501).
 */

import { describe, expect, it } from "vitest";

const { POST } = await import("@/app/api/office/voice/transcribe/route");

describe("POST /api/office/voice/transcribe", () => {
  it("returns 501 because voice transcription is not available", async () => {
    const request = new Request("http://localhost/api/office/voice/transcribe", {
      method: "POST",
    });

    const response = await POST(request);

    expect(response.status).toBe(501);
    const body = await response.json();
    expect(body.error).toMatch(/not available/i);
  });
});
