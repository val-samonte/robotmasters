// Import the wasm-bindgen glue code and WASM
import init, { RmGameEngine, InitOutput } from './wasm_bindgen_wrapper.js';
import wasmModule from './wasm_bindgen_wrapper_bg.wasm'; // Direct WASM import
import './wasm_bindgen_wrapper'; // Type definitions

// Cached WASM module and game engine instance
let wasm: InitOutput | null = null;
let gameEngine: RmGameEngine | null = null;

interface Entity {
	entity: number;
	x: number;
	y: number;
	width: number;
	height: number;
	energy?: number;
	health?: number;
}

interface GameState {
	state: number;
	frame: number;
	gravity: number;
	entities: Entity[];
}

const tiles = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const initialObjects = [
	{
		id: 'bulletman1',
		group: 0,
		x: 16,
		y: 192,
		width: 16,
		height: 32,
		behaviors: [
			[4, 5, 0],
			// [9, 4, 20],
			[2, 3, 6],
			[8, 2, 3],
			[7, 8, 0],
			[8, 7, 0],
			[1, 1, 1],
			[10, 0, 0],
		],
		weapons: [
			[
				1, // firearm
				1, // projectile lookup index
				1, // projectile ejection method (single, tri45, tri90, shotgun90, up, down) todo: replace with ejection "script"
				2, // attack energy cost
				5, // reload energy cost
				120, // reload cooldown
				5, // ammo cap
				15, // rate of fire
				0, //   outputPosX = 0,
				12, //   outputPosY = 12,
				1, //   outputCount = 1, // note: loop, attackCounter still counts individually
				0, //   recoil = 0,
				0, //   requireGrounded,
			],
		],
		protections: [
			0, // Punct
			0, // Blast
			0, // Force
			0, // Sever
			0, // Heat
			0, // Cryo
			0, // Jolt
			0, // Virus
		],
	},
	{
		id: 'bulletman2',
		group: 1,
		x: 32,
		y: 192,
		width: 16,
		height: 32,
		behaviors: [
			[4, 5, 0],
			// [9, 4, 20],
			[2, 3, 6],
			[8, 2, 3],
			[7, 8, 0],
			[8, 7, 0],
			[1, 1, 1],
			[10, 0, 0],
		],
		weapons: [
			[
				1, // firearm
				1, // projectile lookup index
				1, // projectile ejection method (single, tri45, tri90, shotgun90, up, down) todo: replace with ejection "script"
				2, // attack energy cost
				5, // reload energy cost
				120, // reload cooldown
				5, // ammo cap
				15, // rate of fire
				0, //   outputPosX = 0,
				12, //   outputPosY = 12,
				1, //   outputCount = 1, // note: loop, attackCounter still counts individually
				0, //   recoil = 0,
				0, //   requireGrounded,
			],
		],
		protections: [
			0, // Punct
			0, // Blast
			0, // Force
			0, // Sever
			0, // Heat
			0, // Cryo
			0, // Jolt
			0, // Virus
		],
	},
];

async function initializeWasm(): Promise<void> {
	if (!wasm) {
		// Initialize the WASM module directly with the imported WASM
		wasm = await init(wasmModule);

		// Create an instance of RmGameEngine
		gameEngine = new RmGameEngine(333, initialObjects, tiles, 0.5);
	}
}

export default {
	async fetch(request: Request): Promise<Response> {
		// Ensure WASM is initialized
		await initializeWasm();

		if (!gameEngine) {
			return new Response('Failed to initialize game engine', { status: 500 });
		}

		// Call get_frame and return the result
		let snapshot: GameState;

		while (true) {
			snapshot = gameEngine.next_frame() as GameState;
			if (snapshot.state === 2) {
				break;
			}
		}

		return new Response(JSON.stringify(snapshot), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
