var generator = {

	generateSwaps:function(numBalls, maxHeight, period) {
		if (maxHeight > 35 || period < 1 || numBalls < 1) // invalid inputs
			return null;

		var maxSwap = "";
		var tosses = "0123456789abcdefghijklmnopqrstuvwxyz";
		for (var i = 0; i < period; i++) {
			maxSwap += tosses[maxHeight];
		}

		validSwaps = new Array();
		for (var curSwap = 0; curSwap < parseInt(maxSwap, maxHeight+1); curSwap++) {
			var testSwap;
			if (maxHeight > 9) {
				testSwap = curSwap.toString(maxHeight+1);
			} else {
				testSwap = curSwap.toString();
			}

			if (this.isValidSwap(testSwap, numBalls, maxHeight, period)) {
				validSwaps.push(testSwap);
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
