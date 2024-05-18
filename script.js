let recipesData = '';

function initiateSearch() {
    const query = document.getElementById('search-input').value.trim();
    fetchRecipes(query);
}

document.getElementById('search-button').addEventListener('click', () => {
    console.log('Search button clicked'); // Debugging line
    initiateSearch();
});

document.getElementById('search-input').addEventListener('keypress', (event) => {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        initiateSearch();
    }
});

// Function to fetch recipes based on the search query
function fetchRecipes(query){
    const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + query;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            recipesData = data.meals;
            displayRecipes();
        })
        .catch(error => console.error('Error fetching recipes:', error));
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
    //const source = document.getElementById('modal-source');
    const link = document.getElementById('modal-link');
    const video = document.getElementById('modal-video');
    const label = document.getElementById('modal-label');

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
    label.innerHTML = `<strong>Source: </strong>`
    link.href = recipe.strSource;
    link.textContent = recipe.strSource;

    video.innerHTML = `<iframe width="560" height="315" src="${recipe.strYoutube}" frameborder="0" allowfullscreen></iframe>`;
    const videoId = recipe.strYoutube.split('v=')[1];
    video.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;


    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}