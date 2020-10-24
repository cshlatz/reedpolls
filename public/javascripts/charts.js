function filterByGrade(grade) {
    let grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-']
    let selectedGrade = $("#poll-grade").text();

    // If poll grade is blank, assume a C
    if (!grade) {
        grade = 'C';
    }

    // If poll grade is probationary, assume the higher value + minus ex: (A/B = A-)
    if (grades.indexOf(grade) === -1) {
        grade = grade.split('/')[0] + '-';
    }

    return (grades.indexOf(grade) <= grades.indexOf(selectedGrade)) ? true : false
}

function formatData(oldData, candidate) {
    var newData = {x: [], y: []};
    for (var i = 0; i < oldData.length; i++) {
        if (!filterByGrade(oldData[i].grade)) {
            continue
        }
        if (!oldData[i][candidate]) {
            continue;
        }
        if (parseInt(oldData[i].end_date) !== 2020) {
            continue;
        }
        newData.x.push(oldData[i][candidate]);
        newData.y.push(new Date(oldData[i].end_date));
    }

    return newData;
}

function tooltip(question) {

}

$(document).ready(function () {
    let grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-']
    var ctx = document.getElementById('poll-chart');
    var data = $('.data');
    var chartData = JSON.parse(data[0].textContent);
    var myChart = new Chart(ctx, {
        type: 'bar',
        responsive: false,
        data: {
            labels: formatData(chartData, "Biden").y,
            datasets: [{
                label: 'Biden',
                data: formatData(chartData, "Biden").x,
                backgroundColor: '#005eff',
                fill: false,
                parsing: {
                    xAxisKey: 'end_date',
                    yAxisKey: 'Biden'
                }
            },
            {
                label: 'Trump',
                data: formatData(chartData, "Trump").x,
                backgroundColor: '#ff0000',
                fill: false,
                parsing: {
                    xAxisKey: 'end_date',
                    yAxisKey: 'Trump'
                }
            }]
        },
        options: {
            elements: {
                rectangle: {
                    borderWidth: 2
                }
            },
            maintainAspectRatio: true,
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return value.toDateString();
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100
                    }
                }]
            }
        }
    });
    
    // Initialize the slider
    $("#chart-slider").slider({
        min: 0,
        max: 11,
        step: 1,
    	value: 11,
        slide: function(event, ui) {
            $("#poll-grade").text(grades[ui.value]);

            // Update the chart
            myChart.data.labels = formatData(chartData, "Biden").y
            myChart.data.datasets.forEach((dataset) => {
                dataset.data = formatData(chartData, dataset.label).x;
            });
            myChart.update();

            // Update the table
            var ro = $("#poll-table-body").find("tr");
            ro.hide();
            ro.filter(function(i, v) {
                var $t = $(this);
                var $r = $t.find('.row-grade');
                return filterByGrade($r[0].textContent);
            }).show()
        }
    }).each(function() { // Build the labels
        // Get the options for this slider
        var opt = $(this).data().uiSlider.options;
        
        // Get the number of possible values
        var vals = opt.max - opt.min;
        
        // Space out values
        for (var i = 0; i <= vals; i++) {
            var el = $('<label>'+(grades[i])+'</label>').css('left',(i/vals*100)+'%');
            $( "#chart-slider" ).append(el);
          
        }
    });
});
