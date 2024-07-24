from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.db.models.signals import post_save



class User(AbstractUser):
    email=models.EmailField(unique=True)
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']



class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name='user_profile')
    fullname=models.CharField(null=True,blank=True,max_length=200)
    bio=models.CharField(null=True,blank=True,max_length=500)
    image=models.ImageField(upload_to='profile_pic',default='profile_pic/defaulf.png',null=True,blank=True)
    verified=models.BooleanField(default=False)



@receiver(post_save,sender=User)
def create_profile(sender,instance,created,**kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.user_profile.save()

@receiver(post_save,sender=User)
def save_profile(sender,instance,**kwargs):
    instance.user_profile.save()