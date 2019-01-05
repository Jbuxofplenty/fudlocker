import json
from jsonmerge import merge
from os import listdir
from os.path import isfile, join
onlyfiles = [f for f in listdir('.') if isfile(join('.', f))]
data = []
final_data = {'meals': {}}
for file in onlyfiles:
    if '.json' in file and not 'all_meals' in file and not 'farrand' in file and not 'village' in file and not 'c4c' in file and not 'order' in file:
        json1=open(file)
        data.append(json.load(json1))

final_data = {}
final_data['meals'] = []
for datum in data:
    for meal in datum['meals']:
        temp = meal
        final_data['meals'].append(meal)

for i, meal in enumerate(final_data['meals']):
    meal['idMeal'] = i+1


with open('all_meals.json', 'w') as outfile:
    json.dump(final_data, outfile)