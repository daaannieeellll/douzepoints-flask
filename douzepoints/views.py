from uuid import uuid4
from flask import Blueprint, render_template, request, redirect, abort, make_response
from flask_security import current_user, auth_required, hash_password
from flask_security.utils import verify_password

from .database import db_session
from .models import Contest, Contestant, Voter, Vote
from .forms import createContestForm, AuthenticateContest, CreateContestant, ContestDetails, ContestPassword, ContestStyle, ContestGIF, DeleteContest
from .functions import extractGiphy, getVotes, getScores, daysLeft, randomCode, sortContestants

bp = Blueprint('routes', __name__, url_prefix='')


@bp.route("/")
def index():
    if current_user.is_authenticated:
        return redirect('/contests')
    else:
        return redirect('/home')




@bp.route("/home")
def home():
    return render_template("home.html")




@bp.route('/contests/create', methods=['GET', 'POST'])
@auth_required()
def create():
    form = createContestForm()
    if form.validate_on_submit():
        contest = Contest(request.form['name'], request.form['description'], request.form['stop_voting_at'])
        contest.owner_id = current_user.id
        contest.code = randomCode()
        db_session.add(contest)
        db_session.commit()
        return redirect(f'/contests/{contest.id}', code=302)

    return render_template('contests/create.html', form=form)




@bp.route('contests')
@auth_required()
def contestList():
    contests = Contest.query.filter_by(owner_id=current_user.id).all()
    return render_template('contests/contests.html', contests=contests)




@bp.route('contests/<id>', methods=['GET', 'POST'])
@auth_required()
def contestView(id):
    contest = Contest.query.filter_by(id=id)\
                           .filter_by(owner_id=current_user.id)\
                           .first()
    if contest:
        form = CreateContestant()
        if form.validate_on_submit():
            contestant = Contestant(id, request.form['name'])
            db_session.add(contestant)
            db_session.commit()
        
        voting_closed, days_left = daysLeft(contest)
        return render_template('contests/contest.html', contest=contest, form=form, voting_closed=voting_closed, days_left=days_left)




@bp.route('contests/<id>/settings')
@auth_required()
def contestSettings(id):
    contest = Contest.query.filter_by(id=id)\
                           .filter_by(owner_id=current_user.id)\
                           .first()
    if contest:
        contest.contestants.sort(key=sortContestants)
        votes = len(contest.voters)
        detailsForm = ContestDetails()
        passwordForm = ContestPassword()
        styleForm = ContestStyle()
        GIFForm = ContestGIF()
        deleteForm = DeleteContest()

        return render_template('contests/settings.html',
            contest=contest,
            votes=votes,
            details=detailsForm,
            password=passwordForm,
            style=styleForm,
            GIF=GIFForm,
            delete=deleteForm
        )




@bp.route('contests/<id>/settings/details', methods=['POST'])
@auth_required()
def editDetails(id):
    contest = Contest.query.filter_by(id=id)\
                           .filter_by(owner_id=current_user.id)\
                           .first()
    form = ContestDetails()
    if contest and form.validate_on_submit():
        contest.name = request.form['name'] or contest.name
        contest.description = request.form['description'] or contest.description
        contest.password = hash_password(request.form['password']) or contest.password
        db_session.commit()
    return redirect(request.referrer)

@bp.route('contests/<id>/settings/removepwd', methods=['POST'])
@auth_required()
def removePassword(id):
    contest = Contest.query.filter_by(id=id)\
                           .filter_by(owner_id=current_user.id)\
                           .first()
    form = ContestPassword()
    if contest and form.validate_on_submit():
        contest.password = ''
        db_session.commit()
    return redirect(request.referrer)

@bp.route('contests/<id>/settings/style', methods=['POST'])
@auth_required()
def editStyle(id):
    contest = Contest.query.filter_by(id=id)\
                           .filter_by(owner_id=current_user.id)\
                           .first()
    form = ContestStyle()
    if contest and form.validate_on_submit():
        print(request.form['style'])
        contest.style = request.form['style']
        db_session.commit()
    return redirect(request.referrer)

