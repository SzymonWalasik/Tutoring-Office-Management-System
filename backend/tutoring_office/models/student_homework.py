from django.db import models

from account.models.user import User
from .homework import Homework


class StudentHomework(models.Model):

    class Rating(models.IntegerChoices):
        FAIL = 1
        PASSING = 2
        AVERAGE = 3
        GOOD = 4
        EXCELLENT = 5

    teacher_comment = models.TextField(
        blank = True,
        default = '',
    )
    student_answer = models.TextField(
        blank = True,
        default = '',
    )
    rating = models.IntegerField(
        choices = Rating.choices,
        null = True,
        blank = True,
    )
    due_date = models.DateTimeField()
    student = models.ForeignKey(
        User,
        on_delete = models.RESTRICT,
        related_name = 'received_homeworks',
    )
    teacher = models.ForeignKey(
        User,
        on_delete = models.RESTRICT,
        related_name = 'assigned_homeworks',
    )
    homework = models.ForeignKey(
        Homework,
        on_delete = models.RESTRICT,
    )
