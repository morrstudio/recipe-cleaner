export const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    websiteName: process.env.NEXT_PUBLIC_WEBSITE_NAME || 'RecipeCleaner',
    maxServings: 20,
    minServings: 1,
    defaultServings: 4,
    supportEmail: 'support@recipecleaner.com',
    social: {
      twitter: 'https://twitter.com/recipecleaner',
      facebook: 'https://facebook.com/recipecleaner',
      instagram: 'https://instagram.com/recipecleaner',
    },
    recipeCategories: [
      'Breakfast',
      'Lunch',
      'Dinner',
      'Dessert',
      'Snack',
      'Appetizer',
      'Drink',
    ],
    dietaryRestrictions: [
      'Vegetarian',
      'Vegan',
      'Gluten-Free',
      'Dairy-Free',
      'Nut-Free',
      'Low-Carb',
      'Keto',
      'Paleo',
    ],
    cookingSkillLevels: [
      'Beginner',
      'Intermediate',
      'Advanced',
      'Professional',
    ],
    defaultPaginationLimit: 10,
  }