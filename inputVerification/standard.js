const internal = require('./internal');

module.exports = {
	/**
	 * generic function to perform basic validation checks
	 * on a function's given arguments
	 * @param {*} arg the argument to validate
	 * @param {string} argName the name of the argument
	 * @param {string} funName the function the argument is being passed to
	 * @param {string} desiredType the desired data type of the argument: boolean, number, string, array, object, objectId
	 */
	verifyArg(arg, argName, funName, desiredType) {
		internal.argExists(arg, argName, funName);
		internal.isType(arg, argName, funName, desiredType);

		switch (desiredType) {
			case 'string':
				internal.strNotBlanks(arg, argName, funName);
				break;
			case 'array':
				internal.arrNotEmpty(arg, argName, funName);
				break;
			case 'object':
				internal.objIsNotEmpty(arg, argName, funName);
				break;
			default:
				return;
		}
	},

	/**
	 * verifies an arg is NOT passed to the function
	 * @param {*} arg dummy argument that your function shouldn't have
	 * @param {string} funName the name of the function to print in error (when applicable)
	 */
	argDNE(arg, funName) {
		if (typeof arg !== 'undefined')
			throw new Error(`${funName} takes no arguments`);
	},

	/**
	 * verifies a numerical arg is within accepted range
	 * @param {number} num number to verify the range of
	 * @param {string} argName the name of the arg to print in error (when applicable)
	 * @param {string} funName the name of the function this argument is being called from
	 * @param {number} lower lower bound (inclusive)
	 * @param {number} upper upper bound (inclusive)
	 */
	numRange(num, argName, funName, lower, upper) {
		let errStr = internal.buildErrorMsg(
			argName,
			`argument must between ${lower} and ${upper}, inclusive, not ${num}`,
			funName
		);

		if (num < lower || num > upper) {
			throw new Error(errStr);
		}
	}
};
