🚀 CDP (CD Project) - Hızlı Proje DeğiştiriciNPM Paket İsmi: cdp-cli | Global Komut: cdpBu doküman, terminalde projeler arası hızlı geçiş yapmayı sağlayan CDP CLI aracının mimarisini, teknik detaylarını ve tam kaynak kodlarını içermektedir.1. Proje Özeti ve Temel ProblemNode.js CLI araçları kendi process'lerinde (alt süreç) çalışırlar. Bu nedenle bir Node.js scripti, kendisini çağıran ana terminalin (parent shell) çalışma dizinini (PWD - Print Working Directory) doğrudan değiştiremez.Çözüm: 1. Node.js CLI Katmanı: Proje yollarını kaydeder, doğrular, yapılandırma (config) dosyasını yönetir ve terminale sadece hedef dizinin yolunu (path) basar. 2. Shell Wrapper Katmanı: bash veya zsh profilinize eklenen bir fonksiyon, Node.js CLI'dan dönen bu yolu yakalar ve asıl cd işlemini gerçekleştirir.2. Mimari KararlarTeknoloji Stack'i: Node.js (>=20), TypeScript, ESM (ECMAScript Modules).Veri Saklama: ~/.cdp/projects.json dizininde versiyonlu JSON formatı.Atomic File Operations: Yapılandırma dosyasının bozulmasını (corruption) önlemek için önce geçici dosyaya (temp file) yazılır, ardından rename işlemi uygulanır.Hata Yönetimi: Hata mesajları (CLI komutları çalışırken) stderr'e yazdırılır. Böylece shell wrapper, hata mesajlarını geçerli bir dizin yolu gibi algılayıp cd yapmaya çalışmaz. Çıktı olarak (stdout) sadece geçerli ve temiz klasör yolları dönülür.3. Klasör Yapısıcdp/
├─ package.json
├─ tsconfig.json
├─ README.md
├─ bin/
│ └─ cdp.js # Global npm entrypoint
├─ src/
│ ├─ index.ts # Ana CLI başlatıcı
│ ├─ cli/
│ │ └─ program.ts # Commander.js tanımları
│ ├─ commands/
│ │ ├─ init.ts # Proje kaydetme
│ │ ├─ list.ts # Projeleri listeleme
│ │ ├─ resolve.ts # Path çözümleme (Shell için)
│ │ ├─ remove.ts # Proje silme
│ │ └─ rename.ts # Proje adlandırma
│ ├─ core/
│ │ ├─ config.ts # Config schema
│ │ ├─ paths.ts # Dizin path çözümlemeleri
│ │ ├─ store.ts # Dosya okuma/yazma servisleri
│ │ └─ validation.ts # Girdi doğrulama
│ ├─ utils/
│ │ └─ fs.ts # Atomic write & fs yardımcıları
│ └─ domain/
│ └─ project.ts # TypeScript arayüzleri
└─ scripts/
└─ cdp.sh # Shell wrapper (ZSH/Bash) 4. Kaynak KodlarAşağıda projenin eksiksiz kaynak kodları bulunmaktadır. Kendi yerel geliştirme ortamınızda bu dosyaları birebir oluşturarak projeyi ayağa kaldırabilirsiniz.Yapılandırma Dosyalarıpackage.json{
"name": "cdp-cli",
"version": "0.1.0",
"description": "Fast project directory switch helper",
"type": "module",
"bin": {
"cdp": "./bin/cdp.js"
},
"files": [
"bin",
"dist",
"scripts",
"README.md"
],
"engines": {
"node": ">=20"
},
"scripts": {
"build": "tsc -p tsconfig.json",
"dev": "node --enable-source-maps ./bin/cdp.js",
"test": "node --test",
"prepublishOnly": "npm run build && npm test"
},
"keywords": ["cli", "developer-tools", "terminal", "productivity", "cd"],
"license": "MIT",
"dependencies": {
"commander": "^12.0.0"
},
"devDependencies": {
"@types/node": "^20.0.0",
"typescript": "^5.4.0"
}
}
tsconfig.json{
"compilerOptions": {
"target": "ES2022",
"module": "NodeNext",
"moduleResolution": "NodeNext",
"outDir": "dist",
"rootDir": "src",
"strict": true,
"declaration": true,
"sourceMap": true,
"noUncheckedIndexedAccess": true,
"exactOptionalPropertyTypes": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true
},
"include": ["src/**/*.ts"],
"exclude": ["node_modules", "tests"]
}
Entrypointbin/cdp.js#!/usr/bin/env node
import("../dist/index.js").catch((err) => {
console.error("Failed to start cdp CLI:", err);
process.exit(1);
});
Domain & Utilssrc/domain/project.tsexport interface ProjectEntry {
path: string;
createdAt: string;
updatedAt: string;
}

