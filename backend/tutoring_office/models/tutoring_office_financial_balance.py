from django.db import models

from .tutoring_office import TutoringOffice


class TutoringOfficeFinancialBalance(models.Model):
    electricity_bill  =  models.DecimalField(
        max_digits  =  9,
        decimal_places  =  2,
    )
    rent_bill  =  models.DecimalField(
        max_digits  =  9,
        decimal_places  =  2,
    )
    gas_bill  =  models.DecimalField(
        max_digits  =  9,
        decimal_places  =  2,
    )
    water_bill  =  models.DecimalField(
        max_digits  =  9,
        decimal_places  =  2,
    )
    internet_bill  =  models.DecimalField(
        max_digits  =  6,
        decimal_places  =  2,
    )
    total_maintenance_cost  =  models.DecimalField(
        max_digits  =  12,
        decimal_places  =  2,
    )
    total_employee_cost  =  models.DecimalField(
        max_digits  =  9,
        decimal_places  =  2,
    )
    total_income  =  models.DecimalField(
        max_digits  =  12,
        decimal_places  =  2,
    )
    balance  =  models.DecimalField(
        max_digits  =  12,
        decimal_places  =  2,
    )
    generate_date  =  models.DateField(
        auto_now_add  =  True,
    )
    tutoring_office = models.ForeignKey(
        TutoringOffice,
        on_delete  =  models.RESTRICT,
    )
