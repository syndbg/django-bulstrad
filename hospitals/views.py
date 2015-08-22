from rest_framework import viewsets

from .models import Hospital, HospitalLocation, HospitalType
from .serializers import HospitalSerializer, HospitalLocationSerializer, HospitalTypeSerializer


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all().order_by('name')
    serializer_class = HospitalSerializer


class HospitalLocationViewSet(viewsets.ModelViewSet):
    queryset = HospitalLocation.objects.all().order_by('name')
    serializer_class = HospitalLocationSerializer


class HospitalTypeViewSet(viewsets.ModelViewSet):
    queryset = HospitalType.objects.all().order_by('name')
    serializer_class = HospitalTypeSerializer
