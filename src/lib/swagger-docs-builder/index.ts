import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import schema from '$lib/fetcher/schema/index';

export async function swaggerDocBuilding() {
	console.log('schema', schema);
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	const versions = fs
		.readdirSync(__dirname)
		.filter((f) => /^v\d+/.test(f) && fs.statSync(path.join(__dirname, f)).isDirectory());

	for (const ver of versions) {
		const basePath = path.join(__dirname, ver);
		const base = JSON.parse(fs.readFileSync(path.join(basePath, 'base.json'), 'utf-8'));
		const pathJsonPath = path.join(basePath, 'paths.json');
		let paths = {};
		if (fs.existsSync(pathJsonPath)) {
			paths = JSON.parse(fs.readFileSync(pathJsonPath, 'utf-8'));
		}
		base.paths = paths;
		const outPath = path.join(basePath, 'swagger.json');
		fs.writeFileSync(outPath, JSON.stringify(base, null, 2));

		// 先確保目標資料夾存在
		const destDir = path.join('static', 'docs', ver);
		if (!fs.existsSync(destDir)) {
			fs.mkdirSync(destDir, { recursive: true });
		}
		// 複製 swagger.json 檔案
		fs.copyFileSync(
			path.join('src/lib/swagger-docs-builder', ver, 'swagger.json'),
			path.join(destDir, 'swagger.json')
		);
		console.log(`已複製 swagger.json 至 ${destDir}/swagger.json`);
	}
}
