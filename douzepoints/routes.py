from datetime import date, datetime, timedelta

from flask import Blueprint, make_response, send_from_directory, render_template, request, redirect, abort
from flask_security import current_user, auth_required
from flask_socketio import emit

from . import socketio
from .database import db_session
from .models import Contest, Contestant, User, Owns, Voter, Vote
from .forms import createContestForm, CreateContestant
from .functions import getVotes

bp = Blueprint('routes', __name__, url_prefix='')


@bp.route("/")
def home():
    if current_user.is_authenticated:
        return redirect('/dashboard')
    else:
        return render_template('index.html')



@bp.route('/create', methods=['GET', 'POST'])
@auth_required()
def create():

    form = createContestForm()

    if form.validate_on_submit():
        contest = Contest(request.form['name'], request.form['stop_voting_at'])
        contest.owner_id = current_user.id
        # TODO: Random contest id
        db_session.add(contest)
        db_session.commit()

        # Association
        owns = Owns(user_id=current_user.id, contest_id=contest.id)
        db_session.add(owns)
        db_session.commit()
        return redirect('/dashboard?cid='+str(contest.id), code=302)

    return render_template('create.html', form=form)



@bp.route('dashboard', methods=['GET', 'POST'])
@auth_required()
def dashboard():
    contests = User.query.filter_by(id=current_user.id).first().contests
    # Test if in contest
    try:
        if  Owns.query\
                .filter_by(user_id=current_user.id)\
                .filter_by(contest_id=request.args['cid'])\
                .first():
            
            form = CreateContestant()
            if form.validate_on_submit():
                if Owns.query\
                        .filter_by(user_id=current_user.id)\
                        .filter_by(contest_id=request.args['cid'])\
                        .first():
                    contestant = Contestant(request.args['cid'], request.form['name'], request.form['description'])
                    db_session.add(contestant)
                    db_session.commit()

            contest = Contest.query.filter_by(id=request.args['cid']).first()
            if contest.stop_voting_at > datetime.today().date():
                delta = contest.stop_voting_at - datetime.today().date()
            contestants = Contest.query.filter_by(id=request.args['cid']).first().contestants
            return render_template('contest.html', name=contest.name, cid=contest.id, form=form, contestants=contestants, days=delta.days)
    
    except:
        pass

    contests = Contest.query.filter_by(owner_id=current_user.id).all()
    return render_template('dashboard.html', contests=contests)



# /results?cid=contest_id
@bp.route('/results')
@auth_required()
def results():
    try:
        # Get contest name if existent
        contest = Contest.query\
            .filter_by(owner_id=current_user.id)\
            .filter_by(id=int(request.args['cid']))\
            .first()
        if contest:
            data = getVotes(contest.id)
            contestants = Contestant.query.filter_by(contest_id=contest.id).all()
            
            return render_template('results.html', name=contest.name, cid=contest.id, contestants=contestants, votes=data)
    except:
        pass    
    abort(404)



# /contest_id
@bp.route('/<n>')
def num(n):
    if isinstance(n, str) and n.isnumeric():
        return redirect('/vote?cid='+n, code=302)
    abort(404)



# /vote?cid=contest_id
@bp.route('/vote')
def vote():
    try:
        # Get contest name if existent
        contest = Contest.query.filter_by(id=int(request.args['cid'])).first()
        if contest:
            contestants = Contestant.query.filter_by(contest_id=int(request.args['cid'])).all()
            return render_template('vote.html', cname=contest.name, contestants=contestants)
    except:
        pass
    abort(404)



@bp.route('account')
def settings():
    return redirect('settings/account', 302)
