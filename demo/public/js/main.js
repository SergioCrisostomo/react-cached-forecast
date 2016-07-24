
var skycons = new Skycons({
    "color": "pink"
});
var canvas = document.querySelectorAll('canvas');
[].forEach.call(canvas, function (el) {
    skycons.add(el, el.dataset.icon);
});

skycons.play();
