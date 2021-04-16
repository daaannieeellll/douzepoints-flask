from datetime import datetime, timedelta
from flask_wtf import FlaskForm
from flask_security.forms import RegisterForm, LoginForm
from wtforms import Form, StringField, PasswordField, BooleanField, SubmitField
from wtforms.fields.html5 import EmailField
from wtforms_components import DateField, DateRange
from wtforms.validators import DataRequired, Length, Email, Regexp, Optional
from wtforms_alchemy import Unique
import bleach

from .database import db_session
from .models import User

def uia_username_mapper(identity):
    return bleach.clean(identity, strip=True)

class ExtRegisterForm(RegisterForm):
    username = StringField('Username', [DataRequired(), Length(min=4,max=64), Regexp('^\w+$', message="Username must contain only letters, numbers or underscore.")])
    email = EmailField('Email', [Optional(), Email(granular_message=True, check_deliverability=True)])
    password = PasswordField('Password', [DataRequired(), Length(min=8,max=128)])
    def validate(self):
        valid = super(ExtRegisterForm, self).validate()
        if not valid:
            return False

        # Check unique fields (ignore empty email)
        user = User.query.filter_by(username=self.username.data).first()
        email = None
        if self.email.data != '':
            email = User.query.filter_by(email=self.email.data).first()

        if user is None and email is None:
            return True

        if user is not None:
            self.username.errors.append('Username already in use')
        
        if email is not None:
            self.email.errors.append('Email already in use')
        
        return False

class ExtLoginForm(LoginForm):
    email = StringField('Username or email', [DataRequired()])
    password = PasswordField('Password', [DataRequired()])

class CreateContest(FlaskForm):
    name = StringField('Name', [DataRequired()])
    stop_voting_at = DateField('Stop voting')
    requires_login = BooleanField('Requires login')

def createContestForm(default=14, max=28):
    # Value range
    minDate = datetime.today().date()
    defaultDate = minDate + timedelta(days=default)
    maxDate = minDate + timedelta(days=max)
    
    # Set value range
    form = CreateContest(stop_voting_at=defaultDate)
    form.stop_voting_at.validators = [DateRange(min=minDate, max=maxDate, message='')]
    return form

class CreateContestant(FlaskForm):
    name = StringField('Name', [DataRequired()])
    description = StringField('Description')

class deleteAccount(FlaskForm):
    submit = SubmitField('Delete account')