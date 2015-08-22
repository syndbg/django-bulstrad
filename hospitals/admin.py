from django.contrib import admin

from .models import Hospital, HospitalType, HospitalLocation


class HospitalAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'latitude', 'longitude')
    fields = ('name', 'address', 'location', 'latitude', 'longitude', 'type',
              'hospital_help', 'out_of_hospital_help', 'laboratory_help')


admin.site.register(Hospital, HospitalAdmin)
admin.site.register(HospitalType)
admin.site.register(HospitalLocation)
