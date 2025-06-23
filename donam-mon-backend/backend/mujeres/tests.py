from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from mujeres.models import Mujer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class MujerModelTest(TestCase):
    def test_creacion_mujer(self):
        mujer = Mujer.objects.create(
            nombre='Ada Lovelace',
            descripcion='Pionera de la programación',
            foto='fotos/ada.jpg',
            areas_investigacion=['Matemáticas', 'Computación'],
            fechas='1815-1852'
        )
        self.assertEqual(mujer.nombre, 'Ada Lovelace')
        self.assertIn('Computación', mujer.areas_investigacion)

class MujerAPITest(APITestCase):
    def setUp(self):
        # Crear usuario y token
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)

    def test_listado_mujeres(self):
        Mujer.objects.create(nombre='Ada', descripcion='Pionera', areas_investigacion=['Matemáticas'])
        url = reverse('mujer-list')  # Asegúrate de que el router DRF registre este nombre
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(len(response.data['results']), 1)
