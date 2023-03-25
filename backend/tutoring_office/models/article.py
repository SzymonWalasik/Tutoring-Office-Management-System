from django.db import models

from account.models.user import User
from .tutoring_office import TutoringOffice


class Article(models.Model):

    title = models.CharField(
        max_length = 255,
    )
    content = models.TextField(
        blank = True,
        default = '',
    )
    create_date = models.DateField(
        auto_now_add = True,
    )
    modify_date = models.DateField(
        auto_now = True,
    )
    tutoring_office = models.ForeignKey(
        TutoringOffice,
        on_delete = models.CASCADE,
    )
    employee = models.ForeignKey(
        User,
        on_delete = models.SET_NULL,
        null = True,
    )
