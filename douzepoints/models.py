from .database import Base
from flask_security import UserMixin, RoleMixin
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Boolean, DateTime, Column, Integer, String, ForeignKey

class RolesUsers(Base):
    __tablename__ = 'roles_users'
    id = Column(Integer(), primary_key=True)
    user_id = Column('user_id', Integer(), ForeignKey('user.id'))
    role_id = Column('role_id', Integer(), ForeignKey('role.id'))

class Role(Base, RoleMixin):
    __tablename__ = 'role'
    id = Column(Integer(), primary_key=True)
    name = Column(String(80), unique=True)
    description = Column(String(255))

class User(Base, UserMixin):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String(255))
    username = Column(String(255), unique=True)
    password = Column(String(255), nullable=False)
    last_login_at = Column(DateTime())
    current_login_at = Column(DateTime())
    last_login_ip = Column(String(100))
    current_login_ip = Column(String(100))
    login_count = Column(Integer)
    active = Column(Boolean())
    fs_uniquifier = Column(String(255), unique=True, nullable=False)
    confirmed_at = Column(DateTime())
    roles = relationship('Role', secondary='roles_users', backref=backref('users', lazy='dynamic'))
    tf_phone_number = Column(String(64))
    tf_primary_method = Column(String(140))
    tf_totp_secret = Column(String(255))
    contests = relationship('Owns')

class Owns(Base):
    __tablename__ = 'owns'
    user_id = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    contest_id = Column(Integer, ForeignKey('contest.id', ondelete='CASCADE'), primary_key=True)
    
    def __init__(self, user_id, contest_id):
        self.user_id = user_id
        self.contest_id = contest_id

class Contest(Base):
    __tablename__ = 'contest'
    id = Column(Integer, primary_key=True)
    name = Column(String(128))
    requires_login = Column(Boolean)
    owner_id = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'))
    contestants = relationship('Contestant', backref=__tablename__)
    voters = relationship('Voter', backref=__tablename__)
    
    def __init__(self, name='My Contest', requires_login=False):
        self.name = name
        self.requires_login = requires_login

class Contestant(Base):
    __tablename__ = 'contestant'
    id = Column(Integer, primary_key=True)
    contest_id = Column(Integer, ForeignKey('contest.id', ondelete='CASCADE'))
    name = Column(String(256))
    description = Column(String(512))
    points = Column(Integer)

    def __init__(self, cid, name='Contestant', description='Description'):
        self.contest_id = cid
        self.name = name
        self.description = description

class Voter(Base):
    __tablename__ = 'voter'
    id = Column(Integer, primary_key=True)
    contest_id = Column(Integer, ForeignKey('contest.id', ondelete='CASCADE'))
    name = Column(String(64))
    votes = relationship('Vote', backref=__tablename__)

    def __init__(self, contest_id):
        self.contest_id = contest_id

class Vote(Base):
    __tablename__ = 'vote'
    id = Column(Integer, primary_key=True)
    voter_id = Column(Integer, ForeignKey('voter.id', ondelete='CASCADE'))
    contestant = Column(Integer, ForeignKey('contestant.id', ondelete='CASCADE'))
    value = Column(Integer)

    def __init__(self, voter_id, contestant, value):
        self.voter_id = voter_id
        self.contestant = contestant
        self.value = value