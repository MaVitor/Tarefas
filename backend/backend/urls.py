from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tarefas.views import ProjetoViewSet, TarefaViewSet, UserViewSet, CustomAuthToken
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

router = DefaultRouter()
router.register(r'usuarios', UserViewSet, basename='usuario')
router.register(r'projetos', ProjetoViewSet, basename='projeto')
router.register(r'tarefas', TarefaViewSet, basename='tarefa')

schema_view = get_schema_view(
    openapi.Info(
        title="API de Gerenciamento de Tarefas",
        default_version='v1',
        description="Documentação da API de Tarefas com Django Rest Framework",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Authentication endpoints
    path('api/auth/login/', CustomAuthToken.as_view(), name='api_token_auth'),
    path('api-auth/', include('rest_framework.urls')),
    
    # Swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
