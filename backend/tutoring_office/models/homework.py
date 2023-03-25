from django.db import models

from .tutoring_office_subject_variant import SubjectVariant


class Homework(models.Model):
    content = models.TextField(
        blank = True,
        default = '',
    )
    expected_result = models.TextField()
    content_file = models.FileField(
        upload_to = 'homework_files',
        null = True,
        blank = True,
    )
    subject_variant = models.ForeignKey(
        SubjectVariant,
        on_delete = models.RESTRICT,
    )
