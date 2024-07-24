from rest_framework_simplejwt.tokens import Token
from .models import User, Profile
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
 

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)
    fullname = serializers.CharField(write_only=True, required=False)
    bio = serializers.CharField(write_only=True, required=False)
    image = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'username', 'fullname', 'password', 'password2', 'image', 'bio')
        extra_kwargs = {
            "password": {"write_only": True}, 
            "password2": {"write_only": True},
        }
        

    def validate(self, data):
        if 'password' in data and 'password2' in data:
            if data['password'] != data['password2']:
                raise serializers.ValidationError('Passwords do not match!')
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2')
        fullname = validated_data.pop('fullname', None)
        bio = validated_data.pop('bio', None)
        image = validated_data.pop('image', None)

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        if fullname:
            try:
                profile = user.user_profile
                profile.fullname = fullname
                profile.save()
            except:
                print('user does not exist')
        if bio:
            try:
                profile = user.user_profile
                profile.bio = bio
                profile.save()
            except:
                print('user does not exist')
        if image:
            try:
                profile = user.user_profile
                profile.image = image
                profile.save()
            except:
                print('user does not exist')

        return user

    def update(self, instance, validated_data):
        validated_data.pop('password', None)
        validated_data.pop('password2', None)
        fullname = validated_data.pop('fullname', None)
        bio = validated_data.pop('bio', None)
        image = validated_data.pop('image', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        try:
            profile = instance.user_profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=instance)

        if fullname:
            profile.fullname = fullname
        if bio:
            profile.bio = bio
        if image:
            profile.image = image
        profile.save()

        return instance

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user) -> Token:
        token = super().get_token(user)
    
        token['fullname']   = user.user_profile.fullname
        token['username']   = user.username
        token['email']      = user.email
        token['is_superuser'] = user.is_superuser

        print('token send successfully', token)
        return token
    

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    is_superuser = serializers.SerializerMethodField()
    uid = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('fullname', 'username', 'email', 'bio', 'image', 'verified', 'is_superuser', 'uid')

    def get_username(self, obj):
        return obj.user.username
    
    def get_email(self, obj):
        return obj.user.email
    
    def get_is_superuser(self, obj):
        return obj.user.is_superuser

    def get_uid(self, obj):
        return obj.user.id