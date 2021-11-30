const standard = require('./standard');
const internal = require('./internal');

const verifyHasOnlyAlphanumeric = function verifyHasOnlyAlphanumeric(
	str,
	funName
) {
	let errStr = internal.buildErrMsg(
		'username',
		'username must contain only alphanumeric characters',
		funName
	);

	const regEx = /^[0-9a-zA-Z]+$/;

	if (!str.match(regEx)) throw new Error(errStr);
};

const verifyNoSpaces = function verifyNoSpaces(password, funName) {
	for (char in password) {
		if (char === ' ') {
			throw new Error(
				internal.buildErrMsg(
					'password',
					'password may not contain spaces',
					funName
				)
			);
		}
	}
};

module.exports = {
	/**
	 * performs all necessary validation checks on username
	 * @param {string} username the inputted username
	 * @param {string} funName the function place where this is being called from
	 */
	verifyUsername(username, funName) {
		standard.verifyArg(username, 'username', funName, 'string');
		verifyHasOnlyAlphanumeric(username, funName);

		if (username.length < 4) {
			throw new Error(
				internal.buildErrMsg(
					'username',
					'username must be at least four characters',
					funName
				)
			);
		}
	},

	/**
	 * performs all necessary validation checks on password
	 * @param {string} password the inputted password
	 * @param {string} funName the function place where this is being called from
	 */
	verifyPassword(password, funName) {
		standard.verifyArg(password, 'password', funName, 'string');
		verifyNoSpaces(password, funName);

		if (password.length < 6) {
			throw new Error(
				internal.buildErrMsg(
					'password',
					'password must be at least six characters',
					funName
				)
			);
		}
	}
};
