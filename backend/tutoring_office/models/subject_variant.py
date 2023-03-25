from django.db import models

from .subject import Subject


class SubjectVariant(models.Model):

    class AdvancementLevel(models.TextChoices):
        BASIC = 'Podstawowy'
        SEMI_ADVANCED = 'Średnio-zaawansowany'
        ADVANCED = 'Zaawansowany'

    advancement_level = models.CharField(
        max_length = 50,
        choices = AdvancementLevel.choices,
    )
    subject = models.ForeignKey(
        Subject,
        on_delete = models.CASCADE,
    )
