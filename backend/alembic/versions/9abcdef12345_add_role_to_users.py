"""add_role_to_users

Revision ID: 9abcdef12345
Revises: 851d02069c7c
Create Date: 2026-05-21 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9abcdef12345'
down_revision = '851d02069c7c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('users', sa.Column('role', sa.String(length=20), server_default='USER', nullable=False))


def downgrade() -> None:
    op.drop_column('users', 'role')
