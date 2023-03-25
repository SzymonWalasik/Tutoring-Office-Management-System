from django.db import models

from account.models.user import User


class ClassGroup(models.Model):
    
    name = models.CharField(
        max_length = 255,
    )
    students = models.ManyToManyField(
        User,
    )
