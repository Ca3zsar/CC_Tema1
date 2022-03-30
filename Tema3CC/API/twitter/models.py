from django.db import models

# Create your models here.
import datetime

from django.db import models

class Account(models.Model):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=255, unique=True)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "twitter_accounts"

    def __str__(self):
        return f"{self.username} - {self.email}"
