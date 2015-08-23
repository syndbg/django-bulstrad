import django_filters

from hospitals.models import Hospital


class HospitalFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(name='name', lookup_type='icontains')
    address = django_filters.CharFilter(name='address', lookup_type='icontains')
    location = django_filters.NumberFilter(name='location__id')
    type = django_filters.NumberFilter(name='type__id')

    class Meta:
        model = Hospital
        fields = ('id', 'name', 'latitude', 'address', 'out_of_hospital_help',
                  'longitude', 'type', 'location', 'hospital_help',
                  'laboratory_help')
