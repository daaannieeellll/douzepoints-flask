/*
Leaderboard:
    contestant contestants[];
    void addVote();
    void reorder();
    void updateDOM();
*/
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
        this.order.forEach(c => {    
            c.element[0].classList.remove("selected");
        });

        // update points
        for (const [id, points] of Object.entries(vote["votes"])) {
            this.contestants[id].addPoints(points);
        }
        // reorder
        this.order.sort((a,b) => b.points - a.points);
        this.order.forEach(function(c, i) {
            c.element.animate({
                top: positions[i]["top"],
                left: positions[i]["left"]
            }, 1000);
        });
    }
}

/*
Contestant:
    node element;
    int id;
    int points;
    void addPoints();

*/
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
    /**
     * @brief Update contestant positions
     * @param {Number} points 
     */
    updateDOM(points) {
        this.element.toggleClass("selected");
        this.element[0].firstElementChild.firstElementChild.innerText = points;
        this.element[0].lastElementChild.innerText = this.points;
    }
}

particlesJS("particles-js",
    {
        "particles": {
        "number": {
            "value": 100,
            "density": {
            "enable": true,
            "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
            "width": 0,
            "color": "#000000"
            },
            "polygon": {
            "nb_sides": 6
            },
            "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
            }
        },
        "opacity": {
            "value": 0.15,
            "random": false,
            "anim": {
            "enable": true,
            "speed": 0.1,
            "opacity_min": 0,
            "sync": false
            }
        },
        "size": {
            "value": 11,
            "random": true,
            "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
            }
        },
        "line_linked": {
            "enable": false,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
            }
        }
        },
        "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
            "enable": false,
            "mode": "repulse"
            },
            "onclick": {
            "enable": false,
            "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
            "distance": 400,
            "line_linked": {
                "opacity": 1
            }
            },
            "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
            },
            "repulse": {
            "distance": 200,
            "duration": 0.4
            },
            "push": {
            "particles_nb": 4
            },
            "remove": {
            "particles_nb": 2
            }
        }
        },
        "retina_detect": true
    });

var leaderboard = new Leaderboard();

var positions = getPositions();
function getPositions() {
    var positions = [];
    cheight = Math.round(($(".contestant").height()/$( window ).height())*1000)/10;
    cwidth = Math.round(($(".contestant").width()/$( window ).width())*1000)/10;
    ctop = 4;
    cleft = 2 + cwidth + 0.5
    
    $(".contestant").each(function(i) {
        if (i<13) {
            $(this).css({top: ctop+"vh"});
            positions[i] = {top: ctop+"vh", left: 2+"vw"}
        } else {
            if (i==13) {
                ctop = 4;
            }
            $(this).css({top: ctop+"vh", left: cleft+"vw"});
            positions[i] = {top: ctop+"vh", left: cleft+"vw"}
        }
        ctop += cheight + 0.2;
        leaderboard.addContestant(new Contestant($(this)));
    });
    return positions;
}

$("#nextVote").click(function() {
    leaderboard.addVote(votes.shift());
});

action = topNine;
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        action();
        if (action === topNine) {
            action = reorder;
        } else if (action === reorder) {
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

$("#fullscreen").click(function() {    
    var element = $("#display")[0];
    var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
  
    element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
    document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };
  
    isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();

});

