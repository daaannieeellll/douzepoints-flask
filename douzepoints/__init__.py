import os
import atexit

from flask import Flask, current_app, render_template, render_template_string
from flask_security import Security, current_user, auth_required, hash_password, SQLAlchemySessionUserDatastore, uia_email_mapper
from passlib import totp
from flask_socketio import SocketIO
from apscheduler.schedulers.background import BackgroundScheduler

from .database import db_session, init_db
from .models import User, Role, Contest, Contestant
from .forms import ExtRegisterForm, ExtLoginForm, uia_username_mapper

# Convenient references
from werkzeug.datastructures import MultiDict
from werkzeug.local import LocalProxy
_security = LocalProxy(lambda: current_app.extensions['security'])
_datastore = LocalProxy(lambda: _security.datastore)


socketio = SocketIO()
from . import events

def create_app(test_config=None):
	# create and configure the app
	app = Flask(__name__, instance_relative_config=True)
	if app.config['ENV'] == 'production':
		app.config.from_object('config.ProductionConfig')
	else:
		app.config.from_object('config.DevelopmentConfig')

	# Setup Flask-Security
	user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
	security = Security(app, user_datastore, register_form=ExtRegisterForm, login_form=ExtLoginForm)

	# Connect Socket.io
	socketio.init_app(app, async_mode=None, logger=False, engineio_logger=False)

	# Initialize Scheduler
	@app.before_first_request
	def init_scheduler():
		scheduler = BackgroundScheduler()
		from .functions import cleanupUsers
		scheduler.add_job(func=cleanupUsers, trigger='interval', minutes=1)
		# scheduler.add_job(func=cleanupUsers, trigger='interval', days=1)
		scheduler.start()
		atexit.register(lambda: scheduler.shutdown())

	# Initialize Database
	@app.before_first_request
	def init_database():
		init_db()

	# Remove DB connection after request or at shut down
	@app.teardown_appcontext
	def remove_session(*args, **kwargs):
		db_session.remove()

	# Connect Routes
	from .routes import bp as bp_routes
	app.register_blueprint(bp_routes)
	from .settings import bp as bp_settings
	app.register_blueprint(bp_settings)

	return app
