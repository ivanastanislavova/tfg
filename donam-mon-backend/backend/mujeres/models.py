from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.utils import timezone

class AreaInvestigacion(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

class Mujer(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    foto = models.ImageField(upload_to='', null=True, blank=True)
    areas_investigacion = ArrayField(
        models.CharField(max_length=100),
        blank=True,
        default=list,
        verbose_name='Áreas de investigación'
    )
    fechas = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.nombre

class Lugar(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    latitud = models.FloatField(null=True, blank=True)
    longitud = models.FloatField(null=True, blank=True)
    mujer = models.ForeignKey(Mujer, related_name='lugares', on_delete=models.CASCADE)
    foto = models.ImageField(upload_to='', null=True, blank=True)
    ar_url = models.URLField(max_length=300, null=True, blank=True, verbose_name='URL de Realidad Aumentada')

    def __str__(self):
        return self.nombre

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    birth_date = models.DateField(null=True, blank=True)
    email = models.EmailField(max_length=254, unique=True)

    def __str__(self):
        return self.user.username

class VisitedLugar(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visited_lugares')
    lugar = models.ForeignKey(Lugar, on_delete=models.CASCADE)
    visited_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'lugar')
        ordering = ['-visited_at']

    def __str__(self):
        return f"{self.user.username} visitó {self.lugar.nombre} el {self.visited_at}"

class VisitedLugarRuta(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visited_lugares_ruta')
    ruta = models.ForeignKey('Ruta', on_delete=models.CASCADE, related_name='visitas')
    lugar = models.ForeignKey(Lugar, on_delete=models.CASCADE)
    visited_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'ruta', 'lugar')
        ordering = ['-visited_at']

    def __str__(self):
        return f"{self.user.username} visitó {self.lugar.nombre} en ruta {self.ruta.nombre} el {self.visited_at}"

class Ruta(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    mujeres = models.ManyToManyField('Mujer', related_name='rutas', blank=True)
    lugares = models.ManyToManyField('Lugar', related_name='rutas', blank=True)

    def __str__(self):
        return self.nombre
