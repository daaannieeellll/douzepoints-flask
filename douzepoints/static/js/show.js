"use strict";
class Leaderboard {
    constructor() {
        this.topNine = new TopNine();
        this.contestants = {};
        this.order = [];
        this.n = 0;
        this.douze = "";
    }
    animate(ms = 100) {
        var timeout = ms;
        var size = this.n;
        if (size > 13) {
            this.order[0].animate();
            setTimeout(() => this.order[1].animate(), timeout);
            for (var i = 2; i < size / 2; i++)
                (idx => setTimeout(() => {
                    this.order[idx].animate();
                    if (idx + 11 < size)
                        this.order[idx + 11].animate();
                }, idx * timeout))(i);
            setTimeout(() => this.order[size - 2].animate(), (size - 1) * timeout / 2);
            setTimeout(() => this.order[size - 1].animate(), size * timeout / 2);
        }
        else
            this.order.forEach((contestant, i) => {
                setTimeout(() => {
                    contestant.animate();
                }, i * timeout);
            });
    }
    addContestant(contestant) {
        this.contestants[contestant.id] = contestant;
        this.order.push(contestant);
        this.n++;
        if (this.n !== 1)
            this.topNine.addContestant();
    }
    addVote(vote) {
        if (typeof vote == 'undefined')
            return;
        $(".presenter #name").text(vote.name);
        $(".presenter img").attr("src", vote.gif);
        this.order.forEach(c => $(c.element).removeAttr("data-points"));
        for (const [id, points] of Object.entries(vote["votes"])) {
            if (points === 12) {
                this.douze = id;
            }
            else {
                this.topNine.addPoints(this.getName(id), points);
                this.contestants[id].addPoints(points);
            }
        }
    }
    douzePoints() {
        var id = this.douze;
        if (id) {
            this.contestants[id].addPoints(12);
            this.douze = "";
        }
    }
    reorder() {
        this.order.sort((a, b) => b.points - a.points);
        this.order.forEach((c, i) => {
            c.element.animate({
                top: positions[i]["top"],
                left: positions[i]["left"]
            }, 1000);
        });
    }
    getName(id) {
        return $(this.contestants[id].element).find(".name").text();
    }
}
class Contestant {
    constructor(element) {
        this.element = element;
        this.id = element.attr("id");
        this.index = 0;
        this.points = 0;
    }
    animate() {
        this.element.animate({
            width: "toggle",
            opacity: "toggle"
        }, 500, "swing");
    }
    addPoints(points) {
        this.points += points;
        this.updateDOM(points);
    }
    updateDOM(points) {
        this.element.attr("data-points", points);
        this.element.find(':last()').text(this.points);
    }
}
class TopNine {
    constructor(n = 0) {
        this.element = $("#topNine .points");
        this.scores = [10, 8, 7, 6, 5, 4, 3, 2, 1];
    }
    addContestant() {
        var score = this.scores.shift();
        if (score)
            this.element.append($("<div />", {
                class: "contestant",
                id: score,
                "data-points": score
            }).append($("<p />", {
                class: "name"
            })));
    }
    addPoints(name, points) {
        $(`#${points}`).find(".name").text(name);
    }
}
var leaderboard = new Leaderboard();
var positions = getPositions();
function getPositions() {
    var positions = [];
    var cheight = 100 * $('.contestant').height() / $('.contestant').parent().height();
    var ctop = 0;
    var cleft = 50.5;
    $(".contestant").each((i, elem) => {
        if (i < 13) {
            $(elem).css({ top: ctop + "%" });
            positions[i] = { top: ctop + "%", left: "0" };
        }
        else {
            if (i === 13) {
                ctop = 0;
            }
            $(elem).css({ top: ctop + "%", left: cleft + "%" });
            positions[i] = { top: ctop + "%", left: cleft + "%" };
        }
        ctop += cheight + 0.4;
        leaderboard.addContestant(new Contestant($(elem)));
    });
    return positions;
}
var action = topNine;
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        action();
        switch (action) {
            case topNine:
                action = reorder;
                break;
            case reorder:
                action = douzePoints;
                break;
            case douzePoints:
                action = topNine;
                break;
            default:
                break;
        }
    }
});
function topNine() {
    $("#leaderboard").fadeOut(500);
    setTimeout(() => {
        leaderboard.animate();
        leaderboard.addVote(votes.shift());
        $("#topNine").fadeIn(700);
    }, 500);
}
function reorder() {
    $("#topNine").fadeOut(500);
    $("#leaderboard").fadeIn(500);
    setTimeout(() => leaderboard.animate(100), 500);
    setTimeout(() => leaderboard.reorder(), 100 * leaderboard.n + 750);
}
function douzePoints() {
    leaderboard.douzePoints();
    setTimeout(() => leaderboard.reorder(), 1000);
}
$("#fullscreen").click(function () {
    var element = $("html")[0];
    var isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || false;
    element.requestFullscreen = element.requestFullscreen || element.msRequestFullscreen || element.mozRequestFullscreen || element.webkitRequestFullscreen || function () { return false; };
    document.exitFullscreen = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || function () { return false; };
    isFullscreen ? document.exitFullscreen() : element.requestFullscreen();
});
$(document).ready(function () {
    $("#topNine").hide();
});
//# sourceMappingURL=show.js.map