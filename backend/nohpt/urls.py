from django.urls import path
from .views import *

urlpatterns = [
    path('users/register', UserRegister.as_view(), name='user_register'),
    path('users/login', UserLogin.as_view(), name='user_login'),
    path('users/profile', UserProfile.as_view(), name='user_profile'),
    path('books', BookListCreate.as_view(), name='book-list-create'),
    path('books/<int:pk>/current_section', BookCurrentSection.as_view(), name='book-current-section'),
    path('books/<int:pk>', BookDetailUpdateDelete.as_view(), name='book-detail-update-delete'),
    path('books/<int:bookId>/sections', SectionListCreate.as_view(), name='section-list-create'),
    path('books/<int:bookId>/sections/<int:pk>', SectionDetailUpdateDelete.as_view(), name='section-detail-update-delete'),
    path('books/<int:bookId>/characters', CharacterListCreate.as_view(), name='character-list-create'),
    path('books/<int:bookId>/characters/<int:pk>', CharacterDetailUpdateDelete.as_view(), name='character-detail-update-delete'),
    path('upload_book/', BookUploadView.as_view(), name='upload_book'),
]
