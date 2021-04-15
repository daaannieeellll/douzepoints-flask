from flask import Blueprint, make_response, send_from_directory, render_template, request, redirect, abort
from flask_security import current_user, auth_required

bp = Blueprint('settings', __name__, url_prefix='/settings')

@bp.route('profile')
def profile():
    return render_template('settings/profile.html')

@bp.route('account')
def account():
    return render_template('settings/account.html')