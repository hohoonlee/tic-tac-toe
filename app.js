const User = class {
	constructor(display, board) {
		this._display = display;
		this._board = board;
	}
	get display() {
		return this._display;
	}
	check(point) {
		return this._board.point(point, this);
	}
}

const Board = class {
	constructor(renderer) {
		this._board = [...new Array(9)];
		this._renderer = renderer;
	}
	point(pt, user) {
		this._board[pt] = user.display;
		return this.display();
	}
	display() {
		this._renderer.show(this._board);
		if(this.isComplete()) {
			this._renderer.end(this._winner);
			return true;
		}
		return false;
	}
	emptyList() {
		return this._board.reduce((m,v,i)=>{
			if(!v) m.push(i);
			return m;
		},[]);
	}
	isComplete() {
		const win = [
			[0,1,2], [3,4,5], [6,7,8],
			[0,3,6], [1,4,7], [2,5,8],
			[0,4,8], [2,4,6]
		];
		for(let row of win) {
			if(!this._board[row[0]]) continue;
			if(this._board[row[0]] === this._board[row[1]] && this._board[row[0]] === this._board[row[2]]) {
				this._winner = this._board[row[0]];
				return true;
			}
		}
		return (this._board.every(v=>v));
	}
}

const ConsoleRenderer = class {
	show(list) {
		console.log('-------------');
		console.log(
			list.reduce((m, v, i)=>{
				m[Math.floor(i / 3)].push(v?v:' ');
				return m;
			},[[],[],[]]).join('\n')
		);
		console.log('-------------');
	}
	end(winner) {
		if(winner) {
			console.log(`${winner} WIN!`);
		}
		console.log('GAME END');
	}
}


if(typeof process === 'object' && typeof global === 'object') {
	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'TIC-TAC-TOE> '
	});

	const board = new Board(new ConsoleRenderer());
	const user 	= new User('O', board);
	const me 	= new User('X', board);
	board.display();

	rl.prompt();

	rl.on('line', (pt) => {
		if(user.check(pt)) return process.exit();
		
		setTimeout(() => {
			let emptyList = board.emptyList();
			if(emptyList && !me.check(emptyList[Math.floor(Math.random() * emptyList.length)])) return rl.prompt();
			process.exit();
		}, 1000);
	});
}