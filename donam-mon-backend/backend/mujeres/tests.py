from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from mujeres.models import Mujer, AreaInvestigacion  # ← AGREGAR AreaInvestigacion
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class MujerModelTest(TestCase):
    def test_creacion_mujer(self):
        # Crear áreas de investigación primero
        area_matematicas = AreaInvestigacion.objects.create(nombre='Matemáticas')
        area_computacion = AreaInvestigacion.objects.create(nombre='Computación')
        
        mujer = Mujer.objects.create(
            nombre='Ada Lovelace',
            descripcion='Pionera de la programación',
            foto='fotos/ada.jpg',
            fechas='1815-1852'
        )
        # Agregar áreas después de crear el objeto (ManyToMany)
        mujer.areas_investigacion.add(area_matematicas, area_computacion)
        
        self.assertEqual(mujer.nombre, 'Ada Lovelace')
        self.assertIn(area_computacion, mujer.areas_investigacion.all())

class MujerAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)

    def test_listado_mujeres(self):
        # Crear área y mujer correctamente
        area = AreaInvestigacion.objects.create(nombre='Matemáticas')
        mujer = Mujer.objects.create(nombre='Ada', descripcion='Pionera')
        mujer.areas_investigacion.add(area)
        
        url = reverse('mujer-list')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(len(response.data['results']), 1)