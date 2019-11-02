from django.db import models


class Movie(models.Model):
    name = models.CharField(max_length=100)
    total = models.IntegerField()
    sum = models.IntegerField()
    id = models.IntegerField(primary_key=True)

