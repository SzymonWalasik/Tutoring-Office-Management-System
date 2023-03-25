from django.db import models

from account.models.user import User


class TutoringOffice(models.Model):
    
    name = models.CharField(
        max_length = 255,
    )
    city = models.CharField(
        max_length = 255,
    )
    manager = models.ForeignKey(
        User,
        on_delete = models.RESTRICT,
    )
