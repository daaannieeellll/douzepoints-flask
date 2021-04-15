from flask_security import current_user
from flask_socketio import emit, join_room

from .models import User, Owns, Contest, Contestant, Voter, Vote
from .database import db_session
from . import socketio 

@socketio.on('join_room', namespace='/voting')
def main_connect(cid):
    join_room(int(cid))

@socketio.on('vote', namespace='/voting')
def vote(cid, name, data: dict):
    err = False
    scores = [1,2,3,4,5,6,7,8,10,12]
    votes = []

    voter = Voter(int(cid))
    voter.name = name
    db_session.add(voter)
    db_session.commit()

    # Test votes
    contestants = Contestant.query.filter_by(contest_id=cid)
    if (contestants.count() > len(data) or contestants.count() > 10) and len(data) != 10:
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
    
    if err:
        db_session.query(Voter).filter(Voter.id == voter.id).delete()
        return

    db_session.add_all(votes)
    db_session.commit()