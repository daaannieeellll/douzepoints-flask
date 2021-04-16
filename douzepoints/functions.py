from datetime import datetime, timedelta
from .database import db_session
from .models import User, Contest, Contestant, Voter, Vote

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

def getScores(amnt):
    scores = [12,10,8,7,6,5,4,3,2,1]
    for i in range(10-amnt):
        scores.pop()
    return scores

def daysLeft(contest):
    if contest.stop_voting_at >= datetime.today().date():
        closed = False
        delta = contest.stop_voting_at - datetime.today().date()
        days = delta.days
    else:
        closed = True
        delta = contest.stop_voting_at + timedelta(days=7) - datetime.today().date()
        days = delta.days
    return closed, days



# Remove users that are inactive for over 100 days
def cleanupUsers():
    hundredDaysAgo = datetime.utcnow() - timedelta(hours=1)
    # hundredDaysAgo = datetime.utcnow() - timedelta(days=100)
    users = User.query.filter(User.current_login_at < hundredDaysAgo)
    users.delete()
    db_session.commit()
    return

# Removes Contest a week after voting stopped
def cleanupContests():
    weekAgo = datetime.today().date() - timedelta(days=7)
    contests = Contest.query.filter(Contest.stop_voting_at < weekAgo)
    contests.delete()
    db_session.commit()
    return