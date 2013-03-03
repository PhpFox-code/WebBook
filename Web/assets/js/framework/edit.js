/**
 * Handles editing of text, creating new chapters and sections.
 *
 * @copyright   2012 Christopher Hill <cjhill@gmail.com>
 * @author      Christopher Hill <cjhill@gmail.com>
 * @since       01/02/2013
 */
WEBBOOK.Edit = {
	// Vars
	sectionsSelector:       ".section",
	// Updating content
	sectionsUpdateInterval: 1000,
	sectionsUpdated:        [],
	// Inserting new subtitles, content, and removing section
	sectionHandlerSelector:           "#section-handler",
	sectionHandlerSectionsSelector:   ".content,.subtitle",
	sectionHandlerAddTitleSelector:   "#section-handler-title",
	sectionHandlerAddContentSelector: "#section-handler-content",
	sectionHandlerDeleteSelector:     "#section-handler-delete",

	// DOM references
	$section:                  undefined,
	$sectionHandler:           undefined,
	$sectionHandlerSections:   undefined,
	$sectionHandlerAddTitle:   undefined,
	$sectionHandlerAddContent: undefined,
	$sectionHandlerDelete:     undefined,

	/**
	 * Listen for updates to the text, and adding of new chapters and sections.
	 *
	 * @listens Section On Focus, Blur, Keyup, Paste
	 */
	init: function() {
		// Set DOM references
		this.$section                  = $(this.sectionsSelector);
		this.$sectionHandler           = $(this.sectionHandlerSelector);
		this.$sectionHandlerSections   = $(this.sectionHandlerSectionsSelector);
		this.$sectionHandlerAddTitle   = $(this.sectionHandlerAddTitleSelector);
		this.$sectionHandlerAddContent = $(this.sectionHandlerAddContentSelector);
		this.$sectionHandlerDelete     = $(this.sectionHandlerDeleteSelector);

		// Listeners
		this.$section.on("keyup paste", $.proxy(this.updated, this));
		this.$sectionHandlerSections.on("mouseenter", $.proxy(this.handlerOpen,   this));
		this.$sectionHandlerAddTitle.on("click",      $.proxy(this.insertTitle,   this))
		this.$sectionHandlerAddContent.on("click",    $.proxy(this.insertContent, this));
		this.$sectionHandlerDelete.on("click",        $.proxy(this.delete,        this));

		// Save the content every x seconds
		setInterval(function() {
			WEBBOOK.Edit.update();
		}, this.sectionsUpdateInterval);
	},

	/**
	 * The user has updated a section in some way.
	 *
	 * @param Event e
	 */
	updated: function(e) {
		this.sectionsUpdated[$(e.currentTarget).data("sectionid")] = $(e.currentTarget);
	},

	/**
	 * Save the modifications that have been made to the sections.
	 *
	 */
	update: function() {
		// Are there any changes to save?
		if (this.sectionsUpdated.length <= 0) {
			return false;
		}

		// There are sections to save
		// Loop over and update
		for (sectionId in this.sectionsUpdated) {
			// Reference to the section
			$.ajax({
				url:  "/section/update",
				type: "post",
				data: {
					section_id:      this.sectionsUpdated[sectionId].data("sectionid"),
					section_order:   this.sectionsUpdated[sectionId].data("order"),
					section_content: this.sectionsUpdated[sectionId].html(),
				}
			});
		}

		// And reset
		this.sectionsUpdated = [];
	},

	/**
	 * The user has hovered over a section that can be "handled".
	 *
	 * This means we can add a new subtitle or content section after this section,
	 * and we can also delete this section.
	 *
	 * Note: This only opens for subtitles and content blocks, since everything
	 * else is required and cannot de deleted.
	 *
	 * @param Event e
	 */
	handlerOpen: function(e) {
		// Place the section into a variable for speed
		var $el = $(e.currentTarget);

		// We want to display the handler in different positions depending if the
		// .. section is a subtitle or a cpontent block. This is because a
		// .. content block can stretch for quite a long way, so makes more sense
		// .. to display it where the mouse enters.
		var offset     = $el.offset();
		var offsetTop  = parseInt(offset.top)  + 8;
		var offsetLeft = parseInt(offset.left) - 70;

		// If this is a content section then it is a little more tricky than
		// .. subtitles. We need to make sure we do not place the handler above
		// .. or below the content.
		if ($el.hasClass("content")) {
			var offsetTopMax = offsetTop + parseInt($el.height()) - 58;
			offsetTop = parseInt(e.pageY) + 2;

			// Would we be showing the handler below the content?
			if (offsetTop > offsetTopMax) {
				offsetTop = offsetTopMax;
			}
		}

		// And show the handler
		this.$sectionHandler.hide().css({
			top:  offsetTop  + "px",
			left: offsetLeft + "px",
		}).fadeIn(750);
	},

	/**
	 * Insert a title into this chapter.
	 *
	 * @param Event e
	 */
	insertTitle: function(e) {
		alert("Coming soon");
		return false;
	},

	/**
	 * Insert a content block into this chapter.
	 *
	 * @param Event e
	 */
	insertContent: function(e) {
		alert("Coming soon");
		return false;
	},

	/**
	 * Delete a section from this book.
	 *
	 * @param Event e
	 */
	delete: function(e) {
		alert("Coming soon");
		return false;
	}
}