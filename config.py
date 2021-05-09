import os
from passlib import totp
from flask_security import uia_email_mapper
from douzepoints.forms import uia_username_mapper

class Config(object):
    DEBUG = False
    # Generate a nice key using secrets.token_urlsafe()
    SECRET_KEY = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
    # Bcrypt is set as default SECURITY_PASSWORD_HASH, which requires a salt
    # Generate a good salt using: secrets.SystemRandom().getrandbits(128)
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT", '146585145368132386173505678016728509634')

    SECURITY_TWO_FACTOR = True
    SECURITY_TWO_FACTOR_ENABLED_METHODS = ['authenticator']
    SECURITY_TOTP_SECRETS = {"1": totp.generate_secret()}
    SECURITY_TOTP_ISSUER = 'Douze Points'

    SECURITY_TRACKABLE = True

    SECURITY_USER_IDENTITY_ATTRIBUTES = [
        {"email": {"mapper": uia_email_mapper, "case_insensitive": True}},
        {"username": {"mapper": uia_username_mapper, "case_insensitive": True}}
    ]

    # Set Templates
    SECURITY_LOGIN_USER_TEMPLATE = 'security/login.html'
    SECURITY_REGISTER_USER_TEMPLATE = 'security/join.html'
    SECURITY_TWO_FACTOR_VERIFY_CODE_TEMPLATE = 'security/two_factor.html'
    
    SECURITY_TWO_FACTOR_SETUP_TEMPLATE = 'settings/two_factor.html'
    SECURITY_CHANGE_PASSWORD_TEMPLATE = 'settings/security.html'

    SECURITY_CHANGEABLE = True
    SECURITY_REGISTERABLE = True
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_SEND_PASSWORD_CHANGE_EMAIL = False

    # Set URL's
    SECURITY_LOGIN_URL = '/login'
    SECURITY_REGISTER_URL = '/join'
    SECURITY_TWO_FACTOR_TOKEN_VALIDATION_URL='/two_factor'
    
    SECURITY_CHANGE_URL = '/settings/security'
    SECURITY_TWO_FACTOR_SETUP_URL = '/settings/two_factor_authentication'
    
    # Set Post-views
    SECURITY_POST_LOGIN_VIEW = '/contests'
    SECURITY_POST_CHANGE_VIEW = '/settings/security'

class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    DEBUG = True