from rest_framework.response import Response
from rest_framework import decorators, filters, viewsets

from .filters import HospitalFilter
from .models import Hospital, HospitalLocation, HospitalType
from .serializers import HospitalSerializer, HospitalLocationSerializer, HospitalTypeSerializer


class HospitalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Hospital.objects.all().order_by('name')
    serializer_class = HospitalSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = HospitalFilter

    @decorators.list_route(methods=['get'])
    def count(self, request, pk=None):
        hospitals_count = Hospital.objects.all().count()
        return Response({'count': hospitals_count})


class HospitalLocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HospitalLocation.objects.all().order_by('name')
    serializer_class = HospitalLocationSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('id', 'name',)


class HospitalTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HospitalType.objects.all().order_by('name')
    serializer_class = HospitalTypeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('id', 'name',)
