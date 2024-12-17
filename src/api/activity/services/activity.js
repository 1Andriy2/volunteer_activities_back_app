// @ts-nocheck
'use strict';

const jaccardIndex = (setA, setB) => {
    const intersection = new Set([...setA].filter(x => setB.has(x))).size;
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
};

// Функція для розрахунку зваженого коефіцієнта Жаккара
const weightedJaccardIndex = (userCategories, activityCategories, categoryWeights) => {
    // Ініціалізація перетину та об'єднання
    let [weightedIntersection, weightedUnion] = [0, 0];

    // Об'єднуємо унікальні категорії користувача та активності
    const allCategories = new Set([...userCategories, ...activityCategories]);

    // Обчислюємо зважений коефіцієнт Жаккара
    for (const categoryId of allCategories) {
        const userWeight = categoryWeights[categoryId] || 0; // Вага категорії
        const inUser = userCategories.has(categoryId) ? userWeight : 0; // Присутність у користувача
        const inActivity = activityCategories.has(categoryId) ? 1 : 0; // Присутність в активності

        weightedIntersection += Math.min(inUser, inActivity); // Перетин
        weightedUnion += Math.max(inUser, inActivity);        // Об'єднання
    }

    // Повертаємо результат
    return weightedUnion ? weightedIntersection / weightedUnion : 0;
};

module.exports = {
    getRecommendations: async (userId) => {
        // Отримуємо користувача з його подіями
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
            populate: ['activities.categories', 'interests', 'skills'],
        });
        console.log(user);

        if (!user) throw new Error('User not found');
    
        const categoryWeights = {};
        let totalWeight = 0;
    
        // Розрахунок ваг для категорій користувача
        user.activities?.forEach(activity => {
            activity.categories?.forEach(category => {
                categoryWeights[category.id] = (categoryWeights[category.id] || 0) + 1;
                totalWeight++;
            });
        });
    
        // Нормалізація ваг
        Object.keys(categoryWeights).forEach(categoryId => {
            categoryWeights[categoryId] = categoryWeights[categoryId] / totalWeight;
        });
    
        console.log('Normalized category weights:', categoryWeights);
        
        const userActivityIds = new Set(user.activities?.map(activity => activity.id) || []);
        const userCategories = new Set(
            user.activities?.flatMap(activity => activity.categories?.map(category => category.id) || []) || []
        );
        const userInterests = new Set(user.interests?.map(interest => interest.name) || []);
        const userSkills = new Set(user.skills?.map(skill => skill.name) || []);
        const userAttributes = new Set([...userActivityIds, ...userInterests, ...userSkills]);

                // Логування інтересів і навичок
        console.log('User interests:', userInterests);
        console.log('User skills:', userSkills);
        console.log('User attributes:', userAttributes);
        // Отримуємо всі активні події
        const activities = await strapi.entityService.findMany('api::activity.activity', {
            populate: ['categories', 'participants.activities', 'participants.interests', 'participants.skills'],
        });
    
        // Масив для таблиці порівняння
        const comparisonTable = [];
    
        // Формуємо рекомендації
        const recommendations = activities.map(activity => {
            const activityCategories = new Set(activity.categories?.map(({ id }) => id) || []);
            const activityParticipants = new Set(activity.participants?.map(({ id }) => id) || []);
        
            const participantAttributes = new Set(
                activity.participants?.flatMap(participant => [
                    ...participant.activities?.map(activity => activity.id) || [],
                    ...participant.interests?.map(interest => interest.name) || [],
                    ...participant.skills?.map(skill => skill.name) || [],
                ]) || []
            );
            
            console.log("Participant Attributes: ", participantAttributes);
            const jaccardContent = weightedJaccardIndex(userCategories, activityCategories, categoryWeights);
            const jaccardUsers = jaccardIndex(userActivityIds, participantAttributes);
            const priority = jaccardContent + jaccardUsers;
        
            // Додаємо до таблиці для аналізу
            comparisonTable.push({ activityName: activity.title, userName: user.username, jaccardContent, jaccardUsers, priority });
        
            return { ...activity, jaccardContent, jaccardUsers, priority };
        });
        
    
        // Сортуємо за пріоритетом
        recommendations.sort((a, b) => b.priority - a.priority);
    
        // Логування таблиці порівняння
        console.table(comparisonTable);
    
        return recommendations;
    },
    
};
