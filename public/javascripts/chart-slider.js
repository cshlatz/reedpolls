 let values = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-']

// Initialize the slider
$("#chart-slider").slider({
    min: 0,
    max: 11,
    step: 1,
	value: 11,
    slide: function(event, ui) {
        $("#poll-grade").text(values[ui.value]);
        myChart.update();
    }
}).each(function() { // Build the labels
    // Get the options for this slider
    var opt = $(this).data().uiSlider.options;
    
    // Get the number of possible values
    var vals = opt.max - opt.min;
    
    // Space out values
    for (var i = 0; i <= vals; i++) {
        var el = $('<label>'+(values[i])+'</label>').css('left',(i/vals*100)+'%');
        $( "#chart-slider" ).append(el);
      
    }
});
