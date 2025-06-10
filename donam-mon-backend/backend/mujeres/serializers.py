from rest_framework import serializers
from .models import Mujer, Lugar

class LugarSerializer(serializers.ModelSerializer):
    latitud = serializers.SerializerMethodField()
    longitud = serializers.SerializerMethodField()
    mujer = serializers.StringRelatedField()
    foto_url = serializers.SerializerMethodField()

    class Meta:
        model = Lugar
        fields = ('id', 'nombre', 'descripcion', 'latitud', 'longitud', 'mujer', 'foto', 'foto_url')

    def get_latitud(self, obj):
        return obj.ubicacion.y if obj.ubicacion else None

    def get_longitud(self, obj):
        return obj.ubicacion.x if obj.ubicacion else None

    def get_foto_url(self, obj):
        request = self.context.get('request')
        if obj.foto:
            url = obj.foto.url
            url = url.replace('/fotos/fotos/', '/fotos/')
            if request is not None:
                return request.build_absolute_uri(url)
            else:
                return url
        return None

class MujerSerializer(serializers.ModelSerializer):
    lugares = LugarSerializer(many=True, read_only=True)
    foto_url = serializers.SerializerMethodField()

    class Meta:
        model = Mujer
        fields = ('id', 'nombre', 'descripcion', 'foto', 'foto_url', 'lugares', 'areas_investigacion')

    def get_foto_url(self, obj):
        request = self.context.get('request')
        if obj.foto:
            url = obj.foto.url
            # Elimina doble 'fotos/' si existe
            url = url.replace('/fotos/fotos/', '/fotos/')
            if request is not None:
                return request.build_absolute_uri(url)
            else:
                return url
        return None
