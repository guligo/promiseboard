define(function() {

    var _drawScorePool = function(canvas, coef) {
        var ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ededed';
        ctx.arc(16, 16, 16, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = '#5bc0de';
        ctx.arc(16, 16, 16, - Math.PI / 2, coef * 2 * Math.PI - Math.PI / 2);
        ctx.lineTo(16, 16);
        ctx.closePath();
        ctx.fill();

        if (coef >= 1) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px Arial';
            ctx.fillText('1', 16, 21);
        }
    };

    return {
        drawScorePool: function(canvas, coef) {
            _drawScorePool(canvas, coef);
        }
    };

});
