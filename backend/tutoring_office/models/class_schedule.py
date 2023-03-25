from django.db import models

from account.models.user import User
from .class_group import ClassGroup
from .tutoring_office_subject_variant import TutoringOfficeSubjectVariant


class ClassSchedule(models.Model):
    
    meeting_url = models.URLField()
    date = models.DateTimeField()
    class_group = models.ForeignKey(
        ClassGroup,
        on_delete = models.RESTRICT,
    )
    teacher = models.ForeignKey(
        User,
        on_delete = models.RESTRICT,
    )
    tutoring_office_subject_variant = models.ForeignKey(
        TutoringOfficeSubjectVariant,
        on_delete = models.RESTRICT,
    )
