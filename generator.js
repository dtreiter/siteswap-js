var generator = {
	// var numBalls, maxHeight, period;

	generateSwaps:function(numBalls, maxHeight, period) {
		// this.numBalls = numBalls;
		// this.maxHeight = maxHeight;
		// this.period = period;

		// NOTE: this only works for throws up to 9. Make more general...
		var maxSwap = Math.pow(10, (period+1)) - 1;
		var validSwaps = new Array();
		for (var curSwap = 0; curSwap < maxSwap; curSwap++) {
			if (this.isValidSwap(curSwap, numBalls, maxHeight, period)) {
				validSwaps.push(curSwap);
			}
		}

		return validSwaps;
	},

	isValidSwap:function(swap, numBalls, maxHeight, period) {
		var residues = {};
		swap = swap.toString();
		var avg = 0;
		for (var i = 0; i < swap.length; i++) {
			var curThrow = this.numberForThrow(swap[i]); // handle a-z
			var residue = (curThrow+i) % period;
			if (residues[residue] || curThrow > maxHeight || swap.length != period) {
				return false;
			} else {
				residues[residue] = true;
			}
			avg += parseInt(swap[i]);
		}
		avg /= swap.length;
		if (avg != numBalls)
			return false; 

		return true;
	},

	numberForThrow:function(curThrow) {
		return curThrow;
	}

}
