from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, UserProfileSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Book, Section, Character
from .serializers import BookSerializer, SectionSerializer, CharacterSerializer
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser
import re
from django.contrib.auth import get_user_model
import openai
import requests
import os
import base64
import sys
from django.conf import settings

User = get_user_model()

class UserRegister(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogin(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfile(APIView):
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookListCreate(ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        """
        This view should return a list of all the books
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_authenticated:
            return Book.objects.filter(user=user)
        return Book.objects.none()  # Return an empty queryset for unauthenticated users
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def post(self, request, *args, **kwargs):
        # Basic data validation
        title = request.data.get('title')
        text_file = request.FILES.get('text_file')
        # audios = request.FILES.getlist('audios')
        # music_files = request.FILES.getlist('music')
        if not text_file or not title:
            return JsonResponse({'error': 'Missing title or text file'}, status=400)
        username = request.user.username
        book = Book.objects.create(title=title, user = request.user)
        self.process_text_file(book, text_file)

        return JsonResponse({'message': 'Book and sections created successfully', 'book_id': book.book_id}, status=201)

    def process_text_file(self, book, text_file):
        # Read and decode the file content
        content = text_file.read().decode('utf-8')
        sentences = re.split(r'(?<=[.!?]) +', content)
        chunks = [sentences[x:x+8] for x in range(0, len(sentences), 8)]  # Get first 3 chunks of ~8 sentences
        for i, chunk in enumerate(chunks):
            text = ' '.join(chunk)
            Section.objects.create(
                book=book,
                order=i,  # Increment order
                text=text,
                image_path=get_image(text),
                audio_path=text_to_audio(text),
                music_path=text_to_music(text),
            )

        # book.section_count += len(chunks)
        book.save()
    
class BookDetailUpdateDelete(RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class BookCurrentSection(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        book = Book.objects.filter(pk=pk).first()
        if not book:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        if book.current_section:
            serializer = SectionSerializer(book.current_section)
            return Response(serializer.data)
        return Response({'message': 'No current section set for this book.'}, status=status.HTTP_404_NOT_FOUND)
    
class SectionListCreate(ListCreateAPIView):
    serializer_class = SectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        This view returns a list of all the sections for
        the book as determined by the bookId portion of the URL.
        """
        book_id = self.kwargs['bookId']
        return Section.objects.filter(book_id=book_id)

    def perform_create(self, serializer):
        """
        Set the section's book based on the bookId URL parameter
        """
        book_id = self.kwargs['bookId']
        serializer.save(book_id=book_id)

class SectionDetailUpdateDelete(RetrieveUpdateDestroyAPIView):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Override the default queryset to filter sections by bookId,
        ensuring that section operations are scoped to the correct book.
        """
        book_id = self.kwargs['bookId']
        return Section.objects.filter(book_id=book_id)

class CharacterListCreate(ListCreateAPIView):
    serializer_class = CharacterSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Returns a list of all characters for the book identified by bookId.
        """
        book_id = self.kwargs['bookId']
        return Character.objects.filter(book_id=book_id)

    def perform_create(self, serializer):
        """
        Sets the character's associated book based on the bookId URL parameter.
        """
        book_id = self.kwargs['bookId']
        serializer.save(book_id=book_id)

class CharacterDetailUpdateDelete(RetrieveUpdateDestroyAPIView):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Filters the queryset by bookId to ensure operations are scoped to the correct book.
        """
        book_id = self.kwargs['bookId']
        return Character.objects.filter(book_id=book_id)
    

def get_image(original_text):
    openai.api_key = "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"

    response = openai.Image.create(
        model="dall-e-3",
        prompt="Create a picture of the following storybook scene avoid making it less violent. Avoid writing any captions, writing, or word boxes on the image. Avoid cartoon style images and make the images more consistent with previous."
        + original_text,
        n=1,
        size="1024x1024",
    )

    # print(summarized_text)

    image_url = response["data"][0]["url"]
    print(image_url)
    return image_url


def wav_to_base64(file_path):
    with open(file_path, "rb") as wav_file:
        binary_data = wav_file.read()
        base64_data = base64.b64encode(binary_data)
        base64_string = base64_data.decode("utf-8")
        return base64_string
    
def base64_to_wav(base64_string, output_file_path):
    binary_data = base64.b64decode(base64_string)
    with open(output_file_path, "wb") as wav_file:
        wav_file.write(binary_data)

def text_to_audio(original_text):
    file_path = os.path.join(settings.BASE_DIR, "morganfreeman.wav")
    print(file_path)
    voice = wav_to_base64(file_path)

    text = original_text
    data = {"text": text, "speaker_voice": voice, "language": "en"}

    resp = requests.post(
        "https://model-5qelep03.api.baseten.co/production/predict",
        headers={"Authorization": "Api-Key jx14E46a.7BWZCjLOBwgd6kHdmDEQ73h1gpoPycb6"},
        json=data
    )

    resp = resp.json()
    output = resp.get('output')
    return output

def text_to_music(text): 

    resp = requests.post(
        "https://model-4q95xj6w.api.baseten.co/development/predict", # 4q95xj6w is the model ID - change if needed
        headers={"Authorization": "Api-Key W1qH21WX.rU5DjJ5Sv1Nud4gLcA3Zi9YqoOcFiYmZ"}, # same with API key
        json={'prompts': [text], 'duration': 10},
    )

    return(resp.json().get('output'))