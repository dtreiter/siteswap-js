var generator = {

	generateSwaps:function(numBalls, maxHeight, period, limit) {
		if (maxHeight > 35 || period < 1 || numBalls < 1) // invalid inputs
			return null;

		var maxSwap = "";
		var tosses = "0123456789abcdefghijklmnopqrstuvwxyz";
		for (var i = 0; i < period; i++) {
			maxSwap += tosses[maxHeight];
		}
		if (maxHeight > 9)
			maxSwap = parseInt(maxSwap, maxHeight+1);

		var validSwaps = new Array();
		var duplicates = {};
		for (var curSwap = 0; curSwap <= maxSwap; curSwap++) {
			var testSwap;
			if (maxHeight > 9) {
				testSwap = curSwap.toString(maxHeight+1);
			} else {
				testSwap = curSwap.toString();
			}

			if (this.isValidSwap(testSwap, numBalls, maxHeight, period)) {
				if (duplicates[testSwap])
					break;

				// add duplicate swaps to hash
				for (var i = 0; i < testSwap.length; i++) {
					var dupSwap = testSwap.substring(i, testSwap.length) + testSwap.substring(0, i);
					console.log(dupSwap);
					duplicates[dupSwap] = true;
				}

				validSwaps.push(testSwap);
				if (validSwaps.length > limit)
					break;
			}
		}

		return validSwaps;
	},


	/*
	* Input swap is a string
	*/
	isValidSwap:function(swap, numBalls, maxHeight, period) {
		var residues = {};
		var avg = 0;

		for (var i = 0; i < swap.length; i++) {
			var curToss = this.numberForToss(swap[i], maxHeight); // handle a-z
			var residue = (curToss+i) % period;
			if (residues[residue] || curToss > maxHeight || swap.length != period) {
				return false;
			} else {
				residues[residue] = true;
			}
			avg += curToss;
		}
		avg /= swap.length;
		if (avg != numBalls)
			return false; 

		return true;
	},

	numberForToss:function(curToss, maxHeight) {
		if (maxHeight > 9)
			return parseInt(curToss, maxHeight+1);
		return parseInt(curToss);
	} 

}
