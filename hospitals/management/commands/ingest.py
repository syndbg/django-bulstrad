from functools import reduce
from os import system, environ
from os.path import exists

import requests
from xlrd import open_workbook

from django.db.models import Q
from django.db.utils import IntegrityError
from django.core.management.base import BaseCommand, CommandError
from hospitals.models import Hospital, HospitalLocation, HospitalType


class Command(BaseCommand):
    help = 'Ingests the latest PDF list with supported hospitals'
    API_KEY = environ['PDF_KEY']
    DOWNLOAD_URL = 'http://www.bulstradlife.bg/uploads/%D0%9E%D0%9A_BLVIG_Spisak_lechebni_zavedenia.pdf'
    CONVERT_URL = 'https://pdftables.com/api?key={0}&format=xlsx'.format(API_KEY)
    PDF_FILENAME = 'bulstrad.pdf'
    XLSX_FILENAME = 'bulstrad.xlsx'
    CHUNK_SIZE = 4096

    def add_arguments(self, parser):
        parser.add_argument('--download', default=False, type=bool)

    def handle(self, **options):
        if options.get('download') is True:
            self.__download_file(self.DOWNLOAD_URL, self.PDF_FILENAME)
            self.__download_converted_xlsx()

        if not exists(self.XLSX_FILENAME):
            command_msg = 'No local file found. Download one by invoking \
                           the command with `--download=true`'
            raise CommandError(command_msg)

        type_data = self.__extract_types()
        self.__populate_types(type_data)
        self.__create_missing_types()

        data = self.__get_xlsx_data()
        self.__populate_hospitals_and_locations(data)

    def __populate_types(self, data):
        for type_name in data:
            try:
                hospital_type = self.__populate_type(type_name)
                self.stdout.write('Created {0}'.format(hospital_type))
            except IntegrityError:
                print('Duplicate record skipped')

    def __create_missing_types(self):
        for name in ('АИПСИМП', 'СБАЛК', 'ААГПСМП', 'МОБАЛ'):
            try:
                HospitalType.objects.create(name=name)
            except IntegrityError:
                print('Duplicate record skipped')

    def __populate_hospitals_and_locations(self, data):
        for location, name, address, out_of_hospital_help, hospital_help, laboratory_help in zip(*data):
            try:
                hospital_type = self.__find_type(name)
                location = self.__populate_location(location)
                hospital = self.__populate_hospital(name, location, address,
                                                    self.__is_checked(out_of_hospital_help),
                                                    self.__is_checked(hospital_help),
                                                    self.__is_checked(laboratory_help),
                                                    hospital_type)
                self.stdout.write('Created {0}'.format(hospital))
            except IntegrityError:
                print('Duplicate record skipped')

    def __find_type(self, name):
        if not name:
            return None
        condition = reduce(lambda x, y: x | y, [Q(name__contains=word) for word in name.split()])
        types = HospitalType.objects.filter(condition)
        return types[0] if len(types) > 0 else None

    def __is_checked(self, field):
        return field == 'X'

    def __download_file(self, url, filename, **kwargs):
        r = requests.get(url, stream=True)

        with open(filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=self.CHUNK_SIZE):
                if chunk:
                    f.write(chunk)
                    f.flush()

    def __download_converted_xlsx(self):
        # it's weird, but it's faster than
        # POSTing with requests and properly piping data
        system('curl -F f=@{0} "{1}" > {2}'.format(self.PDF_FILENAME,
                                                   self.CONVERT_URL,
                                                   self.XLSX_FILENAME))

    def __extract_types(self):
        workbook = open_workbook(self.XLSX_FILENAME)
        sheet = workbook.sheet_by_index(0)
        # Hospital Types:
        #   2 : 10 to pass the header and blank entries
        types = sheet.col_values(2, 2, 10)
        types += sheet.col_values(3, 2, 7)
        #   handle the messed up (reverse) descriptions and names
        types_names = sheet.col_values(4, 6, 9)
        types_descriptions = sheet.col_values(3, 7, 10)

        for type_name, type_description in zip(types_names, types_descriptions):
            types.append('{0}{1}'.format(type_name, type_description))

        #   handle two-line description
        types[0] = '{0} {1}'.format(types[0], types.pop(1))
        types[1] = '{0} {1}'.format(types[1], types.pop(2))
        types[3] = '{0} {1}'.format(types[3], types.pop(4))
        return types

    def __extract_first_sheet(self, sheet):
        # 13 : -4 to pass the first non-locations entries
        # and -4 to remove the last non-locations entries
        locations = sheet.col_values(1, 13, -1)
        names = sheet.col_values(2, 13, -1)
        addresses = sheet.col_values(3, 13, -1)
        out_of_hospital_helps = sheet.col_values(4, 13, -1)
        hospital_helps = sheet.col_values(5, 13, -1)
        laboratory_helps = sheet.col_values(6, 13, -1)

        return [locations, names, addresses,
                out_of_hospital_helps, hospital_helps, laboratory_helps]

    def __extract_middle_sheet(self, sheet):
        # 3 : -1 to pass the first non-locations entries
        # and -1 to remove the last non-locations entries
        locations = sheet.col_values(1, 3, -1)
        names = sheet.col_values(2, 3, -1)
        addresses = sheet.col_values(3, 3, -1)
        out_of_hospital_helps = sheet.col_values(4, 3, -1)
        hospital_helps = sheet.col_values(5, 3, -1)
        laboratory_helps = sheet.col_values(6, 3, -1)

        return [locations, names, addresses,
                out_of_hospital_helps, hospital_helps, laboratory_helps]

    def __extract_shifted_middle_sheet(self, sheet):
        # 3 : -1 to pass the first non-locations entries
        # and -1 to remove the last non-locations entries
        locations = sheet.col_values(0, 3, -1)
        names = sheet.col_values(1, 3, -1)
        addresses = sheet.col_values(2, 3, -1)
        out_of_hospital_helps = sheet.col_values(3, 3, -1)
        hospital_helps = sheet.col_values(4, 3, -1)
        laboratory_helps = sheet.col_values(5, 3, -1)

        return [locations, names, addresses,
                out_of_hospital_helps, hospital_helps, laboratory_helps]

    def __extract_last_sheet(self, sheet):
        # 3 : -1 to pass the first non-locations entries
        # and -1 to remove the last non-locations entries
        locations = sheet.col_values(1, 3, -4)
        names = sheet.col_values(2, 3, -4)
        addresses = sheet.col_values(3, 3, -4)
        out_of_hospital_helps = sheet.col_values(4, 3, -4)
        hospital_helps = sheet.col_values(5, 3, -4)
        laboratory_helps = sheet.col_values(6, 3, -4)

        return [locations, names, addresses,
                out_of_hospital_helps, hospital_helps, laboratory_helps]

    def __get_xlsx_data(self):
        workbook = open_workbook(self.XLSX_FILENAME)

        data = self.__extract_first_sheet(workbook.sheet_by_index(0))

        for i in range(1, 3):
            sheet = workbook.sheet_by_index(i)
            new_data = self.__extract_middle_sheet(sheet)
            data = self.__flatten_data(data, new_data)

        last_sheet_index = workbook.nsheets - 1

        for i in range(3, last_sheet_index):
            sheet = workbook.sheet_by_index(i)
            new_data = self.__extract_shifted_middle_sheet(sheet)
            data = self.__flatten_data(data, new_data)

        last_sheet = workbook.sheet_by_index(last_sheet_index)
        new_data = self.__extract_last_sheet(last_sheet)
        return self.__flatten_data(data, new_data)

    def __flatten_data(self, accumulated_data, new_data):
        for i, (old_column, new_column) in enumerate(zip(accumulated_data, new_data)):
            old_column.extend(new_column)
            accumulated_data[i] = old_column
        return accumulated_data

    def __populate_hospital(self, name, location, address, out_of_hospital_help,
                            hospital_help, laboratory_help, hospital_type):
        return Hospital.objects.get_or_create(name=name,
                                              location=location,
                                              address=address,
                                              out_of_hospital_help=out_of_hospital_help,
                                              hospital_help=hospital_help,
                                              laboratory_help=laboratory_help,
                                              type=hospital_type)[0]

    def __populate_location(self, name):
        return HospitalLocation.objects.get_or_create(name=name)[0]

    def __populate_type(self, name):
        return HospitalType.objects.get_or_create(name=name)[0]
