from datetime import datetime, timedelta
from .database import db_session
from .models import User, Contestant, Voter, Vote

# Get competition's votes and parse to json
def getVotes(cid: int):
    data = []
    voters = Voter.query.filter_by(contest_id=cid)
    for voter in voters:
        d = {"name": voter.name, "votes": {}}
        votes = Vote.query.filter_by(voter_id=voter.id)
        for vote in votes:
            contestant = Contestant.query.filter_by(id=vote.contestant).first()
            d["votes"][contestant.id] = vote.value
        data.append(d)
    db_session.close()
    return data

# Remove users that are inactive for over 100 days
def cleanupUsers():
    hundredDaysAgo = datetime.utcnow() - timedelta(hours=1)
    # hundredDaysAgo = datetime.utcnow() - timedelta(days=100)
    users = User.query.filter(User.current_login_at < hundredDaysAgo)
    users.delete()
    db_session.commit()
    db_session.close()
    return