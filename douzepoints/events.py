from flask_security import current_user
from flask_socketio import emit, join_room

from .models import User, Contest, Contestant, Voter, Vote
from .database import db_session
from .functions import getScores
from . import socketio

@socketio.on('vote', namespace='/voting')
def vote(cid, name, data):
    err = False
    votes = []

    voter = Voter(cid)
    voter.name = name
    db_session.add(voter)
    db_session.commit()

    # Test votes
    contestants = Contestant.query.filter_by(contest_id=cid).all()
    scores = getScores(len(contestants))

    # Not all points assigned
    if (len(contestants) > len(data) or len(contestants) >= 10) and len(data) != 10:
        err = True
    else: 
        for contestant, points in data.items():
            points = int(points)
            if points in scores:
                scores.remove(points)
                votes.append(Vote(voter.id, contestant, points))
            else:
                err = True
                break
    
    if err or scores or not votes:
        db_session.query(Voter).filter(Voter.id == voter.id).delete()
        return

    db_session.add_all(votes)
    db_session.commit()