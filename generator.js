var generator = {
	
	generateSwaps:function(numBalls, maxHeight, period) {
		var maxSwap = 10^period;
		for (var i = 0; i < ; i++) {

		}
	},

	validateSwap:function(swap, maxHeight, period) {
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