export interface CdpConfig {
version: number;
projects: Record<string, ProjectEntry>;
}
src/utils/fs.tsimport fs from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dir: string): Promise<void> {
await fs.mkdir(dir, { recursive: true });
}

export async function fileExists(filePath: string): Promise<boolean> {
try {
await fs.access(filePath);
return true;
} catch {
return false;
}
}

export async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
const dir = path.dirname(filePath);
const tempPath = `${filePath}.${Date.now()}.tmp`;

await ensureDir(dir);
await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
await fs.rename(tempPath, filePath);
}
Core Layersrc/core/paths.tsimport os from "node:os";
import path from "node:path";

export function getCdpDir(): string {
// Gelecekte XDG_CONFIG_HOME desteği buraya eklenebilir
return path.join(os.homedir(), ".cdp");
}

export function getConfigPath(): string {
return path.join(getCdpDir(), "projects.json");
}
src/core/validation.tsexport function validateProjectName(name: string): void {
if (!name || !name.trim()) {
throw new Error("Project name cannot be empty.");
}
if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
throw new Error("Project name can only contain letters, numbers, dots, underscores, and dashes.");
}
}
src/core/store.tsimport fs from "node:fs/promises";
import { getConfigPath } from "./paths.js";
import { atomicWriteJson, fileExists } from "../utils/fs.js";
import type { CdpConfig } from "../domain/project.js";

function createEmptyConfig(): CdpConfig {
return { version: 1, projects: {} };
}

export async function loadConfig(): Promise<CdpConfig> {
const configPath = getConfigPath();
if (!(await fileExists(configPath))) return createEmptyConfig();

try {
const raw = await fs.readFile(configPath, "utf8");
const parsed = JSON.parse(raw) as CdpConfig;
if (!parsed.version || !parsed.projects) throw new Error("Invalid config schema.");
return parsed;
} catch (error) {
throw new Error(`Failed to parse config file: ${error instanceof Error ? error.message : "Unknown error"}`);
}
}

export async function saveConfig(config: CdpConfig): Promise<void> {
await atomicWriteJson(getConfigPath(), config);
}
Commandssrc/commands/init.tsimport { loadConfig, saveConfig } from "../core/store.js";
import { validateProjectName } from "../core/validation.js";
import path from "node:path";

export async function initCommand(name?: string): Promise<void> {
const cwd = process.cwd();
const inferredName = name ?? path.basename(cwd);

if (!inferredName) throw new Error("Could not infer project name from directory.");
validateProjectName(inferredName);

const config = await loadConfig();
const now = new Date().toISOString();
const isUpdate = !!config.projects[inferredName];

config.projects[inferredName] = {
path: cwd,
createdAt: config.projects[inferredName]?.createdAt ?? now,
updatedAt: now
};

await saveConfig(config);
console.log(`✅ ${isUpdate ? 'Updated' : 'Saved'} '${inferredName}' -> ${cwd}`);
}
src/commands/list.tsimport { loadConfig } from "../core/store.js";

export async function listCommand(): Promise<void> {
const config = await loadConfig();
const entries = Object.entries(config.projects).sort(([a], [b]) => a.localeCompare(b));

if (entries.length === 0) {
console.log("No projects saved yet. Use 'cdp init' in a project directory.");
return;
}

const maxNameLen = Math.max(...entries.map(([name]) => name.length), 0);
for (const [name, project] of entries) {
const paddedName = name.padEnd(maxNameLen + 2, " ");
console.log(`${paddedName} ${project.path}`);
}
}
src/commands/resolve.tsimport { loadConfig } from "../core/store.js";