@bp.route('contests/<id>/settings/contestants', methods=['POST'])
@auth_required()
def editContestants(id):
    contest = Contest.query.filter_by(id=id)\
                           .filter_by(owner_id=current_user.id)\
                           .first()
    if contest:
        Voter.query.filter_by(contest_id=id).delete()
        for key, name in request.form.items(multi=True):
            action, cid = key[0], key[1:]
            contestant = None
            if cid:
                contestant = Contestant.query.filter_by(contest_id=id).filter_by(id=cid).first()
            if action == '0' and contestant and name:
                contestant.name = name
            elif action == '1' and contestant:
                db_session.delete(contestant)
            elif action == '2' and name:
                db_session.add(Contestant(id, name))
            else:
                continue
            db_session.commit()

    return redirect(request.referrer)

@bp.route('contests/<id>/settings/gif', methods=['POST'])
@auth_required()
def updateGIF(id):
    contest = Contest.query.filter_by(id=id)\
                           .filter_by(owner_id=current_user.id)\
                           .first()
    form = ContestGIF()
    if contest and form.validate_on_submit():
        contest.gif = extractGiphy(request.form['url'])
        db_session.commit()
    return redirect(request.referrer)

@bp.route('contests/<id>/settings/delete', methods=['POST'])
@auth_required()
def deleteContest(id):
    contest = Contest.query.filter_by(id=id)\
                           .filter_by(owner_id=current_user.id)\
                           .first()
    form = DeleteContest()
    if contest and form.validate_on_submit():
        db_session.delete(contest)
        db_session.commit()
    return redirect('/contests')




@bp.route('/show/<id>')
@auth_required()
def show(id):
    contest = Contest.query\
        .filter_by(owner_id=current_user.id)\
        .filter_by(id=id)\
        .first()
    
    if contest:
        contest.contestants.sort(key=sortContestants)
        votes = getVotes(contest.id)
        return render_template('show.html', contest=contest, votes=votes)
    
    abort(404)

@bp.route('/results/<id>')
@auth_required()
def results(id):
    contest = Contest.query\
        .filter_by(owner_id=current_user.id)\
        .filter_by(id=id)\
        .first()

    if contest:
        votes = getVotes(contest.id, use_name=True)
        contest.contestants.sort(key=sortContestants)
        contestants = [c.name for c in contest.contestants]
        return render_template('results.html', contest=contest, contestants=contestants, votes=votes)




@bp.route('/<n>')
def num(n: str):
    if n.isnumeric():
        return redirect(f'/vote/{n}', code=302)
    else:
        return redirect('/', code=302)




@bp.route('/auth/<code>', methods=['POST'])
def auth(code):
    response = make_response(redirect(request.referrer))
    
    form = AuthenticateContest()
    if form.validate_on_submit():
        contest = Contest.query.filter_by(code=code).first()
        if contest and verify_password(request.form['password'], contest.password):
            response.set_cookie('auth', hash_password(str(contest.id)), httponly=True)
    return response




@bp.route('/vote/<code>', methods=['GET'])
def vote(code):
    contest = Contest.query.filter_by(code=code).first()
    if contest:
        if contest.password:
            response = make_response(render_template('auth.html', code=code, form=AuthenticateContest()))
            # if not (request.cookies.get('auth') and verify_password(code, request.cookies.get('auth'))):
            if not verify_password(str(contest.id), request.cookies.get('auth')):
                response.set_cookie('auth', hash_password('false'), httponly=True)
                return response

        closed, _ = daysLeft(contest)
        if closed:
            return render_template('voting_closed.html')
        contest.contestants.sort(key=sortContestants)
        scores = getScores(len(contest.contestants))
        return render_template('vote.html', contest=contest, scores=scores)

    return redirect('/', code=302)


@bp.route('/vote/<code>', methods=['POST'])
def processVote(code):
    contest = Contest.query.filter_by(code=code).first()
    scores = getScores(len(contest.contestants))
    votes = []
    voter = Voter(contest.id)
    
    try:
        vote = request.form.to_dict()
        
        voter.id = uuid4()
        voter.gif = extractGiphy(vote.pop('gif'))
        voter.name = vote.pop('name')
        print(vote)
        if not voter.gif or not voter.name or len(vote) != len(scores):
            raise ValueError("Invalid vote")
        
        for points, contestant in vote.items():
            points = int(points)
            scores.remove(points)
            votes.append(Vote(voter.id, contestant, points))

        db_session.add(voter)
        db_session.add_all(votes)
        db_session.commit()
        return render_template('voting_succesful.html', gif=contest.gif)

    except:
        return redirect(request.referrer)



@bp.route('account')
def settings():
    return redirect('settings/account', 302)
