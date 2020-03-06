(function() {
	/* CONSTANTS */
	const size = 5; 		 // size of cell in px
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
		grid = []
		for (let i = 0; i < x; i++) {
			row = [];
			for (let j = 0; j < y; j++) {
				let alive = Math.random() < aliveodds;
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
					let tmp_x = x + offset_x;
					let tmp_y = y + offset_y;

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
		new_grid = []

		for (let x = 0; x < grid.length; x++) {
			row = []
			for (let y = 0; y < grid[x].length; y++) {

				alive = grid[x][y];
				alive_neighbors = count_alive_neighbors(grid, x, y);

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

	function create_canvas(width, height) {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.style.margin = "0 auto";
		canvas.style.display = "block";
		return canvas
	}
	
	function init_body(canvas) {
		const { body } = document;
		body.style.background = bgcolor;
		body.style.margin = 0;
		body.style["margin-top"] = (0.025 * window.innerHeight) + "px";
		body.appendChild(canvas);
	}

	function draw(grid, canvas) {
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = bgcolor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = fgcolor;
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j]) {
					ctx.fillRect(i*size, j*size, size, size);
				}
			}
		}
	}

	function init() {

		const canvas = create_canvas(cwidth, cheight);
		var grid = generate_grid(hcount, vcount);

		init_body(canvas);
		
		setInterval(() => {
			grid = step(grid);
			draw(grid, canvas);
		}, 1000 / gps);
	}

	init();
})();
