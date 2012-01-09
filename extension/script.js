// ==UserScript== 
// @name Basecamp Week Numbers
// @include https://*.basecamphq.com/*
// ==/UserScript==

var add_jq = function(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
};
function main(){
	var j = jQuery.noConflict();
	var WeekNumbers = {
		init: function() {
			WeekNumbers.addWeeks();
			
			var container = jQuery('.calendar_container');
			
			WeekNumbers.startDay = container.data('calendar-start-day');
			
			container = container[0];
			container.addEventListener("DOMNodeInserted", WeekNumbers.addWeeks);
		},
		addWeeks: function() {
			
			j('.month_row_events').each(function(){
				if ( j(this).hasClass('owc-modified') )
					return;
					
				var d = j(this).find('td:first-child').data('date');
				var date = new Date(d);
				var weekNumber = WeekNumbers.getWeek(date, WeekNumbers.startDay);
				
				j(this).addClass('owc-modified').parent().prev('.month_row_spanned_position').append('<span class="owc-week-number">' + weekNumber + '</span>');
			});
			
		},
		getWeek: function (date) {
		/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
			dowOffset = WeekNumbers.startDay;
			dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
			var newYear = new Date(date.getFullYear(),0,1);
			var day = newYear.getDay() - dowOffset; //the day of week the year begins on
			day = (day >= 0 ? day : day + 7);
			var daynum = Math.floor((date.getTime() - newYear.getTime() - 
			(date.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
			var weeknum;
			//if the year starts before the middle of a week
			if(day < 4) {
				weeknum = Math.floor((daynum+day-1)/7) + 1;
				if(weeknum > 52) {
					nYear = new Date(date.getFullYear() + 1,0,1);
					nday = nYear.getDay() - dowOffset;
					nday = nday >= 0 ? nday : nday + 7;
					/*if the next year starts before the middle of
					  the week, it is week #1 of that year*/
					weeknum = nday < 4 ? 1 : 53;
				}
			}
			else {
				weeknum = Math.floor((daynum+day-1)/7);
			}
			return weeknum;
		}
	};
	WeekNumbers.init();
}
add_jq(main);