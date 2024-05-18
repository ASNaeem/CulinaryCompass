let recipesData = '';
document.getElementById('search-button').addEventListener('click', () => {
    console.log('Search button clicked'); // Debugging line
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});

function fetchRecipes(query){
	const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + query;
	fetch(url).then(response => response.json()).then(data => {
		console.log('Fetched data:', data);
		recipesData = data.meals;
		displayRecipes();
	}).catch(error => console.error('Error fetching recipes:', error));
}

function displayRecipes(){
	const container = document.getElementById('recipes-container');

	container.innerHTML = '';

	if (recipesData){
		recipesData.forEach(recipe => {
			const recipeElement = document.createElement('div');
			recipeElement.classList.add('recipe');

			recipeElement.innerHTML = `
				<img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <div class="recipe-details">
                    <h3>${recipe.strMeal}</h3>
                    <p><strong>Category:</strong> ${recipe.strCategory}</p>
                    <p><strong>Area:</strong> ${recipe.strArea}</p>
                    <button onclick="showDetails('${recipe.idMeal}')">View Recipe</button>
                </div>
			`;
			container.appendChild(recipeElement);
		});		
	}
	else{
		container.innerHTML = '<p>No recipes found. Please try another search.</p>'
	}
}

function showDetails(idMeal){
	const recipe = recipesData.find(recipe => recipe.idMeal === idMeal);
	if (recipe){
		// alert(`
		// 	${recipe.strMeal}
		// 	Catergory: ${recipe.strCategory}
		// 	Area: ${recipe.strArea}
		// 	Instructions: ${recipe.strInstructions}
		// 	`);
		showModal(recipe);
	}
	else{
		console.error('Recipe details not found.');
	}

}

function showModal(recipe) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const category = document.getElementById('modal-category');
    const area = document.getElementById('modal-area');
    const instructions = document.getElementById('modal-instructions');
    const ingredientsList = document.getElementById('modal-ingredients');

    title.innerHTML = `<strong>${recipe.strMeal}</strong>`;
    category.innerHTML = `<strong>Category:</strong> ${recipe.strCategory}`;
    area.innerHTML = `<strong>Area:</strong> ${recipe.strArea}`;
    instructions.innerHTML = `<strong>Instructions:</strong> ${recipe.strInstructions}`;

    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe['strIngredient' + i];
        const measure = recipe['strMeasure' + i];
        if (ingredient && measure) {
            ingredients += `${measure} ${ingredient}, `;
        }
    }
    ingredients = ingredients.slice(0, -2); // Remove the last comma and space
    ingredientsList.innerHTML = `<strong>Ingredients:</strong> ${ingredients}`;

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}