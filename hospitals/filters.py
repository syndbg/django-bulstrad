import django_filters

from hospitals.models import Hospital


class HospitalFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_type='icontains')

    class Meta:
        model = Hospital
        fields = ('id', 'name', 'latitude', 'longitude')
