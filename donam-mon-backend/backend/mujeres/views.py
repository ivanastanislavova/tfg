from rest_framework import viewsets
from .models import Mujer, Lugar, UserProfile, VisitedLugar
from .serializers import MujerSerializer, LugarSerializer, UserRegisterSerializer, VisitedLugarSerializer
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.shortcuts import get_object_or_404

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

class VisitedLugarView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lugar_id = request.data.get('lugar_id')
        if not lugar_id:
            return Response({'error': 'lugar_id es requerido'}, status=400)
        lugar = get_object_or_404(Lugar, id=lugar_id)
        visited, created = VisitedLugar.objects.get_or_create(user=request.user, lugar=lugar)
        if not created:
            return Response({'message': 'Ya registrado', 'visited_at': visited.visited_at}, status=200)
        serializer = VisitedLugarSerializer(visited)
        return Response(serializer.data, status=201)

    def get(self, request):
        visits = VisitedLugar.objects.filter(user=request.user).select_related('lugar')
        serializer = VisitedLugarSerializer(visits, many=True)
        return Response(serializer.data)

    def delete(self, request):
        VisitedLugar.objects.filter(user=request.user).delete()
        return Response({'success': 'Historial de lugares visitados borrado.'}, status=204)
