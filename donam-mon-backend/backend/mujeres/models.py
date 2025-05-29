from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField

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
    ubicacion = models.PointField()
    mujer = models.ForeignKey(Mujer, related_name='lugares', on_delete=models.CASCADE)
    foto = models.ImageField(upload_to='', null=True, blank=True)

    def __str__(self):
        return self.nombre
