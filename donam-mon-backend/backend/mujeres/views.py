from rest_framework import viewsets
from .models import Mujer, Lugar, UserProfile
from .serializers import MujerSerializer, LugarSerializer, UserRegisterSerializer
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

class MujerViewSet(viewsets.ModelViewSet):
    queryset = Mujer.objects.all()
    serializer_class = MujerSerializer

class LugarViewSet(viewsets.ModelViewSet):
    queryset = Lugar.objects.all()
    serializer_class = LugarSerializer

class LugarListAPIView(viewsets.ReadOnlyModelViewSet):
    queryset = Lugar.objects.all()
    serializer_class = LugarSerializer

class UserUpdateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        new_username = request.data.get('username')
        if not new_username:
            return Response({'error': 'El nombre de usuario es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
            return Response({'error': 'Ese nombre de usuario ya existe.'}, status=status.HTTP_400_BAD_REQUEST)
        user.username = new_username
        user.save()
        return Response({'success': 'Nombre de usuario actualizado', 'username': user.username})

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': 'Usuario creado correctamente.'}, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
