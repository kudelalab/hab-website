"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from hab import views
from django.urls import path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('load/<str:lab_name>/<int:week>/', views.load_by_week),
    path('load/<str:lab_name>/<str:start_date>/<str:end_date>/', views.load_by_range),
    path('load/warnings/<str:lab_name>/', views.load_warnings),
    path('load/info/<str:lab_name>/', views.load_info),
    re_path('.*',TemplateView.as_view(template_name='index.html')),
]