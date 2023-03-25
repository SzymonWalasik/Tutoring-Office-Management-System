from django.db import models

from account.models.user import User


class StudentFinancialReport(models.Model):
    
    charge = models.DecimalField(
        max_digits = 8,
        decimal_places = 2,
    )
    is_paid = models.BooleanField(
        default = False,
    )
    generate_date = models.DateField(
        auto_now_add = True,
    )
    student = models.ForeignKey(
        User,
        on_delete = models.RESTRICT,
    )
