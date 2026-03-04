/**
 * Validate match state against schemas/match.schema.json using Ajv.
 * Schemas are imported at build time (bundleable for browser).
 */
import Ajv from "ajv";
import addFormats from "ajv-formats";
import matchSchemaJson from "../../../../schemas/match.schema.json";
import playerSchemaJson from "../../../../schemas/player.schema.json";
import tileSchemaJson from "../../../../schemas/tile.schema.json";

const matchSchema = matchSchemaJson as object & { $id?: string };
const playerSchema = playerSchemaJson as object & { $id?: string };
const tileSchema = tileSchemaJson as object & { $id?: string };

const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
addFormats(ajv);
ajv.addSchema({ ...playerSchema, $id: "player.schema.json" });
ajv.addSchema({ ...tileSchema, $id: "tile.schema.json" });
const validate = ajv.compile({ ...matchSchema, $id: "match.schema.json" });

export function validateMatchState(
  state: unknown
): { ok: true } | { ok: false; errors: string[] } {
  if (state === null || typeof state !== "object") {
    return { ok: false, errors: ["state must be an object"] };
  }
  const valid = validate(state);
  if (valid) return { ok: true };
  const errors = (validate.errors ?? []).map(
    (e) => `${e.instancePath || "/"}: ${e.message ?? "validation failed"}`
  );
  return { ok: false, errors };
}
