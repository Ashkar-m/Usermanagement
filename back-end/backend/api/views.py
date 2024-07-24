from django.shortcuts import render
from .serializers import MyTokenObtainPairSerializer, UserSerializer, ProfileSerializer
from .models import User, Profile
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes  = [AllowAny]


class UesrProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if self.request.user.is_authenticated:
            return self.request.user.user_profile
        else:
            raise NotAuthenticated("User is not authenticated")

class UserProfileUpdateView(APIView):
    def patch(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many = True)
        return Response(serializer.data)
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# class ProfileViewSet(viewsets.ModelViewSet):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer
#     permission_classes = [AllowAny]

#     def get_object(self):
#         # Override this method to fetch profile by `uid`
#         uid = self.kwargs.get('pk')
#         print(uid)
#         return Profile.objects.get(user_id=uid)

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         user = instance.user
#         self.perform_destroy(instance)
#         user.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
#     def perform_destroy(self, instance):
#         instance.delete()

#     def update(self, request, *args, **kwargs):
#         print(request)
#         partial = kwargs.pop('partial', False)
#         instance = self.get_object()
#         print('This is the instance', instance)
        
#         # Get the data to update
#         profile_data = request.data
#         user_data = {
#             'username': profile_data.get('username', instance.user.username),
#             'email': profile_data.get('email', instance.user.email),
#         }
        
#         # Update User instance
#         user_serializer = UserSerializer(instance.user, data=user_data, partial=partial)
#         if user_serializer.is_valid():
#             user_serializer.save()
#         else:
#             return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         # Update Profile instance
#         profile_serializer = self.get_serializer(instance, data=profile_data, partial=partial)
#         if profile_serializer.is_valid():
#             self.perform_update(profile_serializer)
#             return Response(profile_serializer.data)
#         else:
#             return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def perform_update(self, serializer):
#         serializer.save()

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        uid = self.kwargs.get('pk')
        return Profile.objects.get(user_id=uid)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user
        self.perform_destroy(instance)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        profile_data = request.data
        user_data = {
            'username': profile_data.get('username', instance.user.username),
            'email': profile_data.get('email', instance.user.email),
        }

        user_serializer = UserSerializer(instance.user, data=user_data, partial=partial)
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        profile_serializer = self.get_serializer(instance, data=profile_data, partial=partial)
        if profile_serializer.is_valid():
            self.perform_update(profile_serializer)
            return Response(profile_serializer.data)
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()
