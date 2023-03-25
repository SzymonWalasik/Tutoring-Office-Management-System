from django.db import models

from account.models.user import User


class TeacherQualityOfServiceAssessment(models.Model):

    class Rating(models.TextChoices):
        BAD = '&starf;'
        DECENT = '&starf;' * 2
        OK = '&starf;' * 3
        GREAT = '&starf;' * 4
        AWESOME = '&starf;' * 5

    description = models.CharField(
        max_length = 255,
        blank = True,
        default = '',
    )
    rating = models.CharField(
        max_length = 50,
        choices = Rating.choices,
    )
    generate_date = models.DateField(
        auto_now_add = True,
    )
    student = models.ForeignKey(
        User,
        on_delete = models.RESTRICT,
        related_name = 'feedbacks_for_teachers',
    )
    teacher = models.ForeignKey(
        User,
        on_delete = models.RESTRICT,
        related_name = 'quality_of_service_assessments',
    )