export async function resolveCommand(name: string): Promise<void> {
const config = await loadConfig();
const project = config.projects[name];

if (!project) {
// Stderr kullanımı kritik: Shell scriptin bozuk path algılamasını engeller
console.error(`Project '${name}' not found.`);
process.exit(1);
}

// Stdout'a BİR TEK path basılmalı
process.stdout.write(project.path);
}
src/commands/remove.tsimport { loadConfig, saveConfig } from "../core/store.js";

export async function removeCommand(name: string): Promise<void> {
const config = await loadConfig();
if (!config.projects[name]) throw new Error(`Project '${name}' not found.`);

delete config.projects[name];
await saveConfig(config);
console.log(`🗑️ Removed project '${name}'.`);
}
src/commands/rename.tsimport { loadConfig, saveConfig } from "../core/store.js";
import { validateProjectName } from "../core/validation.js";

export async function renameCommand(oldName: string, newName: string): Promise<void> {
validateProjectName(newName);
const config = await loadConfig();
const project = config.projects[oldName];

if (!project) throw new Error(`Project '${oldName}' not found.`);
if (config.projects[newName]) throw new Error(`Project '${newName}' already exists.`);

config.projects[newName] = { ...project, updatedAt: new Date().toISOString() };
delete config.projects[oldName];
await saveConfig(config);

console.log(`✏️ Renamed '${oldName}' -> '${newName}'.`);
}
CLI & Indexsrc/cli/program.tsimport { Command } from "commander";
import { initCommand } from "../commands/init.js";
import { listCommand } from "../commands/list.js";
import { resolveCommand } from "../commands/resolve.js";
import { removeCommand } from "../commands/remove.js";
import { renameCommand } from "../commands/rename.js";

export function createProgram(): Command {
const program = new Command();
program.name("cdp").description("Fast project directory switch helper").version("0.1.0");

program.command("init").argument("[name]").action(initCommand);
program.command("list").action(listCommand);
program.command("remove").argument("<name>").action(removeCommand);
program.command("rename").argument("<oldName>").argument("<newName>").action(renameCommand);

program.arguments("[project]").action(async (project?: string) => {
if (!project) {
program.help();
return;
}
await resolveCommand(project);
});

return program;
}
src/index.tsimport { createProgram } from "./cli/program.js";

async function main(): Promise<void> {
try {
await createProgram().parseAsync(process.argv);
} catch (error) {
const message = error instanceof Error ? error.message : "Unknown error";
console.error(`Error: ${message}`);
process.exit(1);
}
}

main();
Shell Wrapper Katmanı (Zorunlu)scripts/cdp.sh#!/usr/bin/env bash

# cdp Shell Wrapper

# Node.js PWD'yi doğrudan değiştiremediği için bu fonksiyon shell profilinize eklenmelidir.

cdp() {
if [ "$#" -eq 0 ]; then
command cdp list
return
fi

case "$1" in
init|list|remove|rename|doctor|export|import|help|--help|-h|--version|-v)
command cdp "$@"
;;
\*)
local target
target="$(command cdp "$@")" || return 1
cd "$target" || return 1
;;
esac
} 5. Kurulum ve Entegrasyon (Yerel Geliştirme)Projeyi test etmek ve makinenizde kullanmak için:Bağımlılıkları Kurun:npm install
Projeyi Derleyin:npm run build
Global Olarak Bağlayın:# CLI komutunu bilgisayarınızın PATH'ine ekler
npm link
Shell Wrapper'ı Aktif Edin (KRİTİK):
scripts/cdp.sh içeriğindeki bash fonksiyonunu kopyalayıp ~/.zshrc veya ~/.bashrc dosyanızın en altına yapıştırın. Ardından terminalinizi yeniden başlatın veya source ~/.zshrc komutunu çalıştırın.6. Kullanım SenaryolarıProjeyi Kaydetmek:cd /var/www/ecommerce-api
cdp init api
Projeleri Görüntülemek:cdp list

# Çıktı:

# api /var/www/ecommerce-api

Klasör Değiştirmek (Işınlanmak):cdp api

# PWD otomatik olarak /var/www/ecommerce-api olur.
