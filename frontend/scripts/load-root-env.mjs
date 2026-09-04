import path from "node:path";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(path.resolve(process.cwd(), ".."));
