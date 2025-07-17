from django.contrib import admin
from .models import Mujer, Lugar, VisitedLugarRuta, Ruta, AreaInvestigacion

class LugarAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'latitud', 'longitud', 'ar_url')
    search_fields = ('nombre',)

class MujerAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)
    filter_horizontal = ('areas_investigacion',)

class RutaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)
    filter_horizontal = ('mujeres', 'lugares')  # Permite seleccionar fácilmente

class AreaInvestigacionAdmin(admin.ModelAdmin): 
    list_display = ('nombre',)
    search_fields = ('nombre',)

admin.site.register(Mujer, MujerAdmin)
admin.site.register(Lugar, LugarAdmin)
admin.site.register(VisitedLugarRuta)
admin.site.register(Ruta, RutaAdmin)
admin.site.register(AreaInvestigacion, AreaInvestigacionAdmin)  
