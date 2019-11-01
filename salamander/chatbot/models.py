from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=256)
    ratings = models.IntegerField()
    value = models.DecimalField(decimal_places=3, max_digits=4)

