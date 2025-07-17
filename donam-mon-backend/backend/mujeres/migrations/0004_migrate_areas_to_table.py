from django.db import migrations

def migrate_areas_to_table(apps, schema_editor):
    Mujer = apps.get_model('mujeres', 'Mujer')
    AreaInvestigacion = apps.get_model('mujeres', 'AreaInvestigacion')
    
    # Crear áreas de investigación únicas desde los ArrayFields existentes
    areas_unicas = set()
    for mujer in Mujer.objects.all():
        if mujer.areas_investigacion:
            for area in mujer.areas_investigacion:
                if area.strip():  # Ignorar strings vacíos
                    areas_unicas.add(area.strip())
    
    print(f"Encontradas {len(areas_unicas)} áreas únicas: {areas_unicas}")
    
    # Crear registros en AreaInvestigacion
    for area_nombre in areas_unicas:
        area_obj, created = AreaInvestigacion.objects.get_or_create(nombre=area_nombre)
        if created:
            print(f"Creada área: {area_nombre}")

def reverse_migrate_areas_to_table(apps, schema_editor):
    # Función de reversión si es necesario
    AreaInvestigacion = apps.get_model('mujeres', 'AreaInvestigacion')
    # Opcional: eliminar todas las áreas creadas
    # AreaInvestigacion.objects.all().delete()
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('mujeres', '0003_remove_mujer_areas_investigacion_and_more'),
    ]

    operations = [
        migrations.RunPython(migrate_areas_to_table, reverse_migrate_areas_to_table),
    ]