import {
	Graph,
	scaleIndices,
	intersection
} from './graph.js'

class Triad {
	constructor(root_, type_) {

		this.root = root_;
		this.type = type_;
		this.linkedTo = [];
		this.visited = false;
		this.initChroma()

	}

	initChroma() {
		var vals = {
			'+': [0, 4, 7],
			'-': [0, 3, 7]
		}

		this.chroma = []
		var temp = vals[this.type]
		for (var i = 0; i < temp.length; i++) {
			this.chroma.push((temp[i] + this.root) % 12);
		}

		this.chroma.sort(function(a, b) {
			return a - b
		});
		//console.log('love')

	}

	findYourNeighbors(sets) {
		//console.log(this.chroma)
		//loop through sets, a two dimensional array, and link yourself to those sets that have exactly three chroma in common
		for (var i = 0; i < sets.length; i++) {
			for (var j = 0; j < sets[i].length; j++) {
				if (sets[i][j] != this && sets[i][j]!=null) {
					//console.log(intersection)
					// console.log(intersection(this.chroma, sets[i][j].chroma))
					if (intersection(this.chroma, sets[i][j].chroma) ==2
						// &&!containsRuns(this.chroma, sets[i][j].chroma)
						) {
						this.linkedTo.push(sets[i][j])
					}
				}
			}
		}
	}
}

export class TriadGraph extends Graph {
	constructor() {
		super()
		this.populate();
		this.link();
	}

	populate() {
		// var self = this;
		//populate all non-symetrical scales
		for (var i = 0; i < 12; i++) {
			this.sets[i][scaleIndices['+']] = new Triad(i, '+')
			this.sets[i][scaleIndices['-']] = new Triad(i, '-')
		}
	}

	link() {

		for (var i = 0; i < this.sets.length; i++) {
			for (var j = 0; j < this.sets[i].length; j++) {
				//for every extant pent
				if (this.sets[i][j]) {
					this.sets[i][j].findYourNeighbors(this.sets)
				}

			}
		}


	}

	getPath(array) {
		//return a path that represents the shortest route through the scales contained in array.
		// each scale represented by an object { root: int, type: string}
		// array.forEach(function(s){
		// 	console.log(s.root)
		// })


		var s0 = this.sets[array[0].root][scaleIndices[array[0].type]]
		var s1 = this.sets[array[1].root][scaleIndices[array[1].type]]
		return this.BFS(s0, s1)
	}
}