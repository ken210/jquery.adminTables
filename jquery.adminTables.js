/**
 * @author Ken
 * ken210.com / @ken_rosaka
 * 03-28-2011
 */

(function($){ // non-conflict mode
	
$.fn.adminTable = function(options) {
	
	// optional configs
	var defaults = {

		// default to alternate lines
		alternate : true,
		
		// default to addCheckbox
		checkRows : true,
		
		// default to sort table
		sortable : true,
		
		// pagination defaults
		paged : true,
		perPage : 10,
		currentPage : 1
		
	};
	
	// merge defaults with options
	$.extend(defaults, options);
	
	// caching selectors
	var table = this,
		rows = this.find('tbody').find('tr'),
	
		totalResults = rows.length,
		totalPages = Math.ceil(totalResults / defaults.perPage),
	
	
		// methods
		
		// add a checkbox on each row start
		addCheckbox = function(){
			
			// create checkAll checkbox
			$('<input />',{

				type: 'checkbox',
				value: 'checkAll'

			}).appendTo($('th:first','thead'));
			
			// create other checkboxes
			var altLines = true;

			rows.each(function(){
				
				var row = $(this),
	
					// create empty checkbox
					checkbox = $('<input />',{ type: 'checkbox' }),
	
					// puts row value into checkbox
					rowValue = row.children('td:first').html();
				
				// alternating lines
				if (defaults.alternate) {
					
					altLines = !altLines;
					if (altLines) row.addClass('alt');
					
				}
				
				checkbox.val(rowValue);
				
				// puts first checkbox
				row.children('th:first, td:first').html(checkbox);
				
			});
			
		},
		
		// adds classes for corner cells
		cornerClasses = function(){
			
			table.find('tr:last','tbody').addClass('last');
			table.find('th:first','tr').addClass('first');
			table.find('th:last','tr').addClass('last');
			
		},
		
		// adds sort method
		sort = function(){
			
			table.tablesorter({ 
		        
				// pass the headers argument and assing a object 
				headers: { 
					// first column (checkboxes)
					0: {
						// disable sorting
						sorter: false
					}
				}
			});
		},
		
		// method to handle page changes
		changePage = function(){
			
			var start = (defaults.currentPage - 1) * defaults.perPage,
			
				end = start + defaults.perPage;
	
			$('.pagination a.prev, .pagination a.next').show();
			
			if (defaults.currentPage <= 1)
				$('.pagination a.prev').hide();
			
			else if (defaults.currentPage >= totalPages)
				$('.pagination a.next').hide();
			
			$('.pagination a.pageNumber').each(function(){
				
				$(this).removeClass('selected');
				
				if ($(this).closest('li').index() == defaults.currentPage)
					$(this).addClass('selected');
	
			});
			
			rows.hide()
				.slice(start,end).show();
				
			
		},
		
		changePageDown = function(){
			
			defaults.currentPage--;
			
			changePage();
			
			return false;

		},
		
		changePageUp = function(){
			
			defaults.currentPage++;
			
			changePage();
			
			return false;

		},
		
		changePageNumber = function(){
			
			defaults.currentPage = $(this).closest('li').index();
			
			changePage();
			
			return false;

		},
		
		createPageButtons = function(){
			
			// create placeholder
			var placeholder = $('<div />').addClass('paginationWrap'),
		
			// create list
				list = $('<ul />').addClass('pagination'),
			
			// create previous and next button
				prev = $('<li />').append(
							$('<a />').addClass('prev')
										.attr('href','#anterior')
										.html('« Previous')
				),
		
				next = $('<li />').append(
							$('<a />').addClass('next')
										.attr('href','#proxima')
										.html('Next »')
				);
				
			for (var i = 1; i <= totalPages; i++) {
				
				$('<li />').append(
					$('<a />')
						.addClass('pageNumber')
						.attr('href','#'+i)
						.html(i)
				).appendTo(list);
				
			}
			
			list.prepend(prev)
				.append(next)
				.appendTo(placeholder);
			
			placeholder.appendTo($(table).closest('div'));
				
		},
		
		checkOne = function (event) {
			
			if (!$(event.target).is('input:checked')) $('th input:checkbox',$(event.target).closest('table')).removeAttr('checked');
			
		},
		
		checkAll = function (event) {
			
			var checked = $(event.target).is(':checked');
			
			$('input:checkbox',$(event.target).closest('table')).attr('checked',checked);

		};
		
	return this.each(function(){
		
		if (defaults.sortable) {
			
			sort();
			
		}

		cornerClasses();

		if (defaults.paged && totalPages > 1) {
			
			createPageButtons(); // create buttons
			
			changePage(defaults.currentPage); // go to default page
			
			// listerners
			
			$('.pagination a.prev').bind('click', changePageDown);
			
			$('.pagination a.next').bind('click', changePageUp);
			
			$('.pagination a.pageNumber').bind('click', changePageNumber);
			
			$('.pagination a.selected').bind('click',function(){ return false; });
			
		}

		if (defaults.checkRows) {
			
			addCheckbox(); // create checkboxes
			
			// listeners
			
			$('input','td:first').bind('change',checkOne);
		
			$('input','th:first').bind('change',checkAll);
			
			
		}
		
	});
	
};
	
	
})(jQuery);