import { pipeline, env } from "@xenova/transformers";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ✅ Set the local model cache directory
env.localModelPath = path.resolve(__dirname, "../../models");
let embedder = null;
export async function getEmbedding(text) {
    try {
        if (!embedder) {
            console.log(`🔹 Loading model: all-MiniLM-L6-v2`);
            console.log(`🔹 Local model path: ${env.localModelPath}`);
            // ✅ Use the model identifier with local cache
            embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
                local_files_only: true,
                cache_dir: env.localModelPath
            });
            console.log("✅ Local model loaded successfully");
        }
        const output = await embedder(text, {
            pooling: "mean",
            normalize: true
        });
        return Array.from(output.data);
    }
    catch (error) {
        console.error("❌ Error generating embedding:", error);
        console.error("Error details:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Embedding generation failed: ${errorMessage}`);
    }
}
