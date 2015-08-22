from django.contrib import admin

from .models import Hospital, HospitalType, HospitalLocation

admin.site.register(Hospital)
admin.site.register(HospitalType)
admin.site.register(HospitalLocation)
