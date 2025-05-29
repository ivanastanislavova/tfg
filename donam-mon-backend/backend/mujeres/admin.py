from django import forms
from django.contrib import admin
from .models import Mujer, Lugar
from django.contrib.gis.geos import Point
from django.contrib.postgres.forms import SimpleArrayField, SplitArrayWidget

class LugarInlineForm(forms.ModelForm):
    latitud = forms.FloatField(label='Latitud')
    longitud = forms.FloatField(label='Longitud')
    foto = forms.ImageField(label='Foto', required=False)

    class Meta:
        model = Lugar
        fields = ['nombre', 'descripcion', 'latitud', 'longitud', 'foto']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.ubicacion:
            self.fields['latitud'].initial = self.instance.ubicacion.y
            self.fields['longitud'].initial = self.instance.ubicacion.x
        if self.instance and self.instance.foto:
            self.fields['foto'].initial = self.instance.foto

    def save(self, commit=True):
        lat = self.cleaned_data['latitud']
        lon = self.cleaned_data['longitud']
        self.instance.ubicacion = Point(lon, lat)
        foto = self.cleaned_data.get('foto', None)
        if foto and hasattr(foto, 'file'):
            self.instance.foto = foto
        # Si se ha marcado para limpiar la foto
        elif self.cleaned_data.get('foto', None) is False:
            self.instance.foto = None
        return super().save(commit)

class LugarInline(admin.TabularInline):
    model = Lugar
    form = LugarInlineForm
    extra = 1

class MujerAdmin(admin.ModelAdmin):
    inlines = [LugarInline]
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if 'areas_investigacion' in form.base_fields:
            form.base_fields['areas_investigacion'].widget = forms.Textarea(attrs={'rows': 2, 'placeholder': 'Ej: Física, Química'})
        return form

admin.site.register(Mujer, MujerAdmin)
admin.site.register(Lugar)
