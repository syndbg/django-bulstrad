from translate import Translator
from geopy.geocoders import GoogleV3

from django.core.management.base import BaseCommand

from hospitals.models import Hospital


class Command(BaseCommand):
    help = 'Populate `latitude`/`longitude` for `Hospital` records.\
    Note that API limits for Google Maps and MyMemory apply!'

    API_KEY = 'AIzaSyCFygjt6Do11VL1vAy06C53UTswPJyXLUs'
    API_TIMEOUT = 10

    def handle(self, **options):
        for hospital in Hospital.objects.filter(latitude=None, longitude=None):
            geocode = self.__get_geocode(hospital)

            if geocode is not None:
                hospital.latitude = geocode.latitude
                hospital.longitude = geocode.longitude
                hospital.save(False)
                self.stdout.write('Added latitude and longitude for <{0}>'
                    .format(hospital))

    def __reverse_abbreviations(self, string):
        meanings = {
            'хл': 'хотел'
        }
        words = string.split()
        for i, word in enumerate(words):
            words[i] = meanings.get(word.lower(), word)
        return ' '.join(words)

    def __get_geocode(self, hospital):
        geolocator = GoogleV3(api_key=self.API_KEY)
        translator = Translator(from_lang='bg', to_lang='eng')

        name_query = self.__filter_only_letters(hospital.name)
        address_query = self.__reverse_abbreviations(self.__filter_only_letters(hospital.address))
        translated_address_query = translator.translate(address_query)

        # `name` and `translated address` are matched more often
        for query in [name_query, translated_address_query, address_query]:
            geocode_result = self.__geocode(geolocator, query)
            if geocode_result is not None:
                return geocode_result
        return None

    def __filter_only_letters(self, string):
        letters = [letter for letter in string if letter.isspace() or letter.isalnum()]
        return ''.join(letters)

    def __geocode(self, geolocator, query):
        return geolocator.geocode(query=query, exactly_one=True,
                                  timeout=self.API_TIMEOUT, sensor=False)