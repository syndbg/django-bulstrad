from rest_framework import serializers
from .models import Hospital, HospitalType, HospitalLocation


class HospitalTypeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = HospitalType
        fields = ('id', 'url', 'name',)


class HospitalLocationSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = HospitalLocation
        fields = ('id', 'url', 'name',)


class HospitalSerializer(serializers.HyperlinkedModelSerializer):
    location = HospitalLocationSerializer(read_only=True)
    type = HospitalTypeSerializer(read_only=True)

    class Meta:
        model = Hospital
        fields = ('id', 'url', 'name', 'address', 'location', 'type',
                  'hospital_help', 'out_of_hospital_help', 'laboratory_help')
