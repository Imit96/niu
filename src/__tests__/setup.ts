// Global test setup — add any shared mocks or polyfills here
import { vi } from "vitest";

// Silence console.error in tests unless explicitly asserted
vi.spyOn(console, "error").mockImplementation(() => {});
