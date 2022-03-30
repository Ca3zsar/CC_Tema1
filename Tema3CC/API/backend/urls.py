from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('twitter/', include('twitter.urls')),
    path('', lambda request: redirect('twitter/')),
]
