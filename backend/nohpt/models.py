from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.conf import settings

# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email,
            username=username,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

# User Model
class User(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    password_hash = models.CharField(max_length=255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.username

# Book Model
class Book(models.Model):
    book_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='books'
    )
    title = models.CharField(max_length=100)
    current_section = models.ForeignKey('Section', on_delete=models.SET_NULL, null=True, blank=True, related_name='current_books')
    def __str__(self):
        return self.title

# Section Model
class Section(models.Model):
    section_id = models.AutoField(primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='sections')
    order = models.IntegerField()
    text = models.TextField()
    music_path = models.TextField(null=True, blank=True)
    audio_path = models.TextField(null=True, blank=True) 
    image_path = models.URLField(max_length=700, blank=True, null=True)

    def __str__(self):
        return f'Section {self.order} of {self.book.title}'

# Character Model
class Character(models.Model):
    character_id = models.AutoField(primary_key=True)
    reference_photo = models.FileField(upload_to='characters/', null=True, blank=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='characters')

    def __str__(self):
        return f'Character {self.character_id} of {self.book.title}'
