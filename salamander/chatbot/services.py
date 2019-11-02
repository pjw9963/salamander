from django.contrib.sites import requests


def get_books(api_key, language, page):
    url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=1e94de5ed2dc8e3c7ef6674f1d7b6822&language=en-US&page=1'
    params = {'api_key': api_key, 'language': language, 'page' : page}
    r = requests.get(url, params=params)
    movies = r.json()
    movie_List = {'books': movies['results']}
    return books_list