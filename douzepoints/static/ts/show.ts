interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
}

interface Element {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
}

interface Vote {
    name: string;
    votes: Score;
}

interface Score {
    [id: string]: number;
}

interface Coordinate {
    top: string;
    left: string;
}

declare var votes: Vote[];

class Leaderboard {
    contestants: {[id: string]: Contestant};
    order: Contestant[];
    n: number;

    constructor() {
        this.contestants = {};
        this.order = [];
        this.n = 0;
    }

    addContestant(contestant: Contestant) {
        this.contestants[contestant.id] = contestant;
        this.order.push(contestant);
    }

    addVote(vote: Vote | undefined) {
        if (typeof vote == 'undefined')
            return;

        this.order.forEach(c => {    
            c.element[0].classList.remove("selected");
        });

        // update points
        for (const [id, points] of Object.entries(vote["votes"])) {
            this.contestants[id].addPoints(points);
        }
        // reorder
        this.order.sort((a,b) => a.points < b.points ? 1 : -1);
        this.order.forEach(function(c, i) {
            c.element.animate({
                top: positions[i]["top"],
                left: positions[i]["left"]
            }, 1000);
        });
    }
}

class Contestant {
    element: JQuery;
    id: string;
    index: number;
    points: number;
    
    constructor(element: JQuery) {
        this.element = element;
        this.id = element.attr("id");
        this.index = 0;
        this.points = 0;
    }

