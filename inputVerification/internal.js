let { ObjectId } = require('mongodb');

// When set to true; all errors will also print which function they come from
const DEBUG_MODE = true;

/**
 * builds the error message for each function
 * @param {string} argName the argument's name
 * @param {string} err the error the argument generated
 * @param {string} funName the function the error happened within
 * @returns {string} the constructed error message
 */
const buildErrMsg = function buildErrMsg(argName, err, funName) {
	let retVal = `Arg: ${argName}\nError: ${err}`;

	if (DEBUG_MODE) retVal += `\nOrigin: ${funName}`;

	return retVal;
};

/**
 * verifies a defined arg is passed to the function
 * @param {*} arg the arg to verify exists
 * @param {string} argName the name of the arg to print in error (when applicable)
 * @param {string} funName the name of the function this argument is being called from
 */
const argExists = function argExists(arg, argName, funName) {
	let errStr = buildErrMsg(argName, 'required argument is missing', funName);

	if (arg === undefined) throw new Error(errStr);
};

/** verifies arg is an array
 * @param {*} arg argument to test
 * @param {string} argName the name of the arg to print in error (when applicable)
 * @param {string} funName the name of the function this argument is being called from
 */
const isArray = function isArray(arg, argName, funName) {
	let errStr = buildErrMsg(argName, 'argument is not an array', funName);

	if (!Array.isArray(arg)) throw new Error(errStr);
};

/**
 * verifies arg is an object
 * @param {*} arg argunment to test
 * @param {string} argName the name of the arg to print in error (when applicable)
 * @param {string} funName the name of the function this argument is being called from
 */
const isObj = function isObj(arg, argName, funName) {
	let errStr = buildErrMsg(argName, 'argument is not an object', funName);

	if (typeof arg !== 'object' || arg === null || Array.isArray(arg))
		throw new Error(errStr);
};

/**
 * verifies the arg is of the desired type
 * @param {*} arg argument to test
 * @param {string} argName the name of the arg to print in error (when applicable)
 * @param {string} funName the name of the function this argument is being called from
 * @param {string} desiredType type to check against
 */
const isType = function isType(arg, argName, funName, desiredType) {
	let errStr = buildErrMsg(
		argName,
		`argument is not of desired type (${desiredType})`,
		funName
	);

	switch (desiredType) {
		case 'array':
			isArray(arg, argName, funName);
			break;
		case 'object':
			isObj(arg, argName, funName);
			break;
		case 'objectId':
			if (typeof arg !== 'string') throw new Error(errStr);
			isObjId(arg, argName, funName);
			break;
		case 'number':
			if (typeof arg !== desiredType) {
				if (typeof arg === 'string') {
					try {
						parseInt(arg);
					} catch (e) {
						throw new Error(errStr);
					}
				} else {
					throw new Error(errStr);
				}
			}
			break;
		default:
			if (typeof arg !== desiredType) throw new Error(errStr);
	}
};

/**
 * verified arg is proper mongodb ObjectId
 * @param {*} id arg to verify is proper ObjectId
 * @param {string} argName name of the argument to print in errors
 * @param {string} funName the name of the function this argument is being called from
 */
const isObjId = function isObjId(id, argName, funName) {
	let errStr = buildErrMsg(
		argName,
		'argument is not a valid mongoDB ObjectId',
		funName
	);

	try {
		const parsedId = ObjectId(id);
	} catch (e) {
		throw new Error(errStr);
	}
};

/**
 * verifies str has at least 1 non-' ' character
 * @param {string} str string to verify has at least 1 non-' ' character
 * @param {string} argName the name of the arg to print in error (when applicable)
 * @param {string} funName the name of the function this argument is being called from
 */
const strNotBlanks = function strNotBlanks(str, argName, funName) {
	let errStr = buildErrMsg(
		argName,
		'argument cannot be a blank string',
		funName
	);

	const newStr = str.trim();
	if (newStr.length === 0) {
		throw new Error(errStr);
	}
};

/**
 * verifies array is not empty
 * @param {*} arr array to test size of
 * @param {string} argName the name of the arg to print in error (when applicable)
 * @param {string} funName the name of the function this argument is being called from
 */
const arrNotEmpty = function arrNotEmpty(arr, argName, funName) {
	let errStr = buildErrMsg(argName, 'argument is an empty array', funName);

	if (arr.length === 0) throw new Error(errStr);
};

/**
 * verifies object is not empty
 * @param {*} obj object to test size of
 * @param {*} argName the name of the arg to print in error (when applicable)
 * @param {string} funName the name of the function this argument is being called from
 */
const objIsNotEmpty = function objIsNotEmpty(obj, argName, funName) {
	let errStr = buildErrMsg(argName, 'argument is an empty object', funName);

	if (Object.keys(obj).length === 0) throw new Error(errStr);
};

module.exports = {
	DEBUG_MODE,
	buildErrMsg,
	argExists,
	isArray,
	isObj,
	isType,
	isObjId,
	strNotBlanks,
	arrNotEmpty,
	objIsNotEmpty
};
