/**
 * Handles inserting and deleting chapters.
 *
 * @copyright   2012 Christopher Hill <cjhill@gmail.com>
 * @author      Christopher Hill <cjhill@gmail.com>
 * @since       08/03/2013
 */
WEBBOOK.Chapter = {
	// Vars
	chapterSelector:       ".chapter",
	chapterInsertSelector: ".chapter-insert",
	chapterDeleteSelector: ".chapter-delete",

	// DOM references
	$chapter: undefined,

	/**
	 * Sets up the chapter handling.
	 *
	 * @listens Chapter_Insert On Click      Insert a new chapter.
	 * @listens Chapter_Delete On Click      Delete the chapter.
	 * @listens Book           On MouseLeave Hide the section handler.
	 *
	 * @listens Chapter_Inserted A new chapter has been inserted, reindex the chapters.
	 */
	init: function() {
		// Set DOM references
		this.$chapter = $(this.chapterSelector);

		// Listeners
		WEBBOOK.Book.$book.on("click",      this.chapterInsertSelector, $.proxy(this.insert, this));
		WEBBOOK.Book.$book.on("click",      this.chapterDeleteSelector, $.proxy(this.delete, this));
		WEBBOOK.Book.$book.on("mouseleave", function() { WEBBOOK.Section.handlerClose(); });

		// Listeners (via triggers)
		$(document).on("Chapter_Inserted", $.proxy(this.chapterReindex, this));
	},

	/**
	 * A chapter has been inserted or deleted, reindex the chapters.
	 *
	 * @param Event e
	 */
	chapterReindex: function(e) {
		this.$chapter = $(this.chapterSelector);
	},

	/**
	 * Inserts a new chapter into the book.
	 *
	 * @param Event e
	 *
	 * @triggers Chapter_Inserted If we managed to insert the chapter.
	 */
	insert: function(e) {
		// Get the chapter DOM element
		var $el = $(e.currentTarget).parents(this.chapterSelector);

		// The order of the new section
		var order = parseInt($el.data("chapterid")) + 1;

		// Increment the sections *after* this new section will be added
		this.$chapter.filter(function() {
			if (parseInt($(this).data("chapterid")) >= order) {
				$(this).data().chapterid++;
			}
		});

		// Insert the section via Ajax
		$.ajax({
			url:  "/chapter/insert",
			type: "post",
			data: {
				book_id:    WEBBOOK.Book.bookId,
				chapter_id: order
			},
			success: function(data) {
				// Grab the new chapter
				var $chapter  = $el.after(data).next(WEBBOOK.Chapter.chapterSelector);

				// Scroll to the new chapter
				$("html,body").animate({ scrollTop: $chapter.offset().top - 50 });

				// Let the user know which chapter has been added by flashing
				$chapter
					.animate({ backgroundColor: "#FFFFAA" }, 750)
					.animate({ backgroundColor: "#FFFFFF" }, 2000);

				// Select the content to save the user a couple keystrokes
				$chapter
					.find(WEBBOOK.Section.sectionsSelector)
					.first()
					.focus();
				document.execCommand("selectAll", false, null);

				// Let others know what just happened
				$(document).trigger({ type: "Chapter_Inserted" });
				$(document).trigger({ type: "Section_Inserted" });
			},
			error: function() {
				alert("Sorry, we were unable to load the page :(");
			}
		});

		return false;
	},

	/**
	 * Deletes a chapter from the book.
	 *
	 * @param Event e
	 *
	 * @triggers Chapter_Deleted If we managed to delete the chapter.
	 */
	delete: function(e) {
		// Hide the delete icon
		$(e.currentTarget).fadeOut(75);

		// Get the chapter DOM element
		var $el = $(e.currentTarget).parents(this.chapterSelector);

		// Insert the section via Ajax
		$.ajax({
			url:  "/chapter/delete",
			type: "post",
			data: {
				book_id:    WEBBOOK.Book.bookId,
				chapter_id: $el.data("chapterid")
			},
			success: function() {
				// Hide the chapter
				// Note: To create a smooth animation, the margin and padding
				// .. (only top and bottom) need to be removed, otherwise you
				// .. will get a "jump" once it is removed.
				$el.animate({
					opacity:       0,
					height:        0,
					margin:        0,
					paddingTop:    0,
					paddingBottom: 0
				}, 1000, function() {
					$(this).remove();
				});

				// Let others know what just happened
				$(document).trigger({ type: "Chapter_Removed" });
				$(document).trigger({ type: "Section_Deleted" });
			},
			error: function() {
				alert("Sorry, we were unable to load the page :(");
			}
		});

		return false;
	}
}