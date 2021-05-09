from .database import Base
from flask_security import UserMixin, RoleMixin
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Boolean, DateTime, Date, Column, Integer, String, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid

class RolesUsers(Base):
    __tablename__ = 'roles_users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column('user_id', UUID(as_uuid=True), ForeignKey('user.id'))
    role_id = Column('role_id', UUID(as_uuid=True), ForeignKey('role.id'))

class Role(Base, RoleMixin):
    __tablename__ = 'role'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(80), unique=True)
    description = Column(String(255))

class User(Base, UserMixin):
    __tablename__ = 'user'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
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
    contests = relationship('Contest', backref=__tablename__)

class Contest(Base):
    __tablename__ = 'contest'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete='CASCADE'))
    name = Column(String(128))
    password = Column(String(255))
    description = Column(Text())
    code = Column(String(6), unique=True)
    stop_voting_at = Column(Date())
    style = Column(Integer, default=2019)
    gif = Column(String(), default=None)
    contestants = relationship('Contestant', backref=__tablename__)
    voters = relationship('Voter', backref=__tablename__)
    
    def __init__(self, name, description, stop_voting_at):
        self.name = name
        self.description = description
        self.stop_voting_at = stop_voting_at

class Contestant(Base):
    __tablename__ = 'contestant'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contest_id = Column(UUID(as_uuid=True), ForeignKey('contest.id', ondelete='CASCADE'))
    name = Column(String(256))
    points = Column(Integer)

    def __init__(self, cid, name='Contestant'):
        self.contest_id = cid
        self.name = name

class Voter(Base):
    __tablename__ = 'voter'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contest_id = Column(UUID(as_uuid=True), ForeignKey('contest.id', ondelete='CASCADE'))
    name = Column(String(64))
    gif = Column(String())
    votes = relationship('Vote', backref=__tablename__)

    def __init__(self, contest_id):
        self.contest_id = contest_id

class Vote(Base):
    __tablename__ = 'vote'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    voter_id = Column(UUID(as_uuid=True), ForeignKey('voter.id', ondelete='CASCADE'))
    contestant_id = Column(UUID(as_uuid=True), ForeignKey('contestant.id', ondelete='CASCADE'))
    score = Column(Integer)

    def __init__(self, voter_id, contestant_id, score):
        self.voter_id = voter_id
        self.contestant_id = contestant_id
        self.score = score