<?php
namespace Core\Store;

/**
 * Stores data for a single request, which does not persist.
 *
 * @copyright Copyright (c) 2012-2013 Christopher Hill
 * @license   http://www.opensource.org/licenses/mit-license.php The MIT License
 * @author    Christopher Hill <cjhill@gmail.com>
 * @package   MVC
 */
class Request implements StorageInterface
{
	/**
	 * A store for all the variables set.
	 *
	 * @access public
	 * @var    array
	 * @static
	 */
	public static $store;

	/**
	 * Check whether the variable exists in the store.
	 *
	 * @access public
	 * @param  string  $variable The name of the variable to check existence of.
	 * @return boolean           If the variable exists or not.
	 * @static
	 */
	public static function has($variable) {
		return isset(self::$store[$variable]);
	}

	/**
	 * Store a variable for use.
	 *
	 * @access public
	 * @param  string  $variable  The name of the variable to store.
	 * @param  mixed   $value     The data we wish to store.
	 * @param  boolean $overwrite Whether we are allowed to overwrite the variable.
	 * @return boolean            If we managed to store the variable.
	 * @throws Exception          If the variable already exists when we try not to overwrite it.
	 * @static
	 */
	public static function put($variable, $value, $overwrite = false) {
		// If it exists, and we do not want to overwrite, then throw exception
		if (self::has($variable) && ! $overwrite) {
			throw new \Exception("{$variable} already exists in the store.");
		}

		self::$store[$variable] = $value;
		return self::has($variable);
	}

	/**
	 * Return the variable's value from the store.
	 *
	 * @access public
	 * @param  string $variable The name of the variable in the store.
	 * @return mixed
	 * @throws Exception        If the variable does not exist.
	 * @static
	 */
	public static function get($variable) {
		// If it exists, and we do not want to overwrite, then throw exception
		if (! self::has($variable)) {
			throw new \Exception("{$variable} does not exist in the store.");
		}

		return self::$store[$variable];
	}

	/**
	 * Remove the variable in the store.
	 *
	 * @access public
	 * @param  string $variable The name of the variable to remove.
	 * @return boolean          If the variable was removed successfully.
	 * @throws Exception        If the variable does not exist.
	 * @static
	 */
	public static function remove($variable) {
		// If it exists, and we do not want to overwrite, then throw exception
		if (! self::has($variable)) {
			throw new \Exception("{$variable} does not exist in the store.");
		}

		// Unset the variable
		unset(self::$store[$variable]);

		// Was it removed
		return ! self::has($variable);
	}
}