(function ($) {
    window.vcv.on("ready", () => {
        var lastItem = $(".vce-stacked-slider-list .vce-stacked-slider-item").length - 1;

        function next() {
            var prependList = function () {
                if ($('.vce-stacked-slider-item').hasClass('activeNow')) {
                    var $slicedItem = $('.vce-stacked-slider-item').slice(lastItem).removeClass('transformThis activeNow');
                    $('.vce-stacked-slider-list').prepend($slicedItem);
                }
            }
            $('.vce-stacked-slider-item').last().removeClass('transformPrev').addClass('transformThis').prev().addClass('activeNow');
            setTimeout(function () { prependList(); }, 150);
        }

        function prev() {
            var appendToList = function () {
                if ($('.vce-stacked-slider-item').hasClass('activeNow')) {
                    var $slicedItem = $('.vce-stacked-slider-item').slice(0, 1).addClass('transformPrev');
                    $('.vce-stacked-slider-list').append($slicedItem);
                }
            }

            $('.vce-stacked-slider-item').removeClass('transformPrev').last().addClass('activeNow').prevAll().removeClass('activeNow');
            setTimeout(function () { appendToList(); }, 150);
        }

        $('#next').on('click', function () {
            next();
        });

        $('#prev').on('click', function () {
            prev();
        });

        let lists = [];
        lists.push(document.getElementsByClassName('vce-stacked-slider-item'));
        // console.log(lists);

        lists.forEach(function() {

            swipedetect(this, function (swipedir) {
                console.log(this);
                //swipedir contains either "none", "left", "right", "top", or "down"
                if (swipedir == 'left') {
                    prev();
                }
                if (swipedir == 'right') {
                    next();
                }
            })
        })
        

        function swipedetect(el, callback) {

            var touchsurface = el,
                swipedir,
                startX,
                startY,
                distX,
                distY,
                threshold = 150, //required min distance traveled to be considered swipe
                restraint = 100, // maximum distance allowed at the same time in perpendicular direction
                allowedTime = 300, // maximum time allowed to travel that distance
                elapsedTime,
                startTime,
                handleswipe = callback || function (swipedir) { }

            touchsurface.addEventListener('touchstart', function (e) {
                var touchobj = e.changedTouches[0]
                swipedir = 'none'
                dist = 0
                startX = touchobj.pageX
                startY = touchobj.pageY
                startTime = new Date().getTime() // record time when finger first makes contact with surface
                e.preventDefault()
            }, false)

            touchsurface.addEventListener('touchmove', function (e) {
                e.preventDefault() // prevent scrolling when inside DIV
            }, false)

            touchsurface.addEventListener('touchend', function (e) {
                var touchobj = e.changedTouches[0]
                distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
                distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
                elapsedTime = new Date().getTime() - startTime // get time elapsed
                if (elapsedTime <= allowedTime) { // first condition for awipe met
                    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                        swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                    }
                    else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                        swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                    }
                }
                handleswipe(swipedir)
                e.preventDefault()
            }, false)
        }

    
    });

})(window.jQuery);