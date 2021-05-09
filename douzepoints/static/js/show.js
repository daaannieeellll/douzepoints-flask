"use strict";
class Leaderboard {
    constructor() {
        this.contestants = {};
        this.order = [];
        this.n = 0;
    }
    addContestant(contestant) {
        this.contestants[contestant.id] = contestant;
        this.order.push(contestant);
    }
    addVote(vote) {
        if (typeof vote == 'undefined')
            return;
        this.order.forEach(c => {
            c.element[0].classList.remove("selected");
        });
        for (const [id, points] of Object.entries(vote["votes"])) {
            this.contestants[id].addPoints(points);
        }
        this.order.sort((a, b) => a.points < b.points ? 1 : -1);
        this.order.forEach(function (c, i) {
            c.element.animate({
                top: positions[i]["top"],
                left: positions[i]["left"]
            }, 1000);
        });
    }
}
class Contestant {
    constructor(element) {
        this.element = element;
        this.id = element.attr("id");
        this.index = 0;
        this.points = 0;
    }
    addPoints(points) {
        this.points += points;
        this.updateDOM(points);
    }
    updateDOM(points) {
        this.element.toggleClass("selected");
        this.element.find(':first() :first()').text(points);
        this.element.find(':last()').text(this.points);
    }
}
var leaderboard = new Leaderboard();
var positions = getPositions();
function getPositions() {
    var positions = [];
    var cheight = Math.round(($(".contestant").height() / $(window).height()) * 1000) / 10;
    var cwidth = Math.round(($(".contestant").width() / $(window).width()) * 1000) / 10;
    var ctop = 4;
    var cleft = 2 + cwidth + 0.5;
    $(".contestant").each(function (i, elem) {
        if (i < 13) {
            $(elem).css({ top: ctop + "vh" });
            positions[i] = { top: ctop + "vh", left: 2 + "vw" };
        }
        else {
            if (i === 13) {
                ctop = 4;
            }
            $(elem).css({ top: ctop + "vh", left: cleft + "vw" });
            positions[i] = { top: ctop + "vh", left: cleft + "vw" };
        }
        ctop += cheight + 0.2;
        leaderboard.addContestant(new Contestant($(elem)));
    });
    return positions;
}
$("#nextVote").click(function () {
    leaderboard.addVote(votes.shift());
});
var action = topNine;
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        action();
        if (action === topNine) {
            action = reorder;
        }
        else if (action === reorder) {
            action = douzePoints;
        }
        else {
            action = topNine;
        }
    }
});
function topNine() {
    alert("top nine");
}
function reorder() {
    leaderboard.addVote(votes.shift());
}
function douzePoints() {
    alert("douze points");
}
$("#fullscreen").click(function () {
    var element = $("#display")[0];
    var isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || false;
    element.requestFullscreen = element.requestFullscreen || element.msRequestFullscreen || element.mozRequestFullscreen || element.webkitRequestFullscreen || function () { return false; };
    document.exitFullscreen = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || function () { return false; };
    isFullscreen ? document.exitFullscreen() : element.requestFullscreen();
});
//# sourceMappingURL=show.js.map