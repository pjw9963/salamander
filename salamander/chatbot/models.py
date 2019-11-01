from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=100)
    ratings = models.IntegerField()
    value = models.IntegerField()
    movie_id = models.IntegerField()

