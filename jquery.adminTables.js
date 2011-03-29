/**
 * @author Ken
 * ken210.com / @ken_rosaka
 * 03-28-2011
 */

(function($){ // non-conflict mode
	
$.fn.table = function(options) {
	
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
		init = function () {
			
			if (defaults.sortable) sort();

			if (defaults.paged) paginate();
	
			if (defaults.checkRows) addCheckbox();
			
			cornerClasses();
			
		},
		
		// add a checkbox on each row start
		addCheckbox = function(){
			
			var altLines = true;

			rows.each(function(){
				
				var row = $(this),
	
					// create empty checkbox
					checkbox = $('<input />',{ type: 'checkbox' }),
	
					// puts row value into checkbox
					rowValue = (row.index() === 0) ? 'checkAll' : row.children('td:first').html();
				
				// alternating lines
				if (defaults.alternate) {
					
					altLines = !altLines;
					if (altLines) row.addClass('alt');
					
				}
				
				checkbox.val(rowValue);
				
				// puts first checkbox
				row.children('th:first, td:first').html(checkbox);
				
			});
			
			// add listeners
			
			// check all
			$('input:checkbox','th').live('change', function(){
				
				var checked = $(this).is(':checked');
				$('input:checkbox',$(this).closest('table')).attr('checked',checked);
				
			});
			
			// check one
			$('input:checkbox','td').live('change', function(){
				
				if (!$(this).is('input:checked')) $('th input:checkbox',$(this).closest('table')).attr('checked',false);
				
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
		
		// main pagination method
		paginate = function(){
		
			// if there is more than 1 page
			if (totalPages > 1) {
			
				createPageButtons(); // create buttons
				
				changePage(); // trigger changePage
				
				$('.pagination a.prev').live('click',function(){
					defaults.currentPage--;
					changePage();
					return false;
				})
				
				$('.pagination a.next').live('click',function(){
					defaults.currentPage++;
					changePage();
					return false;
				})
				
				$('.pagination a.pageNumber').live('click',function(){
					defaults.currentPage = $(this).closest('li').index();
					changePage();
					return false;
				})
				
				$('.pagination a.selected').live('click',function(){
					return false;
				})
				
			}
	
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
		
		createPageButtons = function(){
			
			// create placeholder
			var placeholder = $('<div />').addClass('paginationWrap'),
		
			// create list
				list = $('<ul />').addClass('pagination'),
			
			// create previous and next button
				prev = $('<li />').append(
							$('<a />').addClass('prev')
										.attr('href','#anterior')
										.html('« Anterior')
				),
		
				next = $('<li />').append(
							$('<a />').addClass('next')
										.attr('href','#proxima')
										.html('Próxima »')
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
				
		};
	
	return this.each(function(){
		
		init();
		
	});
	
};
	
	
})(jQuery);