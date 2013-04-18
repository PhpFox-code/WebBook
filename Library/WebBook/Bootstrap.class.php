<?php
namespace WebBook;
use Core, WebBook\Model;

class Bootstrap
{
	/**
	 * A request has been initiated.
	 *
	 * This event is triggered just before the controller is loaded.
	 *
	 * <ul>
	 *     <li>controller - The name of the controller being loaded.</li>
	 *     <li>action     - The name of the action being loaded.</li>
	 * </ul>
	 *
	 * @access public
	 * @param  array  $params Parameters passed into this state update.
	 * @static
	 *
	 * @todo Does the user have access to this book?
	 * @todo If there is no user logged in and the book is private, redirect.
	 */
	public static function initRequest($params) {
		// Get the ID's
		// Note: All Ajax requests are POST'ed
		$userId     = 1;
		$bookId     = Core\Request::isAjax()
			? Core\Request::post('book_id', false)
			: Core\Request::get('id', false);
		$snapshotId = Core\Request::get('snapshot', false);

		// Set the user, book, and settings
		Core\StoreRequest::put('user',     new Model\User\Instance($userId));
		Core\StoreRequest::put('book',     new Model\Book\Instance($bookId, $snapshotId));
		Core\StoreRequest::put('settings', new Model\Settings\Instance($bookId));
	}

	/**
	 * A controller has been loaded.
	 *
	 * This event is triggered just after a controller is initiated, and just
	 * before the action is loaded.
	 *
	 * <ul>
	 *     <li>controller - The Core\Controller object.</li>
	 * </ul>
	 *
	 * @access public
	 * @param  array  $params Parameters passed into this state update.
	 * @static
	 */
	public static function initController($params) {
		// Add variables to the view
		$params['controller']->view->addVariable('book',      Core\StoreRequest::get('book'));
		$params['controller']->view->addVariable('user',      Core\StoreRequest::get('user'));
		$params['controller']->view->addVariable('settings',  Core\StoreRequest::get('settings'));
		$params['controller']->view->addVariable('urlRoot',   Core\Config::get('path',     'root'));
		$params['controller']->view->addVariable('appStatus', Core\Config::get('settings', 'status'));

		// If it is an ajax request then we just want a snippet of information,
		// .. we do not want the entire layout.
		if (Core\Request::isAjax()) {
			$params['controller']->setLayout(false);
		}
	}

	/**
	 * An action is just about to be loaded.
	 *
	 * This event is triggered just before an action is loaded.
	 *
	 * <ul>
	 *     <li>controller - The Core\Controller object.</li>
	 *     <li>action     - The name of the action which is about to be loaded.</li>
	 * </ul>
	 *
	 * @access public
	 * @param  array  $params Parameters passed into this state update.
	 * @static
	 */
	public static function initAction($params) {
		// Do nothing
	}

	/**
	 * A request has completed, and ready to be shutdown.
	 *
	 * <ul>
	 *     <li>controller - The name of the controller that was rendered.</li>
	 *     <li>action     - The name of the action that was rendered.</li>
	 * </ul>
	 *
	 * @access public
	 * @param  array  $params Parameters passed into this state update.
	 * @static
	 */
	public static function initShutdown($params) {
		// Do nothing
	}
}