    addPoints(points: number) {
        this.points += points;
        this.updateDOM(points);
    }
    /**
     * @brief Update contestant positions
     * @param {number} points 
     */
    updateDOM(points: number) {
        this.element.toggleClass("selected");
        this.element.find(':first() :first()').text(points);
        this.element.find(':last()').text(this.points);
    }
}
/*
tsParticles.load("tsparticles",
{
    "autoPlay": true,
    "background": {
      "color": {
        "value": "#c78fff"
      },
      "image": "",
      "position": "",
      "repeat": "",
      "size": "",
      "opacity": 0.64
    },
    "backgroundMask": {
      "composite": "destination-out",
      "cover": {
        "color": {
          "value": "#fff"
        },
        "opacity": 1
      },
      "enable": false
    },
    "fullScreen": {
      "enable": true,
      "zIndex": -1
    },
    "detectRetina": true,
    "fpsLimit": 60,
    "manualParticles": [],
    "motion": {
      "disable": false,
      "reduce": {
        "factor": 4,
        "value": true
      }
    },
    "particles": {
      "bounce": {
        "horizontal": {
          "random": {
            "enable": false,
            "minimumValue": 0.1
          },
          "value": 1
        },
        "vertical": {
          "random": {
            "enable": false,
            "minimumValue": 0.1
          },
          "value": 1
        }
      },
      "collisions": {
        "bounce": {
          "horizontal": {
            "random": {
              "enable": false,
              "minimumValue": 0.1
            },
            "value": 1
          },
          "vertical": {
            "random": {
              "enable": false,
              "minimumValue": 0.1
            },
            "value": 1
          }
        },
        "enable": false,
        "mode": "bounce",
        "overlap": {
          "enable": true,
          "retries": 0
        }
      },
      "color": {
        "value": "#ffffff",
        "animation": {
          "h": {
            "count": 0,
            "enable": true,
            "offset": 0,
            "speed": 50,
            "sync": false
          },
          "s": {
            "count": 0,
            "enable": false,
            "offset": 0,
            "speed": 1,
            "sync": true
          },
          "l": {
            "count": 0,
            "enable": false,
            "offset": 0,
            "speed": 1,
            "sync": true
          }
        }
      },
      "links": {
        "enable": false,
      },
      "move": {
        "angle": {
          "offset": 45,
          "value": 90
        },
        "attract": {
          "enable": false,
          "rotate": {
            "x": 3000,
            "y": 3000
          }
        },
        "decay": 0,
        "distance": 0,
        "direction": "none",
        "drift": 0,
        "enable": true,
        "gravity": {
          "acceleration": 9.81,
          "enable": false,
          "maxSpeed": 50
        },
        "path": {
          "clamp": false,
          "delay": {
            "random": {
              "enable": false,
              "minimumValue": 0
            },
            "value": 0
          },
          "enable": false
        },
        "outModes": {
          "default": "out",
          "bottom": "out",
          "left": "out",
          "right": "out",
          "top": "out"
        },
        "random": true,
        "size": false,
        "speed": 2,
        "straight": false,
        "trail": {
          "enable": false,
          "length": 10,
          "fillColor": {
            "value": "#000000"
          }
        },
        "vibrate": false,
        "warp": false
      },
      "number": {
        "density": {
          "enable": true,
          "area": 800,
          "factor": 1000
        },
        "limit": 0,
        "value": 100
      },
      "opacity": {
        "random": {
          "enable": true,
          "minimumValue": 0.3
        },
        "value": {
          "min": 0,
          "max": 0.3
        },
        "animation": {
          "count": 0,
          "enable": true,
          "speed": 0.1,
          "sync": false,
          "destroy": "none",
          "minimumValue": 0,
          "startValue": "random"
        }
      },
      "reduceDuplicates": false,
      "rotate": {
        "random": {
          "enable": false,
          "minimumValue": 0
        },
        "value": 0,
        "animation": {
          "enable": false,
          "speed": 0,
          "sync": false
        },
        "direction": "clockwise",
        "path": false
      },
      "shadow": {
        "blur": 0,
        "color": {
          "value": "#000000"
        },
        "enable": false,
        "offset": {
          "x": 0,
          "y": 0
        }
      },
      "shape": {
        "type": "circle"
      },
      "size": {
        "random": {
          "enable": true,
          "minimumValue": 1
        },
        "value": {
          "min": 1,
          "max": 11
        },
        "animation": {
          "count": 0,
          "enable": false,
          "speed": 3,
          "sync": false,
          "destroy": "none",
          "minimumValue": 1,
          "startValue": "random"
        }
      },
      "stroke": {
        "width": 0,
        "color": {
          "value": "",
          "animation": {
            "h": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 0,
              "sync": false
            },
            "s": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 1,
              "sync": true
            },
            "l": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 1,
              "sync": true
            }
          }
        }
      },
      "twinkle": {
        "lines": {
          "enable": false,
          "frequency": 0.05,
          "opacity": 1
        },
        "particles": {
          "enable": false,
          "frequency": 0.05,
          "opacity": 1
        }
      }
    },
    "pauseOnBlur": true,
    "pauseOnOutsideViewport": true,
    "responsive": [],
    "themes": []
});
*/
var leaderboard = new Leaderboard();

var positions = getPositions();
function getPositions() {
    var positions: Coordinate[] = [];
    var cheight = Math.round(($(".contestant").height() / $(window).height())*1000)/10;
    var cwidth = Math.round(($(".contestant").width() / $(window).width())*1000)/10;
    var ctop = 4;
    var cleft = 2 + cwidth + 0.5
    
    $(".contestant").each(function (i, elem) {
        if (i < 13) {
            $(elem).css({top: ctop+"vh"});
            positions[i] = {top: ctop+"vh", left: 2+"vw"}
        } else {
            if (i===13) {
                ctop = 4;
            }
            $(elem).css({top: ctop+"vh", left: cleft+"vw"});
            positions[i] = {top: ctop+"vh", left: cleft+"vw"}
        }
        ctop += cheight + 0.2;
        leaderboard.addContestant(new Contestant($(elem)));
    });
    return positions;
}

$("#nextVote").click(function() {
    leaderboard.addVote(votes.shift());
});

var action = topNine;
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
    var isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || false;
    element.requestFullscreen = element.requestFullscreen || element.msRequestFullscreen || element.mozRequestFullscreen || element.webkitRequestFullscreen || function () { return false; }
    document.exitFullscreen = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || function() { return false; }
    isFullscreen ? document.exitFullscreen() : element.requestFullscreen();
});
