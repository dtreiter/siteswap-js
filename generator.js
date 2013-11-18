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
			if (isValidSwap(curSwap)) {
				validSwaps.push(curSwap);
			}
		}

		return validSwaps;
	},

	isValidSwap:function(swap, maxHeight, period) {
		var residues = {};
		for (var i = 0; i < swap.length; i++) {
			var curThrow = numberForThrow(swap[i]); // handle a-z
			var residue = (curThrow+i) % period;
			if (residues[residue] || curThrow > maxHeight)
				return false;
			else
				residues[residue] == true;
		}

		return true;
	},

	numberForThrow:function(curThrow) {
		return curThrow;
	}

}
