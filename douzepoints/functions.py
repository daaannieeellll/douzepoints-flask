import random, re
from datetime import datetime, timedelta
from .database import db_session
from .models import User, Contest, Contestant, Voter, Vote

def getVotes(cid: str, use_name: bool = False):
    """ Get competition's votes and parse to json """
    data = []
    voters = Voter.query.filter_by(contest_id=cid)
    for voter in voters:
        d = {"name": voter.name, "votes": {}}
        votes = Vote.query.filter_by(voter_id=voter.id)
        for vote in votes:
            contestant = Contestant.query.filter_by(id=vote.contestant_id).first()
            if use_name:
                d["votes"][contestant.name] = vote.score
            else:
                d["votes"][str(contestant.id)] = vote.score
        data.append(d)
    return data

def getScores(amount: int):
    """ Get list of available scores """
    scores = [12,10,8,7,6,5,4,3,2,1]
    for i in range(10-amount):
        scores.pop()
    return scores

def daysLeft(contest: Contest):
    """ Calculates days between current and upcoming status """
    closed = contest.stop_voting_at < datetime.today().date()
    delta = contest.stop_voting_at - datetime.today().date()
    if closed:
        delta += timedelta(days=7)
    days = delta.days
    return closed, days

def extractGiphy(string: str):
    """ Validates string by extracting giphy url """
    regex = r"https?://media\d?\.giphy\.com/media/[^ /\n]+/[a-z0-9\-\_]*\.(gif|webp|mp4)"
    url = re.search(regex, string)
    return url.group()

def cleanupUsers():
    """ Remove users that are inactive for over 100 days """
    hundredDaysAgo = datetime.utcnow() - timedelta(hours=1)
    # hundredDaysAgo = datetime.utcnow() - timedelta(days=100)
    users = User.query.filter(User.current_login_at < hundredDaysAgo)
    users.delete()
    db_session.commit()
    return

def cleanupContests():
    """ Removes Contest a week after voting stopped """
    weekAgo = datetime.today().date() - timedelta(days=7)
    contests = Contest.query.filter(Contest.stop_voting_at < weekAgo)
    contests.delete()
    db_session.commit()
    return

def randomCode():
    """ Generates unique random contest code """
    while True:
        code = str(random.randint(0, 999999)).zfill(6)
        if not Contest.query.filter_by(code=code).first():
            return code


def sortContestants(c):
    return c.name