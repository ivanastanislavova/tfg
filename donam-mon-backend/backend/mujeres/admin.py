from django.contrib import admin
from .models import Mujer, Lugar

class LugarAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'latitud', 'longitud')
    search_fields = ('nombre',)

class MujerAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)

admin.site.register(Mujer, MujerAdmin)
admin.site.register(Lugar, LugarAdmin)
