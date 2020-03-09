(function() {
	/* CONSTANTS */
	const size = 10 * window.devicePixelRatio; 	// size of cell in px
	const bgcolor = "black";
	const fgcolor = "purple";
	const gps = 10;			 // generations per second
	const aliveodds = 0.5;	 // probability of living cell in initial grid generation
	const cwidth = 0.95 * window.innerWidth;
	const cheight = 0.95 * window.innerHeight;
	const hcount = Math.floor(cwidth / size);
	const vcount = Math.floor(cheight / size);

	// returns a random initial generation
	function generate_grid(x, y) {
		const grid = []
		for (let i = 0; i < x; i++) {
			const row = [];
			for (let j = 0; j < y; j++) {
				const alive = Math.random() < aliveodds;
				row.push(alive);
			}
			grid.push(row);
		}
		return grid;
	}

	function count_alive_neighbors(grid, x, y) {
		let alive_neighbors = 0;

		for (let offset_x = -1; offset_x < 2; offset_x++) {
			for (let offset_y = -1; offset_y < 2; offset_y++) {

				if (offset_y || offset_x) {
					const tmp_x = x + offset_x;
					const tmp_y = y + offset_y;

					if (tmp_x >= 0
						&& tmp_y >= 0
						&& tmp_x < grid.length
						&& tmp_y < grid[x].length) {
							alive_neighbors += grid[tmp_x][tmp_y];
					}
				}
			}
		}
		return alive_neighbors;
	}

	// generates a new generation from an older one
	function step(grid) {
		const new_grid = []

		for (let x = 0; x < grid.length; x++) {
			const row = []
			for (let y = 0; y < grid[x].length; y++) {

				let alive = grid[x][y];
				const alive_neighbors = count_alive_neighbors(grid, x, y);

				if (alive && ( (alive_neighbors < 2) || (alive_neighbors > 3) ) ) {
					alive = 0;
				} else if (!alive && (alive_neighbors === 3)) {
					alive = 1;
				}

				row.push(alive);
			}
			new_grid.push(row);
		}
		return new_grid;
	}

	function init_body(canvas) {
		const { body } = document;
		body.style.background = bgcolor;
		body.style.margin = 0;
		body.style["margin-top"] = (0.025 * window.innerHeight) + "px";
		body.appendChild(canvas);
	}

	function create_canvas(width, height) {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.style.margin = "0 auto";
		canvas.style.display = "block";
		init_body(canvas);
		return canvas
	}
	
	function draw(grid, canvas) {
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = bgcolor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = fgcolor;
		ctx.strokeStyle = "#222";
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j]) {
					ctx.fillRect(i*size, j*size, size, size);
				} else {
					ctx.beginPath();
					ctx.rect(i*size, j*size, size, size);
					ctx.stroke();
				}
			}
		}
	}

	function init() {

		const canvas = create_canvas(cwidth, cheight);
		let grid = generate_grid(hcount, vcount);

		canvas.onclick = (e) => {
			const x = Math.floor((e.clientX - canvas.offsetLeft) / size);
			const y = Math.floor((e.clientY - canvas.offsetTop) / size);
			grid[x][y] = !grid[x][y];
			draw(grid, canvas);
		}

		function startInterval() {
			return setInterval(() => {
				grid = step(grid);
				draw(grid, canvas);
			}, 1000 / gps);
		}

		let id = startInterval();
		document.onkeydown = () => id = id ? clearInterval(id) : startInterval();
	}

	init();
})();
