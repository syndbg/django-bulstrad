import multiprocessing

bind = 'unix:/tmp/' + 'django-bulstrad' + '.socket'
workers = multiprocessing.cpu_count() * 2 + 1
proc_name = 'django-bulstrad' + '-gunicorn'

access_log = './access.log'
error_log = './error.log'
