// Add jquery
var script = document.createElement('script');
script.src = "https://code.jquery.com/jquery-3.5.1.min.js";
script.onload = jqueryReady;

var script2 = document.createElement('script');
script2.src = "https://code.jquery.com/ui/1.12.0/jquery-ui.min.js";
script2.onload = jqueryReady;

var scriptLoaded = 0;
window.onload = function(){
    document.body.append(script);
    document.body.append(script2);
}

function jqueryReady(){
    scriptLoaded ++;
    if (scriptLoaded < 2) {
        return;
    }
    console.log("jquery ready");

    //var encoderMin = 0, encoderMax = 0;

    // css
    $('body').append($('<style></style>'));


    // Container, buttons
    var $container = $('<div id="shutter-control" class="container"></div>');

     $container.append($('<div>Current Possition: ' +
          '<span class="label-pos">'+ encoderPos +'</span>' + 
          '</div>'));



    var $row = $('<div class="row">' + 
        '<div class="col col-2"><label class="min">0</label></div>' + 
        '<div class="col col-8"><input class="slider" type="range" style="width:100%"  min="0" max="100" value="0"/></div>' + 
        '<div class="col col-2"><label class="max">0</label></div>' + 
        '</div>');

    $container.append($row);
    var $slider = $row.find('.slider');

    $container.append($('<div class="buttons">' + 
        '<button class="btn btn-up">+</button>' + 
        '<button class="btn btn-down">-</button>' + 
        '<button class="btn btn-calibrate">Calibrate</button>' + 
        '</div>'));

    $container.append($('<h5>Schedule</h5>'));
    $container.append($('<div>' + 
        '<input class="add-time" type="text" placeholder="10:00" size="10"/>' + 
        '<button class="btn btn-add-schedule">Add to Schedule</button>' + 
        '</div>'));

    var $schedule = $('<ul class="schedule"></ul>');
    $container.append($schedule);
    
    $('body').append($container);



    var $btnUp = $container.find('.btn-up');
    var $btnDown = $container.find('.btn-down');
    var $btnCalibrate = $container.find('.btn-calibrate');
    var $btnAddSchedule = $container.find('.btn-add-schedule');
    var $min =  $container.find('.min');
    var $max = $container.find('.max');
    var $labelPos = $('.label-pos');
    $btnAddSchedule.datepicker();

    // Init values
    $slider.prop('min', encoderMin);
    $slider.prop('max', encoderMax);

    console.log({encoderPos: encoderPos, encoderMin: encoderMin, encoderMax: encoderMax});
    $min.html(encoderMin);
    $max.html(encoderMax);
    $slider.val(encoderPos);


    // Behavior setup
    $slider.on('change', function(){
        var posVal = $(this).val(),
            $slider = $(this);
            console.log("encoderPos=" + posVal);
        $.ajax({
            url : '/ajax/',
            data: {pos: posVal},
        })
        .done(function(r){
            console.log(r);
            $slider.prop('min', r.encoderMin);
            $slider.prop('max', r.encoderMax);

            //var percent = ((r.encoderPos - r.encoderMin) / (r.encoderMax - r.encoderMin)) * 100;
            $slider.val(r.encoderPos);
            $('.label-pos').html(r.encoderPos);
        });
    });

    $btnUp.on('click', function(){
        $.ajax({
            url : '/ajax/',
            data: {move: 'up'},
        }).done(function(r){
            console.log('up', r);
            var percent = ((r.encoderPos - r.encoderMin) / (r.encoderMax - r.encoderMin)) * 100;
            $slider.val(percent);
            $('.label-pos').html(r.encoderPos);
        });
    });

    $btnDown.on('click', function(){
        $.ajax({
            url : '/ajax/',
            data: {move: 'down'},
        }).done(function(r){
            console.log('up', r);
            var percent = ((r.encoderPos - r.encoderMin) / (r.encoderMax - r.encoderMin)) * 100;
            $slider.val(percent);
            $('.label-pos').html(r.encoderPos);
        });
    });

    $btnCalibrate.on('click', function(){
        $.ajax({
            url : '/ajax/',
            data: {move: 'calibrate'},
        }).done(function(r){
            console.log('calibrated', r);

            $slider.prop('min', r.encoderMin);
            $slider.prop('max', r.encoderMax);
            
            // min = 100 -> 0%
            // max = 400 -> 100%,
            // 400 - 100 = 300
            var percent = ((r.encoderPos - r.encoderMin) / (r.encoderMax - r.encoderMin)) * 100;
            $min.html(r.encoderMin);
            $max.html(r.encoderMax);

            encoderMin = r.encoderMin;
            encoderMax = r.encoderMax;
            encoderPos = r.encoderPos;

            $slider.val(r.encoderPos);

            $('.label-pos').html(r.encoderPos);
        });        
    });


    $btnAddSchedule.on('click', function(){
        var time = $container.find('.add-time').val();
        var pos = $labelPos.html();

        var $item = $('<li>' + time  + ' = '  + pos + '</li>');
        $schedule.append($item); 
    });



}