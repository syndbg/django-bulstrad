from django.db import models


class HospitalLocation(models.Model):
    name = models.CharField(unique=True, max_length=255, blank=False, null=False)

    def __str__(self):
        return self.name


class HospitalType(models.Model):
    name = models.CharField(unique=True, max_length=255, blank=False, null=False)

    def __str__(self):
        return self.name


class Hospital(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    address = models.TextField(blank=False, null=False)
    location = models.ForeignKey(HospitalLocation,
                                 related_name='hospitals',
                                 on_delete=models.SET_NULL,
                                 null=True)
    type = models.ForeignKey(HospitalType,
                             related_name='hospitals',
                             on_delete=models.SET_NULL,
                             null=True)

    hospital_help = models.BooleanField(default=False)
    out_of_hospital_help = models.BooleanField(default=False)
    laboratory_help = models.BooleanField(default=False)

    latitude = models.DecimalField(null=True, max_digits=12, decimal_places=9)
    longitude = models.DecimalField(null=True, max_digits=12, decimal_places=9)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = (('name', 'address', 'location'),)
