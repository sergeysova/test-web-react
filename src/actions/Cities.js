
import { get } from 'axios'
import Tree from 'tree';


/**
 * Find city by API and add to list
 * @param  {String} query    City name or city coordinates (lon,lat)
 * @return {Promise}         City info
 */
export function locateCity(query) {
  const cities = Tree.select('cities', 'list');

  return get(`/weather?location=${query}`)
  .then((response) => {
    const newCity = response.data.content;
    const targetIndex = cities.get().findIndex((saved) => saved.city.id === newCity.city.id);

    // If city doesn't exists add it or update
    if (targetIndex == -1) {
      cities.unshift(newCity);
    }
    else {
      cities.set(targetIndex, newCity);
    }

    // clear cursor memory
    cities.release();

    return response.data;
  });
}


/**
 * Remove city from list
 * @param  {Number} cityId City id from API
 */
export function dropCity(cityId) {
  const cities = Tree.select('cities', 'list');
  const selected = Tree.select('cities', 'selected');
  const cityIndex = cities.get().findIndex((saved) => saved.city.id === cityId);

  if (cityIndex > -1) {
    cities.splice([cityIndex, 1]);
  }

  // Remove selection
  if (selected.get() == cityId) {
    selected.set(-1);
  }

  // clear memory
  cities.release();
  selected.release();
}

