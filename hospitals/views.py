from rest_framework import filters, viewsets

from .models import Hospital, HospitalLocation, HospitalType
from .serializers import HospitalSerializer, HospitalLocationSerializer, HospitalTypeSerializer


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all().order_by('name')
    serializer_class = HospitalSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('id', 'name',)


class HospitalLocationViewSet(viewsets.ModelViewSet):
    queryset = HospitalLocation.objects.all().order_by('name')
    serializer_class = HospitalLocationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('id', 'name',)


class HospitalTypeViewSet(viewsets.ModelViewSet):
    queryset = HospitalType.objects.all().order_by('name')
    serializer_class = HospitalTypeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('id', 'name',)
