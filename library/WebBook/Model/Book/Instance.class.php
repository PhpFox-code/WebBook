<?php
namespace WebBook\Model\Book;
use Core, WebBook\Model\Chapter, WebBook\Model\Section;

/**
 * Contains information on a book.
 *
 * A book can contain one or many chapters. A chapter can contain one or many
 * sections. A section is a piece of content, such as a title or paragraph.
 *
 * @copyright 2012 Christopher Hill <cjhill@gmail.com>
 * @author    Christopher Hill <cjhill@gmail.com>
 * @version   0.3
 * @since     23/10/2012
 */
class Instance extends Repository implements \IteratorAggregate
{
	/**
	 * A collection of chapters.
	 *
	 * @access private
	 * @var    Chapter\Collection
	 */
	private $_chapterCollection;

	/**
	 * Setup a book.
	 *
	 * @access public
	 * @param  int    $bookId The book that we wish to setup.
	 */
	public function __construct($bookId) {
		// Create a collection of chapters
		$this->_chapterCollection = new Chapter\Collection();

		// Get the sections in this chapter
		$this->book_id = $bookId;
		$sections      = $this->getAllSections();

		// Loop over each section and add the instance
		while ($section = $sections->fetch()) {
			$this->_chapterCollection->add(new Section\Instance($section));
		}
	}

	/**
	 * Allow scripts to iterate over the sections.
	 *
	 * @access public
	 * @return Chapter\Instance
	 */
	public function getIterator() {
		return new \ArrayIterator($this->_chapterCollection->store);
	}
}