#!/usr/bin/env node
/**
 * Schema-to-TypeScript codegen.
 * Generates TS types from schemas/*.json into packages/core/src/types/generated/
 */
import { compileFromFile } from 'json-schema-to-typescript';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const SCHEMAS_DIR = join(ROOT, 'schemas');
const OUT_DIR = join(ROOT, 'packages/core/src/types/generated');

const SCHEMA_FILES = [
  'match.schema.json',
  'player.schema.json',
  'city.schema.json',
  'tile.schema.json',
  'unit.schema.json',
];

const STABLE_MAP = {
  match: { aliases: [['MatchState', 'MatchStateV442'], ['PlayerState', 'PlayerStateSchemaV442'], ['TileState', 'RedAgeTileSchemaV442']] },
  player: { aliases: [['PlayerState', 'PlayerStateSchemaV442']] },
  city: { aliases: [['CityState', 'RedAgeCitySchemaV442']] },
  tile: { aliases: [['TileState', 'RedAgeTileSchemaV442']] },
  unit: { aliases: [['UnitType', 'RedAgeUnitTypeSchemaV442']] },
};

function addStableAliases(content, name) {
  const cfg = STABLE_MAP[name];
  if (!cfg) return content;
  let out = content;
  for (const [stable, root] of cfg.aliases) {
    if (!new RegExp('\\b' + root + '\\b').test(out)) continue;
    if (new RegExp('export type ' + stable + ' =').test(out)) continue;
    out += '\nexport type ' + stable + ' = ' + root + ';\n';
  }
  return out;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const generated = [];

  for (const schemaFile of SCHEMA_FILES) {
    const schemaPath = join(SCHEMAS_DIR, schemaFile);
    const name = schemaFile.replace(/\.schema\.json$/, '').replace(/\.json$/, '');
    const outPath = join(OUT_DIR, name + '.ts');

    try {
      let ts = await compileFromFile(schemaPath, {
        cwd: SCHEMAS_DIR,
        bannerComment: '// AUTO-GENERATED. DO NOT EDIT. Source: schemas/' + schemaFile,
        additionalProperties: false,
      });
      ts = addStableAliases(ts, name);
      writeFileSync(outPath, ts, 'utf8');
      generated.push(name);
      console.log('Generated ' + outPath);
    } catch (err) {
      console.error('Failed to generate ' + schemaFile + ':', err.message);
      process.exit(1);
    }
  }

  const indexLines = ['// AUTO-GENERATED. DO NOT EDIT.'];
  indexLines.push("export * from './match';");
  indexLines.push("export * from './city';");
  indexLines.push("export * from './unit';");
  indexLines.push("// player and tile types are inlined in match; export from match only to avoid duplicates");

  writeFileSync(join(OUT_DIR, 'index.ts'), indexLines.join('\n') + '\n', 'utf8');
  console.log('Generated index.ts');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
