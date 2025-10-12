/*
Uses Nutritionix API 
*/

const appId = import.meta.env.VITE_APPID
const apiKey = import.meta.env.VITE_API_KEY
import axios from 'axios'

/**
 * Search for different options of food with the food name
 */
export async function searchFood(foodName) {
  const listOfFoods = []

  try {
    const response = await axios.get('https://trackapi.nutritionix.com/v2/search/instant', {
      params: {
        query: foodName,
        common: true,
        detailed: false,
      },
      headers: {
        'x-app-id': appId,
        'x-app-key': apiKey,
      },
    })

    const foods = response.data.common.map((item) => ({
      name: item.food_name,
      tag_id: item.tag_id,
    }))

    // Add unique foods based on the food tag id
    foods.forEach((food) => {
      if (!listOfFoods.some((existingFood) => existingFood.tag_id === food.tag_id)) {
        listOfFoods.push(food)
      }
    })
  } catch (error) {
    console.error('Error fetching food names:', error)
  }
  return listOfFoods
}

/**
 * Post the food name to get the nutrient facts
 */
export async function getFoodDetails(foodName) {
  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      {
        query: foodName,
      },
      {
        headers: {
          'x-app-id': appId,
          'x-app-key': apiKey,
        },
      },
    )

    // Get nutrient information from the response
    const nutrients = {
      calories: response.data.foods[0].nf_calories,
      carbs: response.data.foods[0].nf_total_carbohydrate,
      protein: response.data.foods[0].nf_protein,
      fat: response.data.foods[0].nf_total_fat,
      sodium: response.data.foods[0].nf_sodium,
      sugar: response.data.foods[0].nf_sugars,
      servingWeight: response.data.foods[0].serving_weight_grams,
      servingUnit: response.data.foods[0].serving_unit,
      servingQuantity: response.data.foods[0].serving_qty,
    }
    return nutrients
  } catch (error) {
    console.error('Error fetching nutrient facts', error)
    return null
  }
}
