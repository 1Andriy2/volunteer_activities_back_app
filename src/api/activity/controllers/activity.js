'use strict';

module.exports = {
    async recommendations(ctx) {
        try {
            if (!ctx.state.user) {
                return ctx.throw(401, 'User not authenticated');
            }
    
            const userId = ctx.state.user.id; 
            const recommendations = await strapi.service('api::activity.activity').getRecommendations(userId);
            ctx.send(recommendations);
        } catch (err) {
            ctx.throw(400, err.message);
        }
    },    
};
