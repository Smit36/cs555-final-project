const standardInputs = require('./standard');
const loginInputs = require('./login');

module.exports = {
	standard: standardInputs,
	login: loginInputs
};

/**
 * Internal: Basic validation functions that other modules will use.
 * Contains DEBUG_MODE flag. Not exported.
 *
 * Standard: Exports one-time function calls to validate generic variables
 * without any specific checks. verifyArg throws in the following cases:
 * 		Arg doesn't exist (is undefined)
 * 		Arg is improper type (see param string for acceptable checks)
 * 		If string: it is blank
 * 		If Array or Object: it is empty
 *
 * Any other files are named appropiately, containing all of the above checks
 * in addition to more specific checks required of that data.
 */
