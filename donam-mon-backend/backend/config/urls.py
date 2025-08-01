"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from mujeres.views import MujerViewSet, LugarViewSet, UserUpdateView, RegisterView, VisitedLugarView, rutas_list, VisitedLugarRutaView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'mujeres', MujerViewSet)
router.register(r'lugares', LugarViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/api-token-auth/', obtain_auth_token),
    path('api/update-username/', UserUpdateView.as_view()),
    path('api/register/', RegisterView.as_view()),
    path('api/visit-lugar/', VisitedLugarView.as_view()),
    path('api/visited-lugares/', VisitedLugarView.as_view()),
    path('api/visit-lugar-ruta/', VisitedLugarRutaView.as_view()),
    path('api/visited-lugares-ruta/', VisitedLugarRutaView.as_view()),
    path('api/rutas/', rutas_list),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
