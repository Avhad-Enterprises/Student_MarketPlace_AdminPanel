import { defineConfig } from "@opennextjs/cloudflare";

export default defineConfig({
  default: {
    override: {
      wrapper: "cloudflare-node",
    },
  },
});
