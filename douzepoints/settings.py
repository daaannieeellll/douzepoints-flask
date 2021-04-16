from flask import Blueprint, make_response, send_from_directory, render_template, request, redirect, abort
from flask_security import current_user, auth_required

from .database import db_session
from .models import User
from .forms import deleteAccount

bp = Blueprint('settings', __name__, url_prefix='/settings')

@auth_required()
@bp.route('profile')
def profile():
    return render_template('settings/profile.html')

@auth_required()
@bp.route('account', methods=['GET', 'POST'])
def account():
    form = deleteAccount()
    if form.validate_on_submit():
        user = User.query.filter_by(id=current_user.id)
        user.delete()
        db_session.commit()
        return redirect('/logout', 302)
    return render_template('settings/account.html', form=form)