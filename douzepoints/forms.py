from flask_wtf import FlaskForm
from flask_security.forms import RegisterForm, LoginForm
from wtforms import StringField, PasswordField, BooleanField, Form
from wtforms.fields.html5 import EmailField
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
    email = StringField('Email or username', [DataRequired()])
    password = PasswordField('Password', [DataRequired()])

class CreateContest(FlaskForm):
    name = StringField('Name', [DataRequired()])
    requires_login = BooleanField('Requires login')

class CreateContestant(FlaskForm):
    name = StringField('Name', [DataRequired()])
    description = StringField('Description')