const mealsEl = document.getElementById('meals')
const favContainer = document.getElementById('fav-meals')
const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')
const mealPopup = document.getElementById('meal-popup')
const closePopupBtn = document.getElementById('close-popup')
const mealInfoEl = document.getElementById('meal-info')
getRamdomMeal()
fetchFavMeals()

async function getRamdomMeal() {
  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
  const respData = await resp.json()
  const randomMeal = respData.meals[0]
  addMeal(randomMeal, true)  
}




function addMeal(mealData, random = false) {

  const meal = document.createElement("div")
  meal.classList.add("meal")
  meal.innerHTML = `     
  <div class="meal-header">
  ${random ? `<span class="random">Today's ${mealData.strArea ? ` ${mealData.strArea} ` : "" } ${mealData.strCategory} </span>` : `<span class="random"> ${mealData.strCategory}, ${mealData.strArea} </span> `}
    <img id="meal-img"
    src="${mealData.strMealThumb}" 
    alt="${mealData.strMeal}"
    />
  </div>
  <div class="meal-body">
    <h3>${mealData.strMeal}</h3>
    <button class="fav-btn">
      <i class="fa-solid fa-heart"></i>
    </button>
  </div>
`
  const btn = meal.querySelector(".meal-body .fav-btn")
  btn.addEventListener("click", () => {
      if(btn.classList.contains('active')) {
        removeMealLS(mealData.idMeal)
        btn.classList.remove('active')
      } else {
        addMealLS(mealData.idMeal)
        btn.classList.add('active')
      }
      
      fetchFavMeals()
  })

  mealsEl.appendChild(meal)

  const mealImgEl = document.getElementById("meal-img")
  mealImgEl.addEventListener("click", () => {
    showMealInfo(mealData)
  })
}


function addMealLS(mealId) {
  const mealIds = getMealsLS()
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))
}



function removeMealLS(mealId) {
  const mealIds = getMealsLS()
  localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId))
  )
}



function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"))
  return mealIds === null ? [] : mealIds
}



async function fetchFavMeals() {
  favContainer.innerHTML = ""

  const mealIds = getMealsLS()
  for(let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i]
    meal = await getMealById(mealId)
    
    addMealFav(meal)
  }
}



async function getMealById(id) {
  const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id )

  const respData = await resp.json()
 
  const meal = respData.meals[0]
 
  return meal

}

function addMealFav(mealData) {
  const favMeal = document.createElement("li")
  favMeal.innerHTML = `     
      <img class="fav-img"
    src="${mealData.strMealThumb}" 
    alt="${mealData.strMeal}"
    /><span>${mealData.strMeal}</span>
    <button class ="cancel"><i class="fa-solid fa-xmark"></i></button>
`
  const cancelBtn = favMeal.querySelector('.cancel')
  cancelBtn.addEventListener('click', () => {
    removeMealLS(mealData.idMeal)
    fetchFavMeals()
  })

  favContainer.appendChild(favMeal)
  const favImg = favMeal.querySelector(".fav-img")
  favImg.addEventListener("click", () => {
    showMealInfo(mealData)
  })
}

async function getMealsBySearch(term) {
  const resp = await fetch( "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term)

  const respData = await resp.json();
  const meals = respData.meals
 
  return meals
}

searchBtn.addEventListener('click', async () => {
  mealsEl.innerHTML = ""
  const search = searchTerm.value
  const meals = await getMealsBySearch(search)
  if(meals) {
    meals.forEach((meal) => {
      addMeal(meal)
   })
  }
})

function showMealInfo(mealData) {
  mealInfoEl.innerHTML = ""
  const mealEl = document.createElement('div')
  const ingredients = []

  for(let i= 1 ; i<= 20 ; i++) {
    if(mealData["strIngredient" + i]) {
      ingredients.push(`${mealData["strIngredient"+i]} / ${mealData["strMeasure"+i]}`)
    }else {
      break;
    }
  }

  mealEl.innerHTML = `
  <h1>${mealData.strMeal}</h1>
  <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
  <ul>
    ${ingredients.map(
      (ing) => `<li> ${ing} </li>`).join("")}
  </ul>
  <br>
  <p>${mealData.strInstructions}</p>
  `
  mealInfoEl.appendChild(mealEl)

  mealPopup.classList.remove('hidden')
}



closePopupBtn.addEventListener("click", () => {
  mealPopup.classList.add('hidden')
})

